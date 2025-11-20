import dbConnect from "@/lib/dbConnect";
import Fabric from "@/models/Fabric";

export async function POST(req) {
  try {
    await dbConnect();

    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ success: false, error: "Cart empty" }, { status: 400 });
    }

    const ids = items.map(i => i.id);

    // Only essential data + first image
    const fabrics = await Fabric.find(
      { _id: { $in: ids } },
      {
        name: 1,
        images: { $slice: 1 },
        customerPrice: 1,
        material: 1
      }
    ).lean();

    let enriched = [];
    let subtotal = 0;

    for (const f of fabrics) {
      const cartItem = items.find(i => i.id == f._id.toString());
      const qty = cartItem?.qty ?? 0;

      const itemSubtotal = f.customerPrice * qty;
      subtotal += itemSubtotal;

      enriched.push({
        _id: f._id,
        name: f.name,
        image: f.images?.[0] || null,
        customerPrice: f.customerPrice,
        material: f.material,
        subtotal: itemSubtotal
      });
    }

    return Response.json({
      success: true,
      items: enriched,
      bill: {
        subtotal,
        delivery: 0,
        total: subtotal
      }
    });

  } catch (err) {
    console.error("POST /api/cart/summary error:", err);
    return Response.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}