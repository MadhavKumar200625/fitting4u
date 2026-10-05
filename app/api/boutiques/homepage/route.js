import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const keys = Array.isArray(body.keys)
      ? [...new Set(body.keys.map((key) => String(key).trim()).filter(Boolean))].slice(0, 50)
      : [];

    if (!keys.length) return NextResponse.json({ boutiques: [] });

    const conditions = [
      { websiteUrl: { $in: keys } },
      ...keys.map((key) => ({ title: new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") })),
    ];
    const objectIds = keys
      .filter((key) => mongoose.isValidObjectId(key))
      .map((key) => new mongoose.Types.ObjectId(key));

    if (objectIds.length) conditions.push({ _id: { $in: objectIds } });

    const boutiques = await Boutique.find({ $or: conditions })
      .select("title websiteUrl tagline type googleAddress businessLogo imageGallery verified status")
      .lean();

    return NextResponse.json({ boutiques });
  } catch (error) {
    console.error("POST /api/boutiques/homepage error:", error);
    return NextResponse.json({ error: "Failed to load homepage boutiques" }, { status: 500 });
  }
}