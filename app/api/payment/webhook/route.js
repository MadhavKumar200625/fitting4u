import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { captureAuthorizedPayment, markRazorpayPaymentCaptured, timingSafeHexEqual } from "@/lib/razorpayPayment";

export const runtime = "nodejs";

export async function POST(req) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers.get("x-razorpay-signature");
  if (!webhookSecret || !signature) {
    return Response.json({ success: false, error: "Webhook signature is missing" }, { status: 400 });
  }

  const rawBody = await req.text();
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (!timingSafeHexEqual(expectedSignature, signature)) {
    return Response.json({ success: false, error: "Invalid webhook signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(rawBody);
    let payment = event.payload?.payment?.entity;

    if (event.event === "payment.authorized") {
      if (!payment?.order_id || !payment?.id) {
        return Response.json({ success: false, error: "Payment entity is missing" }, { status: 400 });
      }

      await dbConnect();
      const draft = await Order.findOne({ "payment.orderId": payment.order_id });
      if (!draft) {
        return Response.json({ success: false, error: "Matching payment draft was not found" }, { status: 500 });
      }
      if (Number(payment.amount) !== Math.round(Number(draft.total) * 100) || payment.currency !== "INR") {
        return Response.json({ success: false, error: "Payment amount or currency does not match" }, { status: 400 });
      }

      payment = await captureAuthorizedPayment(payment);
      if (payment.status !== "captured") {
        return Response.json({ success: false, error: "Payment capture is still pending" }, { status: 500 });
      }
    }

    if (event.event === "payment.captured" || event.event === "order.paid" || event.event === "payment.authorized") {
      if (!payment?.order_id || !payment?.id) {
        return Response.json({ success: false, error: "Payment entity is missing" }, { status: 400 });
      }

      const order = await markRazorpayPaymentCaptured({
        razorpayOrderId: payment.order_id,
        paymentId: payment.id,
        amount: payment.amount,
        currency: payment.currency,
      });
      if (!order) {
        return Response.json({ success: false, error: "Matching payment draft was not found" }, { status: 500 });
      }
    } else if (event.event === "payment.failed") {
      if (!payment?.order_id || !payment?.id) {
        return Response.json({ success: false, error: "Payment entity is missing" }, { status: 400 });
      }

      await dbConnect();
      const draft = await Order.findOne({ "payment.orderId": payment.order_id });
      if (!draft) {
        return Response.json({ success: false, error: "Matching payment draft was not found" }, { status: 500 });
      }
      if (Number(payment.amount) !== Math.round(Number(draft.total) * 100) || payment.currency !== "INR") {
        return Response.json({ success: false, error: "Payment amount or currency does not match" }, { status: 400 });
      }

      await Order.updateOne(
        { _id: draft._id, "payment.status": { $ne: "PAID" } },
        { $set: { "payment.paymentId": payment.id, "payment.status": "FAILED" } }
      );
    }

    return Response.json({ success: true, received: true });
  } catch (error) {
    console.error("RAZORPAY WEBHOOK ERROR:", error);
    return Response.json({ success: false, error: "Webhook processing failed" }, { status: 500 });
  }
}