import dbConnect from "@/lib/dbConnect";
import Fabric from "@/models/Fabric";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const projection = {
      // Basic Info
      name: 1,
      slug: 1,
      collectionName: 1,
      material: 1,
      weave: 1,
      color: 1,
      gender: 1,
      width: 1,
      stockLeft: 1,
      description: 1,

      // Images
      images: 1,

      // Price Info
      price: 1,
      customerPrice: 1,
      boutiquePrice: 1,

      // Care Instructions
      careInstructions: 1,

      // FAQs
      faqs: 1,

      // Reviews (ONLY required fields)
      "reviews.name": 1,
      "reviews.stars": 1,
      "reviews.review": 1,
      "reviews.createdAt": 1,

      // Ratings
      avgStars: 1,

      // Status
      status: 1,
    };

    let fabric = null;

    // Try by ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      fabric = await Fabric.findById(id).select(projection).lean();
    }

    // Fallback to slug
    if (!fabric) {
      fabric = await Fabric.findOne({ slug: id }).select(projection).lean();
    }

    if (!fabric) {
      return Response.json({ error: "Fabric not found" }, { status: 404 });
    }
    fabric.stockLeft = fabric.stockLeft ? Number(fabric.stockLeft) : 0;
fabric.width = fabric.width ? Number(fabric.width) : 0;
fabric.price = fabric.price ? Number(fabric.price) : 0;
fabric.customerPrice = fabric.customerPrice ? Number(fabric.customerPrice) : 0;
fabric.boutiquePrice = fabric.boutiquePrice ? Number(fabric.boutiquePrice) : 0;

    return Response.json(fabric);
  } catch (err) {
    console.error("GET /api/fabrics/[id] error:", err);
    return Response.json({ error: "Failed to fetch fabric" }, { status: 500 });
  }
}