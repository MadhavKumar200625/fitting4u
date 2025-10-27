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

export async function GET() {
  await dbConnect();
  try {
    const boutiques = await Boutique.find().sort({ createdAt: -1 });
    return NextResponse.json(boutiques);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch boutiques" }, { status: 500 });
  }
}