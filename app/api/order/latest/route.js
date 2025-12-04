import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Boutique from "@/models/boutiqueSchema";

export async function GET(req) {
  try {
    await dbConnect();

    // ✅ AUTH
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);

    if (!decoded?.phone) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // ✅ GET ORDER
    let order = await Order.findOne({
      userPhone: decoded.phone,
    })
      .sort({ createdAt: -1 })
      .populate("pickupBoutiqueId", "title googleAddress lat long")
      .populate("items.fabricId", "name images material gender slug")
      .lean();

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "No order found",
      });
    }

    /* -------------------------------------------------
       NORMALIZE FABRIC DATA FOR FRONTEND VIEW
    --------------------------------------------------*/
    order.items = order.items.map((item) => {
      const fabric = item.fabricId || {};

      return {
        ...item,

        // Fabric info (safe optional chaining)
        fabric: {
          name: fabric.name || item.name || "",
          category: fabric.material || "",
          gender: fabric.gender || "",
          image: fabric.images?.[0] || null, // ✅ FIRST IMAGE
          slug:fabric.slug||""
        },

        // ensure fabricId does not expose full object
        fabricId: fabric._id || item.fabricId,
      };
    });
    console.log(order.items)
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