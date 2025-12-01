import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const LOGIN_LOG_SCHEMA = new mongoose.Schema(
  {
    at: { type: Date, default: Date.now },
    ip: String,
    userAgent: String,
    success: { type: Boolean, default: false },
  },
  { _id: false }
);

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true }, // OTP via Firebase
    email: { type: String, trim: true, lowercase: true },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "SUB_ADMIN"],
      default: "SUB_ADMIN",
    },

    // BCrypt hash
    passwordHash: { type: String, required: true },

    // Which admin routes they can access
    allowedRoutes: [{ type: String, trim: true }], // e.g. "/admin/fabric-management"

    isActive: { type: Boolean, default: true },

    // Optional: last login information
    lastLoginAt: { type: Date },
    loginLogs: [LOGIN_LOG_SCHEMA],

    // If you want to tie with Firebase UID later
    firebaseUid: { type: String, trim: true },
  },
  { timestamps: true }
);

// Hash password if changed
adminSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  if (!this.passwordHash) return next();

  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Method to set a plain password
adminSchema.methods.setPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(plainPassword, salt);
};

// Compare password
adminSchema.methods.comparePassword = async function (plainPassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(plainPassword, this.passwordHash);
};

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;