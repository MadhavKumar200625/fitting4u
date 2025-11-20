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

    // Fetch fabrics as in bulk API
    const fabrics = await Fabric.find({ _id: { $in: ids } }).lean();

    // Merge fabric info with qty + subtotal
    const enrichedItems = fabrics.map(f => {
      const cartItem = items.find(i => i.id == f._id.toString());
      const qty = cartItem?.qty || 0;

      const subtotal = f.customerPrice * qty;

      return {
        _id: f._id,
        name: f.name,
        images: f.images,
        customerPrice: f.customerPrice,
        material: f.material,
        qty,
        subtotal
      };
    });

    // Calculate bill
    const subtotal = enrichedItems.reduce((sum, it) => sum + it.subtotal, 0);

    const response = {
      success: true,
      items: enrichedItems,
      bill: {
        subtotal,
        delivery: 0,
        total: subtotal,
      }
    };

    return Response.json(response);

  } catch (err) {
    console.error("POST /api/cart/summary error:", err);
    return Response.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}