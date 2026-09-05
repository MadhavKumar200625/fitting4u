import User from "@/models/User";
import Boutique from "@/models/boutiqueSchema";
import { sendOrderEmail } from "@/lib/mailer";

const statusLabel = (status) => status.replaceAll("_", " ").toLowerCase();

export async function notifyOrderUpdate(order, { created = false, siteUrl } = {}) {
  const customer = await User.findOne({ email: order.userPhone }).select("email name").lean();
  const boutique = order.deliveryType === "BOUTIQUE" && order.pickupBoutiqueId
    ? await Boutique.findById(order.pickupBoutiqueId).select("email title").lean()
    : null;
  const vendorEmail = process.env.ORDER_VENDOR_EMAIL?.trim();
  const isPickedUp = order.status === "PICKED_UP";
  const event = created ? "New order" : `Order ${statusLabel(order.status)}`;
  const customerMessage = isPickedUp
    ? "Your order has been marked as picked up. Thank you for shopping with Fitting4U."
    : `Your order status is now ${statusLabel(order.status)}.`;

  const customerEmail = customer?.email || (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.userPhone || "") ? order.userPhone : null);
  const deliveries = [
    customerEmail && sendOrderEmail({
      to: customerEmail,
      subject: `${event}: Fitting4U order`,
      heading: "Your Fitting4U order update",
      message: customerMessage,
      order,
      siteUrl,
      includeOrderId: !created,
      invoice: created,
    }),
    vendorEmail && sendOrderEmail({
      to: vendorEmail,
      subject: "Fitting4U fabric order update",
      heading: "Fabric order update",
      message: `The order is ${statusLabel(order.status)}. The requested fabrics are below.`,
      order,
      siteUrl,
      includeOrderId: false,
    }),
    boutique?.email && sendOrderEmail({
      to: boutique.email,
      subject: `${event}: pickup order ${order._id}`,
      heading: `Pickup order for ${boutique.title || "your boutique"}`,
      message: isPickedUp
        ? `The customer has collected order ${order._id}.`
        : `Order ${order._id} is ${statusLabel(order.status)} and is assigned to your boutique.`,
      order,
      siteUrl,
    }),
  ].filter(Boolean);

  const results = await Promise.allSettled(deliveries);
  results.filter((result) => result.status === "rejected").forEach((result) =>
    console.error("ORDER EMAIL ERROR:", result.reason)
  );
}
