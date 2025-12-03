import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Fabric from "@/models/Fabric";

/* ----------------------------------------------------------------
   CREATE ORDER API
   POST /api/order
---------------------------------------------------------------- */
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      userPhone,
      items,
      total,

      deliveryType,
      deliveryAddress,
      pickupBoutiqueId,

      payment,
    } = body;

    /* -------------------------------------
       BASIC VALIDATION
    --------------------------------------*/
    if (!userPhone) {
      return NextResponse.json(
        { success: false, message: "User phone required" },
        { status: 400 }
      );
    }

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
      if (!pickupBoutiqueId) {
        return NextResponse.json(
          {
            success: false,
            message: "Boutique pickup selected but boutiqueId missing",
          },
          { status: 400 }
        );
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

      // Optional but recommended anti-tamper check
      const fabric = await Fabric.findById(item.fabricId);
      if (!fabric) {
        return NextResponse.json(
          { success: false, message: "Fabric not found" },
          { status: 404 }
        );
      }

      const expectedPrice = fabric.customerPrice;

      if (Number(item.price) !== Number(expectedPrice)) {
        return NextResponse.json(
          {
            success: false,
            message: `Price mismatch for ${fabric.name}`,
          },
          { status: 400 }
        );
      }

      verifiedTotal += expectedPrice * item.qty;
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
    const order = await Order.create({
      userPhone,
      items,
      total: verifiedTotal,

      deliveryType,

      deliveryAddress:
        deliveryType === "HOME" ? deliveryAddress : null,

      pickupBoutiqueId:
        deliveryType === "BOUTIQUE" ? pickupBoutiqueId : null,

      payment: {
        provider: "razorpay",
        orderId: payment?.orderId,
        paymentId: payment?.paymentId,
        signature: payment?.signature,
        status: payment?.status || "PENDING",
      },

      status: "CREATED",
    });

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