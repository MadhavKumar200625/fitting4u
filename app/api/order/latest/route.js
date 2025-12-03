import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Boutique from "@/models/boutiqueSchema";


export async function GET(req) {
  try {
    await dbConnect();

    // ✅ get auth token
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.decode(token);

    if (!decoded?.phone) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    // ✅ get latest order for this phone
    const order = await Order.findOne({
      userPhone: decoded.phone,
    })
      .sort({ createdAt: -1 })
        .populate("pickupBoutiqueId", "title googleAddress lat long");


    if (!order) {
      return NextResponse.json({ success: false, message: "No order found" });
    }

    console.log(order)

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (err) {
    console.error("LATEST ORDER ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}