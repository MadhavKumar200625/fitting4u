import mongoose from "mongoose";

const seoSchema = new mongoose.Schema({
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  keywords: [{ type: String, trim: true }],
});

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: false,
    },
    name: { type: String, required: true, trim: true },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    review: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
});

const fabricSchema = new mongoose.Schema(
  {
    collectionName: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

    images: [{ type: String, trim: true }], // e.g., slug/1.webp, slug/2.webp, etc.

    price: { type: Number, required: true },
    customerPrice: { type: Number, required: true },
    boutiquePrice: { type: Number, required: true },

    stockLeft: { type: Number, default: 0 },
    width: { type: Number, required: true },
    material: { type: String, required: true, trim: true },
    weave: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },

    description: { type: String, required: true, trim: true },

    careInstructions: [{ type: String, trim: true }],

    faqs: [faqSchema],

    reviews: [reviewSchema],

    avgStars: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    seo: seoSchema,
    status: {
      type: String,
      enum: ["Active", "Inactive", "Draft"],
      default: "Active",
    },
  },
  { timestamps: true }
);

fabricSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const avg =
      this.reviews.reduce((acc, r) => acc + (r.stars || 0), 0) /
      this.reviews.length;
    this.avgStars = Math.round(avg * 10) / 10;
  } else {
    this.avgStars = 0;
  }
  next();
});

const Fabric = mongoose.models.Fabric || mongoose.model("Fabric", fabricSchema);
export default Fabric;