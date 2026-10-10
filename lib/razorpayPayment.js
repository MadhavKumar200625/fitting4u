import crypto from "crypto";
import Razorpay from "razorpay";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { notifyOrderUpdate } from "@/lib/orderNotifications";

export function timingSafeHexEqual(expectedHex, actualHex) {
  if (typeof actualHex !== "string" || !/^[a-f0-9]+$/i.test(actualHex)) {
    return false;
  }

  const expected = Buffer.from(expectedHex, "hex");
  const actual = Buffer.from(actualHex, "hex");
  return expected.length > 0 && expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export async function captureAuthorizedPayment(payment) {
  if (payment.status !== "authorized") return payment;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    return await razorpay.payments.capture(payment.id, payment.amount, payment.currency);
  } catch (error) {
    const refreshedPayment = await razorpay.payments.fetch(payment.id);
    if (refreshedPayment.status === "captured") return refreshedPayment;
    throw error;
  }
}

export async function markRazorpayPaymentCaptured({
  razorpayOrderId,
  paymentId,
  signature,
  amount,
  currency,
  siteUrl,
}) {
  await dbConnect();

  const draft = await Order.findOne({ "payment.orderId": razorpayOrderId });
  if (!draft) return null;

  const expectedAmount = Math.round(Number(draft.total) * 100);
  if (Number(amount) !== expectedAmount || currency !== "INR") {
    throw new Error("Razorpay payment amount or currency does not match the order");
  }

  if (draft.payment?.status === "PAID") return draft;

  const paidOrder = await Order.findOneAndUpdate(
    { _id: draft._id, "payment.status": { $ne: "PAID" } },
    {
      $set: {
        "payment.paymentId": paymentId,
        "payment.signature": signature || "",
        "payment.status": "PAID",
        status: "PAID",
      },
    },
    { new: true }
  );

  if (!paidOrder) return Order.findById(draft._id);

  await paidOrder.populate("items.fabricId", "name slug material color gender images");
  await notifyOrderUpdate(paidOrder, {
    created: true,
    siteUrl: siteUrl || process.env.NEXT_PUBLIC_BASE_URL || "https://www.fitting4u.com",
  });
  return paidOrder;
}