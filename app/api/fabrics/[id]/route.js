import dbConnect from "@/lib/dbConnect";
import Fabric from "@/models/Fabric";
import mongoose from "mongoose";

// ========================
// 🔍 GET — Single Fabric
// ========================
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    let fabric = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      fabric = await Fabric.findById(id).lean();
    }

    if (!fabric) {
      fabric = await Fabric.findOne({ slug: id }).lean();
    }

    if (!fabric) {
      return Response.json({ error: "Fabric not found" }, { status: 404 });
    }

    return Response.json(fabric);
  } catch (err) {
    console.error("GET /api/fabrics/[id] error:", err);
    return Response.json({ error: "Failed to fetch fabric" }, { status: 500 });
  }
}

// ========================
// ✏️ PUT — Update Fabric
// ========================
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const updates = await req.json();

    const fabric = await Fabric.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!fabric)
      return Response.json({ error: "Fabric not found" }, { status: 404 });

    return Response.json({ success: true, fabric });
  } catch (err) {
    console.error("PUT /api/fabrics/[id] error:", err);
    return Response.json({ error: "Failed to update fabric" }, { status: 500 });
  }
}

// ========================
// 🗑️ DELETE — Remove Fabric
// ========================
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const deleted = await Fabric.findByIdAndDelete(id);

    if (!deleted)
      return Response.json({ error: "Fabric not found" }, { status: 404 });

    return Response.json({ success: true, message: "Fabric deleted" });
  } catch (err) {
    console.error("DELETE /api/fabrics/[id] error:", err);
    return Response.json({ error: "Failed to delete fabric" }, { status: 500 });
  }
}