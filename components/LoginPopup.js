"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import jwt from "jsonwebtoken";
import toast from "react-hot-toast";

export default function PhoneVerificationPopup({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ phone: "", otp: "" });

  /* ---------- VALIDATION ---------- */
  const validatePhone = (num) => {
    const cleaned = num.replace(/\D/g, "");
    if (!cleaned) return "Please enter your mobile number";
    if (cleaned.length < 10) return "Number must be 10 digits";
    if (cleaned.length > 10) return "Number cannot exceed 10 digits";
    return "";
  };

  const validateOTP = (code) => {
    if (!code) return "Please enter the OTP";
    if (code.length < 6) return "OTP must be 6 digits";
    if (code.length > 6) return "OTP cannot exceed 6 digits";
    return "";
  };

  /* ---------- SEND OTP ---------- */
  const sendOTP = async () => {
    const cleaned = phone.replace(/\D/g, "");
    const phoneError = validatePhone(cleaned);
    setErrors({ phone: phoneError, otp: "" });

    if (phoneError) return toast.error(phoneError);

    try {
      setLoading(true);

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      }

      const fullNumber = `+91${cleaned}`;
      const result = await signInWithPhoneNumber(auth, fullNumber, window.recaptchaVerifier);

      setConfirmationResult(result);
      setStep("otp");
      toast.success("OTP sent!");
    } catch (err) {
      console.error("OTP send error:", err);
      const msg =
        err.code === "auth/too-many-requests"
          ? "Too many attempts. Try again later."
          : "Couldn’t send OTP. Please retry.";
      toast.error(msg);
      setErrors((prev) => ({ ...prev, phone: msg }));
    } finally {
      setLoading(false);
    }
  };

  /* ---------- VERIFY OTP + CREATE USER ---------- */
  const verifyOTP = async () => {
    const otpError = validateOTP(otp);
    setErrors({ phone: "", otp: otpError });
    if (otpError) return toast.error(otpError);

    try {
      setLoading(true);
      const result = await confirmationResult.confirm(otp);

      if (result.user) {
        const userPhone = result.user.phoneNumber;

        const res = await fetch("/api/auth/generate-token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phone: userPhone }),
});
const data = await res.json();
localStorage.setItem("authToken", data.token);

        // ✅ Create or update user in DB
        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: userPhone,
            deviceInfo: "website",
          }),
        });

        toast.success("Verified successfully!");
        onSuccess && onSuccess();
        onClose();
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      toast.error("Invalid or expired OTP. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md p-8 text-center border border-[#003466]/10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#003466] transition"
              aria-label="Close popup"
            >
              <X size={22} />
            </button>

            {/* Heading */}
            <h2 className="text-2xl font-semibold text-[#003466] mb-1">
              {step === "phone" ? "Let’s get you started" : "Just one more step"}
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              {step === "phone"
                ? "We’ll send a quick OTP to your number."
                : `OTP sent to +91 ${phone}`}
            </p>

            {/* Input Fields */}
            {step === "phone" ? (
              <div>
                <div
                  className={`flex items-center border rounded-full overflow-hidden shadow-sm bg-white transition-all ${
                    errors.phone
                      ? "border-red-400"
                      : "border-neutral-300 focus-within:border-[#003466]"
                  }`}
                >
                  <span className="bg-neutral-100 px-4 py-3 text-[#003466] font-medium text-base border-r border-neutral-300 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-2">{errors.phone}</p>
                )}
              </div>
            ) : (
              <div>
                <div
                  className={`flex items-center border rounded-full overflow-hidden shadow-sm bg-white transition-all ${
                    errors.otp
                      ? "border-red-400"
                      : "border-neutral-300 focus-within:border-[#003466]"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="flex-1 px-6 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-center text-lg tracking-widest"
                  />
                </div>
                {errors.otp && <p className="text-red-500 text-xs mt-2">{errors.otp}</p>}
              </div>
            )}

            {/* Button */}
            <div className="mt-8">
              <button
                disabled={loading}
                onClick={step === "phone" ? sendOTP : verifyOTP}
                className={`w-full py-3.5 rounded-full bg-[#003466] text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading
                  ? "Please wait..."
                  : step === "phone"
                  ? "Continue"
                  : "Confirm"}
              </button>
            </div>

            <div id="recaptcha-container"></div>

            {step === "otp" && (
              <button
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setErrors({ phone: "", otp: "" });
                }}
                className="text-sm mt-4 text-[#003466] hover:text-[#002850] font-medium hover:underline transition-all"
              >
                Edit number
              </button>
            )}

            <div className="mt-8 w-3/4 mx-auto h-[2px] bg-gradient-to-r from-[#ffc1cc]/70 to-[#003466]/70 rounded-full"></div>

            <p className="text-xs text-gray-500 mt-4">
              We&apos;ll never share your number with anyone.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}