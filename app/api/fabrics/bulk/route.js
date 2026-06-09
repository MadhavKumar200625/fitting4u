import dbConnect from "@/lib/dbConnect";
import Fabric from "@/models/Fabric";

export async function POST(req) {
  try {
    await dbConnect();
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0)
      return Response.json({ error: "Invalid or empty fabric IDs" }, { status: 400 });

    const fabrics = await Fabric.find({ _id: { $in: ids } }).lean();

    return Response.json({ success: true, fabrics });
  } catch (err) {
    console.error("POST /api/fabrics/bulk error:", err);
    return Response.json({ error: "Failed to fetch fabrics" }, { status: 500 });
  }
}