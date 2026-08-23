import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import User from "@/models/User";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req) {
  try {
    const admin = await requireAdmin(req, ["SUPER_ADMIN", "SUB_ADMIN"]);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("pickupBoutiqueId", "title googleAddress lat long")
      .populate("items.fabricId", "name slug")
      .lean();

    if (!orders.length) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const customerPhones = [...new Set(orders.map((order) => order.userPhone).filter(Boolean))];
    const users = await User.find({ phone: { $in: customerPhones } })
      .select("phone name email")
      .lean();

    const userMap = new Map(users.map((user) => [user.phone, user]));

    const vendorOrders = orders.map((order) => {
      const matchedUser = userMap.get(order.userPhone);

      const fullAddress = order.deliveryType === "HOME"
        ? {
            name: order.deliveryAddress?.name || matchedUser?.name || "Not available",
            phone: order.deliveryAddress?.phone || order.userPhone || "Not available",
            street: order.deliveryAddress?.street || "",
            landmark: order.deliveryAddress?.landmark || "",
            city: order.deliveryAddress?.city || "",
            district: order.deliveryAddress?.district || "",
            state: order.deliveryAddress?.state || "",
            postalCode: order.deliveryAddress?.postalCode || "",
            country: order.deliveryAddress?.country || "India",
          }
        : null;

      const boutiqueAddress = order.deliveryType === "BOUTIQUE"
        ? {
            title: order.pickupBoutiqueId?.title || "Boutique",
            address: order.pickupBoutiqueId?.googleAddress || "Address not available",
            lat: order.pickupBoutiqueId?.lat || null,
            long: order.pickupBoutiqueId?.long || null,
          }
        : null;

      return {
        _id: order._id,
        userPhone: order.userPhone,
        status: order.status,
        deliveryType: order.deliveryType,
        customerName: matchedUser?.name || order.deliveryAddress?.name || "Not available",
        customerEmail: matchedUser?.email || "Not available",
        customerAddress: fullAddress,
        boutiqueAddress,
        items: (order.items || []).map((item) => ({
          name:
            item.name ||
            (typeof item.fabricId === "object" && item.fabricId?.name) ||
            "Fabric item",
          qty: Number(item.qty) || 1,
          productUrl:
            item.fabricId && typeof item.fabricId === "object" && item.fabricId.slug
              ? `/fabrics/${item.fabricId.slug}`
              : null,
        })),
      };
    });

    return NextResponse.json({ success: true, orders: vendorOrders });
  } catch (error) {
    console.error("ADMIN VENDOR ORDERS ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong while loading orders" },
      { status: 500 }
    );
  }
}
