import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Fabric from "@/models/Fabric";
import Boutique from "@/models/boutiqueSchema";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { notifyOrderUpdate } from "@/lib/orderNotifications";

/* ----------------------------------------------------------------
   CREATE ORDER API
   POST /api/order
---------------------------------------------------------------- */
export async function POST(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(authHeader.replace("Bearer ", ""), process.env.JWT_SECRET || "dev-temp-secret");
    } catch {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    if (!decoded?.email) {
      return NextResponse.json({ success: false, message: "Invalid token payload" }, { status: 401 });
    }

    const body = await req.json();

    const {
      items,
      total,

      deliveryType,
      deliveryAddress,
      pickupBoutiqueId,
      pickupContactName,
      pickupContactPhone,

      payment,
    } = body;
    const pickupPhoneDigits = String(pickupContactPhone || "").replace(/\D/g, "");
    const normalizedPickupPhone = pickupPhoneDigits.length === 12 && pickupPhoneDigits.startsWith("91")
      ? pickupPhoneDigits.slice(2)
      : pickupPhoneDigits;

    /* -------------------------------------
       BASIC VALIDATION
    --------------------------------------*/
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order items missing" },
        { status: 400 }
      );
    }

    if (!total || Number(total) <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order total" },
        { status: 400 }
      );
    }

    if (!deliveryType || !["HOME", "BOUTIQUE"].includes(deliveryType)) {
      return NextResponse.json(
        { success: false, message: "Invalid delivery type" },
        { status: 400 }
      );
    }

    /* -------------------------------------
       DELIVERY VALIDATION
    --------------------------------------*/
    if (deliveryType === "HOME") {
      if (!deliveryAddress?.street || !deliveryAddress?.city) {
        return NextResponse.json(
          { success: false, message: "Delivery address incomplete" },
          { status: 400 }
        );
      }
    }

    if (deliveryType === "BOUTIQUE") {
      if (!pickupBoutiqueId || !pickupContactName?.trim() || !/^[6-9]\d{9}$/.test(normalizedPickupPhone)) {
        return NextResponse.json(
          {
            success: false,
            message: "Please select a boutique and enter the pickup person's name and a valid Indian mobile number",
          },
          { status: 400 }
        );
      }

      const boutiqueExists = await Boutique.exists({ _id: pickupBoutiqueId });
      if (!boutiqueExists) {
        return NextResponse.json({ success: false, message: "Selected boutique was not found" }, { status: 404 });
      }

      const phoneInUse = await User.exists({
        phone: `+91${normalizedPickupPhone}`,
        email: { $ne: decoded.email },
      });
      if (phoneInUse) {
        return NextResponse.json({ success: false, message: "This mobile number is already linked to another account" }, { status: 409 });
      }
    }

    /* -------------------------------------
       VALIDATE ITEMS AGAINST DB
    --------------------------------------*/
    let verifiedTotal = 0;

    for (const item of items) {
      if (!item.fabricId || !item.qty || !item.price) {
        return NextResponse.json(
          { success: false, message: "Invalid item format" },
          { status: 400 }
        );
      }

      const quantity = Number(item.qty);
      if (
        !Number.isFinite(quantity) ||
        quantity < 1 ||
        Math.abs(quantity * 10 - Math.round(quantity * 10)) > 1e-8
      ) {
        return NextResponse.json(
          { success: false, message: "Each fabric quantity must be at least 1 meter in 0.1 meter increments" },
          { status: 400 }
        );
      }

      // Optional but recommended anti-tamper check
      const fabric = await Fabric.findById(item.fabricId);
      if (!fabric) {
        return NextResponse.json(
          { success: false, message: "Fabric not found" },
          { status: 404 }
        );
      }

      const expectedPrice = decoded.isBoutique === true
        ? fabric.boutiquePrice
        : fabric.customerPrice;

      if (expectedPrice == null) {
        return NextResponse.json(
          { success: false, message: `Price is unavailable for ${fabric.name}` },
          { status: 400 }
        );
      }

      if (Number(item.price) !== Number(expectedPrice)) {
        return NextResponse.json(
          {
            success: false,
            message: `Price mismatch for ${fabric.name}`,
          },
          { status: 400 }
        );
      }

      verifiedTotal += expectedPrice * quantity;
    }

    verifiedTotal = Number(verifiedTotal.toFixed(2));

    if (verifiedTotal !== Number(total.toFixed?.(2) || total)) {
      return NextResponse.json(
        {
          success: false,
          message: "Order total mismatch",
          serverTotal: verifiedTotal,
          clientTotal: total,
        },
        { status: 400 }
      );
    }

    /* -------------------------------------
       CREATE ORDER DOCUMENT
    --------------------------------------*/
    if (deliveryType === "BOUTIQUE") {
      await User.findOneAndUpdate(
        { email: decoded.email },
        { $set: { name: pickupContactName.trim(), phone: `+91${normalizedPickupPhone}` } },
        { new: true }
      );
    }

    const order = await Order.create({
      userPhone: decoded.email,
      items,
      total: verifiedTotal,

      deliveryType,

      deliveryAddress:
        deliveryType === "HOME" ? deliveryAddress : null,

      pickupBoutiqueId:
        deliveryType === "BOUTIQUE" ? pickupBoutiqueId : null,

      pickupContactName: deliveryType === "BOUTIQUE" ? pickupContactName.trim() : "",
      pickupContactPhone: deliveryType === "BOUTIQUE" ? `+91${normalizedPickupPhone}` : "",

      payment: {
  provider: "razorpay",
  orderId: payment?.razorpay_order_id || payment?.orderId,
  paymentId: payment?.razorpay_payment_id || payment?.paymentId,
  signature: payment?.razorpay_signature || payment?.signature,
  status: payment?.status || "PENDING",
},

      status: "CREATED",
    });

    // Email failures are logged inside the notifier and never roll back a paid order.
    await order.populate("items.fabricId", "name slug material color gender images");
    await notifyOrderUpdate(order, { created: true, siteUrl: new URL(req.url).origin });

    /* -------------------------------------
       SUCCESS RESPONSE
    --------------------------------------*/
    return NextResponse.json({
      success: true,
      message: "Order created",
      orderId: order._id,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while creating order",
      },
      { status: 500 }
    );
  }
}
