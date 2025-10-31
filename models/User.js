import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName: { type: String, trim: true },
  phone: { type: String, trim: true },
  addressLine1: { type: String, trim: true },
  addressLine2: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, default: "India", trim: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    // 👤 Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    // 🔐 Authentication
    passwordHash: {
      type: String,
      required: true,
      select: false, // Excluded from queries by default
    },

    // 👑 Roles — controls access levels
    role: {
      type: String,
      enum: ["customer", "boutique", "admin"],
      default: "customer",
    },

    // 🧵 Boutique linkage (if owner)
    boutiqueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique",
      required: false,
    },

    // 🏠 Address Book
    addresses: [addressSchema],

    // 💬 Reviews (reverse reference)
    reviews: [
      {
        fabricId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Fabric",
        },
        stars: { type: Number, min: 1, max: 5 },
        review: { type: String, trim: true },
      },
    ],

    // 🌟 Account Status
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    // 📅 Metadata
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;