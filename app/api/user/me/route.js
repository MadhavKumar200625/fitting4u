import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET(req) {
  try {
    await dbConnect();

    // ✅ AUTH HEADER
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // ✅ VERIFY TOKEN
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!decoded?.phone) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload" },
        { status: 401 }
      );
    }

    // ✅ FIND USER
    const user = await User
      .findOne(
        { phone: decoded.phone },
        { name: 1, phone: 1, email: 1, address: 1 }
      )
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    let enrichedUser = { ...user };

    /* ---------------------------------------------------
       AUTO-FILL PROFILE FROM LATEST HOME ORDER (READ ONLY)
    ---------------------------------------------------- */
    const needsName = !enrichedUser.name;


const needsAddress =
  !enrichedUser.address ||
  !Object.values(enrichedUser.address)
    .filter(v => v !== "India")
    .some(Boolean);


if (needsName || needsAddress) {
  const lastHomeOrder = await Order.findOne({
    userPhone: decoded.phone,
    deliveryType: "HOME",
    "deliveryAddress.street": { $exists: true },
  })
    .sort({ createdAt: -1 })
    .select("deliveryAddress")
    .lean();

  if (lastHomeOrder?.deliveryAddress) {
    const addr = lastHomeOrder.deliveryAddress;

    if (needsName && addr.name) {
      enrichedUser.name = addr.name;
    }

    if (needsAddress) {
      enrichedUser.address = {
        street: addr.street || "",
        landmark: addr.landmark || "",
        city: addr.city || "",
        district: addr.district || "",
        state: addr.state || "",
        postalCode: addr.postalCode || "",
        country: addr.country || "India",
      };
    }
  }
}


    /* --------------------------------------------------- */

    return NextResponse.json({
      success: true,
      user: enrichedUser,
    });

  } catch (err) {
    console.error("USER ME ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}