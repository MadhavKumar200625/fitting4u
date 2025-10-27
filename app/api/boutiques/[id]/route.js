import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";
import { verifyAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const boutique = await Boutique.findById(params.id);
    if (!boutique) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(boutique);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching boutique" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const auth = verifyAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await Boutique.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating boutique" }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const auth = verifyAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.message }, { status: 401 });
  }

  try {
    await Boutique.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Boutique deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error deleting boutique" }, { status: 400 });
  }
}