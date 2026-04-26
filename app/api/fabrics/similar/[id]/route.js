import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Fabric from "@/models/Fabric";
import dbConnect from "@/lib/dbConnect";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid fabric ID" },
        { status: 400 }
      );
    }

    // 1. Get current fabric
    const currentFabric = await Fabric.findById(id);

    if (!currentFabric) {
      return NextResponse.json(
        { success: false, message: "Fabric not found" },
        { status: 404 }
      );
    }

    // 2. Build similarity logic
    const priceRangeMin = currentFabric.price * 0.7;
    const priceRangeMax = currentFabric.price * 1.3;

    const similarFabrics = await Fabric.aggregate([
  {
    $match: {
      _id: { $ne: new mongoose.Types.ObjectId(id) },
      status: "Active",
    },
  },
  {
    $addFields: {
      score: {
        $add: [
          { $cond: [{ $eq: ["$material", currentFabric.material] }, 3, 0] },
          { $cond: [{ $eq: ["$weave", currentFabric.weave] }, 2, 0] },
          { $cond: [{ $eq: ["$color", currentFabric.color] }, 1, 0] },
        ],
      },
    },
  },
  { $match: { score: { $gt: 0 } } },
  { $sort: { score: -1, avgStars: -1 } },
  { $limit: 8 },
]);
      

    return NextResponse.json({
      success: true,
      count: similarFabrics.length,
      data: similarFabrics,
    });
  } catch (error) {
    console.error("Similar Fabrics Error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}