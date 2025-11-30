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

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        // [ longitude, latitude ]
        type: [Number],
        required: true,
        
      },
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
boutiqueSchema.index({ location: "2dsphere" });

/* ------------------------------
   Pre-save hook: populate `location` from lat/long if not set
   This keeps backward compatibility for documents created before geo field existed
   ------------------------------ */
boutiqueSchema.pre("save", function (next) {
  // `this` is the document
  if (!this.location || !Array.isArray(this.location.coordinates) || this.location.coordinates.length !== 2) {
    if (typeof this.long === "number" && typeof this.lat === "number") {
      // coordinates must be [long, lat]
      this.location = {
        type: "Point",
        coordinates: [this.long, this.lat],
      };
    }
  } else {
    // ensure coordinates order is [long, lat] if someone accidentally stored [lat, long]
    // (best-effort, optional)
    const [a, b] = this.location.coordinates;
    // if lat looks like latitude range (-90..90) and long outside that, we can try to detect
    if (Math.abs(a) <= 90 && Math.abs(b) <= 180 && this.location.coordinates[0] === this.lat && this.location.coordinates[1] === this.long) {
      this.location.coordinates = [this.long, this.lat];
    }
  }
  next();
});
const Boutique =
  mongoose.models.Boutique || mongoose.model("Boutique", boutiqueSchema);

export default Boutique;