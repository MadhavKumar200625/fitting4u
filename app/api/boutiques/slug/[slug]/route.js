import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { slug } = await params; 


    const boutique = await Boutique.findOne({ websiteUrl: slug });

    if (!boutique) {
      return NextResponse.json({ error: "Boutique not found" }, { status: 404 });
    }
    

    return NextResponse.json(boutique, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching boutique:", error);
    return NextResponse.json({ error: "Error fetching boutique" }, { status: 500 });
  }
}