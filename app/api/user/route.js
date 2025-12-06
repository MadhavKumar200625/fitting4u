import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import User from "@/models/User";
import Boutique from "@/models/boutiqueSchema";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
  await dbConnect();

  try {
    const { phone, deviceInfo } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    const normalizedPhone = phone.trim();
    const deviceValue = deviceInfo?.trim() || "website";

    // Find or create user
    let user = await User.findOne({ phone: normalizedPhone });

    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
        lastLogin: new Date(),
        deviceInfo: deviceValue,
      });
    } else {
      user.lastLogin = new Date();
      user.deviceInfo = deviceValue;
      await user.save();
    }

    // Check if boutique owner
    const boutique = await Boutique.findOne({ phoneNumber: normalizedPhone });
    const isBoutique = !!boutique;

    // 🔥 Generate JWT
    const secret = process.env.JWT_SECRET || "dev-temp-secret";

    const token = jwt.sign(
      { phone: normalizedPhone },
      secret,
      { expiresIn: "180d" } // recommended expiry for mobile apps
    );

    return NextResponse.json({
      success: true,
      isBoutique,
      phoneNumber: user.phone,
      token,                // 🔥 return JWT here
    });

  } catch (error) {
    console.error("POST /user error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* ------------------------- GET USER ------------------------- */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("GET /user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ------------------------- UPDATE USER ------------------------- */
export async function PUT(req) {
  try {
    const body = await req.json();
    const { phone, updateData } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    if (!updateData || typeof updateData !== "object") {
      return NextResponse.json({ error: "updateData object is required" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate({ phone }, updateData, {
      new: true,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User updated", data: user });
  } catch (error) {
    console.error("PUT /user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ------------------------- DELETE USER ------------------------- */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const deletedUser = await User.findOneAndDelete({ phone });
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("DELETE /user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ------------------------- UPDATE ANALYTICS / ACTIVITY ------------------------- */
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { phone, action, details } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ error: "Action field is required" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { phone },
      {
        $push: {
          activity: { action, details, timestamp: new Date() },
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User activity updated",
      data: user,
    });
  } catch (error) {
    console.error("PATCH /user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}