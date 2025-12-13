import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req) {
  try {
    await dbConnect();

    const admin = await requireAdmin(req, ["SUPER_ADMIN"]);
    if (!admin)
      return NextResponse.json({ success: false }, { status: 401 });

    const q = req.nextUrl.searchParams.get("q");

    if (!q)
      return NextResponse.json({ success: true, orders: [] });

    const orders = await Order.find({
      $or: [
        { _id: q },
        { userPhone: q },
        { status: q },
      ]
    })
      .populate("pickupBoutiqueId", "title")
      .populate("items.fabricId", "name");

    return NextResponse.json({ success: true, orders });

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}