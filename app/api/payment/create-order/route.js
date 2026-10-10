import Razorpay from "razorpay";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || "dev-temp-secret");
    } catch {
      return Response.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
    }

    if (!decoded?.email || !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return Response.json({ success: false, error: "Payment configuration is incomplete" }, { status: 500 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return Response.json({ success: false, error: "Order draft is required" }, { status: 400 });
    }

    await dbConnect();
    const draft = await Order.findOne({
      _id: orderId,
      userPhone: decoded.email,
      "payment.status": "PENDING",
      "payment.orderId": { $in: [null, ""] },
    });
    if (!draft) {
      return Response.json({ success: false, error: "Payment draft not found" }, { status: 404 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentOrder = await razorpay.orders.create({
      amount: Math.round(Number(draft.total) * 100),
      currency: "INR",
      receipt: `fit4u_${draft._id}`,
      notes: { orderId: draft._id.toString() },
    });

    draft.payment.orderId = paymentOrder.id;
    await draft.save();

    return Response.json({ success: true, order: paymentOrder });
  } catch (err) {
    console.error("RAZORPAY ORDER ERROR:", err);
    return Response.json(
      { success: false, error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}