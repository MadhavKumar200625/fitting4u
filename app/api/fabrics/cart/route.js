import dbConnect from "@/lib/dbConnect";
import Fabric from "@/models/Fabric";

export async function POST(req) {
  try {
    await dbConnect();

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return Response.json({ success: false, error: "No fabric IDs provided" }, { status: 400 });
    }

    // Fetch required fabric data only
    const fabrics = await Fabric.find(
      { _id: { $in: ids } },
      {
        name: 1,
        images: { $slice: 1 }, // return only first image
        customerPrice: 1,
        material: 1
      }
    ).lean();

    // Return data exactly as needed
    return Response.json({
      items: fabrics,
      bill: {
        // Android will send qty separately
        note: "Send qty array + prices to calculate totals on your side."
      }
    });

  } catch (err) {
    console.error("POST /api/cart/summary error:", err);
    return Response.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}