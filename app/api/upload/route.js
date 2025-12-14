import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

/* --------------------------------
   📤 GENERATE UPLOAD URL (LOCAL)
---------------------------------*/
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required" },
        { status: 400 }
      );
    }

    // this URL will be used for PUT
    const uploadUrl = `/api/upload?fileName=${encodeURIComponent(fileName)}`;

    // public URL
    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (err) {
    console.error("UPLOAD URL ERROR:", err);
    return NextResponse.json(
      { error: "Upload URL generation failed" },
      { status: 500 }
    );
  }
}

/* --------------------------------
   📥 WRITE FILE TO DISK
---------------------------------*/
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await req.arrayBuffer());

    const filePath = path.join(UPLOAD_ROOT, fileName);
    const dir = path.dirname(filePath);

    // ensure directory exists
    fs.mkdirSync(dir, { recursive: true });

    // write file
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("FILE WRITE ERROR:", err);
    return NextResponse.json(
      { error: "File upload failed" },
      { status: 500 }
    );
  }
}

/* --------------------------------
   ❌ DELETE FILE
---------------------------------*/
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Missing 'key'" },
        { status: 400 }
      );
    }

    const filePath = path.join(UPLOAD_ROOT, key);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json(
      { error: "File delete failed" },
      { status: 500 }
    );
  }
}