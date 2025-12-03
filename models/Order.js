import mongoose from "mongoose";

/* -----------------------------
   DELIVERY ADDRESS SCHEMA
------------------------------*/
const AddressSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    street: String,
    landmark: String,
    city: String,
    district: String,
    state: String,
    postalCode: String,
    country: { type: String, default: "India" },
  },
  { _id: false }
);

/* -----------------------------
   ORDER ITEM SCHEMA
------------------------------*/
const OrderItemSchema = new mongoose.Schema(
  {
    fabricId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fabric",
      required: true,
    },
    name: String,
    qty: { type: Number, required: true },
    price: { type: Number, required: true },     // price per meter
    subtotal: { type: Number, required: true }, // qty * price
  },
  { _id: false }
);

/* -----------------------------
   PAYMENT SCHEMA
------------------------------*/
const PaymentSchema = new mongoose.Schema(
  {
    provider: { type: String, default: "razorpay" },

    orderId: String,
    paymentId: String,
    signature: String,

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
  },
  { _id: false }
);

/* -----------------------------
   MAIN ORDER SCHEMA
------------------------------*/
const OrderSchema = new mongoose.Schema(
  {
    // -------------------------
    // CUSTOMER INFO
    // -------------------------
    userPhone: {
      type: String,
      required: true,
      index: true,
    },

    // -------------------------
    // ITEMS
    // -------------------------
    items: {
      type: [OrderItemSchema],
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    // -------------------------
    // DELIVERY MODE
    // -------------------------
    deliveryType: {
      type: String,
      enum: ["HOME", "BOUTIQUE"],
      required: true,
    },

    // Only when deliveryType === "HOME"
    deliveryAddress: {
      type: AddressSchema,
      default: null,
    },

    // Only when deliveryType === "BOUTIQUE"
    pickupBoutiqueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique",
      default: null,
    },

    // -------------------------
    // PAYMENT
    // -------------------------
    payment: PaymentSchema,

    // -------------------------
    // ORDER STATUS
    // -------------------------
    status: {
      type: String,
      enum: [
        "CREATED",         // order created
        "PAID",            // payment success
        "PROCESSING",      // tailoring / packing
        "READY_FOR_PICKUP",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "CREATED",
    },

    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);