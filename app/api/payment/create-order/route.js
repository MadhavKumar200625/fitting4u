import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const { amount } = await req.json();



    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // INR -> paisa
      currency: "INR",
      receipt: `fitting4u_${Date.now()}`,
    });

    return Response.json({ success: true, order });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}