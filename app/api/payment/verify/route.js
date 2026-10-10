import crypto from "crypto";
import Razorpay from "razorpay";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { captureAuthorizedPayment, markRazorpayPaymentCaptured, timingSafeHexEqual } from "@/lib/razorpayPayment";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ success: false, error: "Payment details are incomplete" }, { status: 400 });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (!timingSafeHexEqual(expectedSign, razorpay_signature)) {
      return Response.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    let payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.order_id !== razorpay_order_id || payment.currency !== "INR") {
      return Response.json({ success: false, error: "Payment does not match the Razorpay order" }, { status: 400 });
    }

    await dbConnect();
    const draft = await Order.findOne({ "payment.orderId": razorpay_order_id });
    if (!draft) {
      return Response.json({ success: false, error: "Payment order was not found" }, { status: 404 });
    }
    if (Number(payment.amount) !== Math.round(Number(draft.total) * 100)) {
      return Response.json({ success: false, error: "Payment amount does not match the order" }, { status: 400 });
    }

    payment = await captureAuthorizedPayment(payment);
    if (payment.status === "captured") {
      await markRazorpayPaymentCaptured({
        razorpayOrderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        amount: payment.amount,
        currency: payment.currency,
        siteUrl: new URL(req.url).origin,
      });
    }

    return Response.json({ success: true, captured: payment.status === "captured" });
  } catch (error) {
    console.error("RAZORPAY VERIFY ERROR:", error);
    return Response.json({ success: false, error: "Payment verification failed" }, { status: 500 });
  }
}