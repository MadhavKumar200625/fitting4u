import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";
import { verifyAuth } from "@/lib/auth";

export async function POST(req) {
  await dbConnect();
  const auth = verifyAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const boutique = await Boutique.create(body);
    return NextResponse.json(boutique, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create boutique" }, { status: 400 });
  }
}

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = 20;
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { priceRange: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
        { googleAddress: { $regex: search, $options: "i" } },
      ];
    }

    const [boutiques, total] = await Promise.all([
      Boutique.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Boutique.countDocuments(query),
    ]);

    return NextResponse.json({
      boutiques,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch boutiques" }, { status: 500 });
  }
}
