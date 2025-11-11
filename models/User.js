import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    district: { type: String, trim: true, default: "" },
    postalCode: { type: String, trim: true, default: "" },
    landmark: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "India" },
  },
  { _id: false } 
);

const UserSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\+91\d{10}$/, "Invalid phone number format"],
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: AddressSchema,
      default: {},
    },

    userType: {
      type: String,
      enum: ["boutique", "customer"],
      default: "customer",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },

    deviceInfo: {
      type: String,
      default: null,
    },

    activity: [
      {
        action: String, 
        details: Object,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// ✅ Avoid model overwrite in Next.js hot reload
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;