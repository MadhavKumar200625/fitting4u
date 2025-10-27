import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
});

const businessHourSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  open: { type: String, trim: true },
  close: { type: String, trim: true },
  isClosed: { type: Boolean, default: false },
});

const boutiqueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },

    // SEO Metadata
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      keywords: [{ type: String, trim: true }],
    },

    // Location
    googleAddress: {
      type: String,
      trim: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },

    // Contact
    phoneNumber: {
      type: String,
      trim: true,
    },
    whatsappNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    websiteUrl: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Acts as slug
    },

    // Social Media
    socialLinks: {
      x: { type: String, trim: true },
      facebook: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      youtube: { type: String, trim: true },
    },

    // Media
    imageGallery: [
      {
        type: String,
        trim: true,
      },
    ],
    businessLogo: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },

    // Business Info
    priceRange: {
      type: String,
      enum: ["Low", "Medium", "High", "Luxury"],
      default: "Medium",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    faqs: [faqSchema],
    businessHours: [businessHourSchema],
    type: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      default: "Unisex",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Draft"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Boutique =
  mongoose.models.Boutique || mongoose.model("Boutique", boutiqueSchema);

export default Boutique;