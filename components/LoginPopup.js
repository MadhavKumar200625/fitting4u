"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function PhoneVerificationPopup({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", otp: "" });

  /* ---------- VALIDATION ---------- */
  const validateEmail = (value) => {
    if (!value) return "Please enter your email address";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
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
    const normalizedEmail = email.trim().toLowerCase();
    const emailError = validateEmail(normalizedEmail);
    setErrors({ email: emailError, otp: "" });

    if (emailError) return toast.error(emailError);

    try {
      setLoading(true);

      // Phone OTP via Firebase has been replaced by the email OTP API.
      const response = await fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message);

      setStep("otp");
      toast.success("OTP sent!");
    } catch (err) {
      console.error("OTP send error:", err);
      const msg = err.message || "Couldn’t send OTP. Please retry.";
      toast.error(msg);
      setErrors((prev) => ({ ...prev, email: msg }));
    } finally {
      setLoading(false);
    }
  };

  /* ---------- VERIFY OTP + CREATE USER ---------- */
  const verifyOTP = async () => {
    const otpError = validateOTP(otp);
    setErrors({ email: "", otp: otpError });
    if (otpError) return toast.error(otpError);

    try {
      setLoading(true);
      const response = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("authToken", data.token);
        toast.success("Verified successfully!");
        onSuccess && onSuccess();
        onClose();
      } else {
        toast.error(data.message || "Verification failed. Please try again.");
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
              {step === "email" ? "Let’s get you started" : "Just one more step"}
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              {step === "email"
                ? "We’ll send a quick OTP to your email."
                : `OTP sent to ${email}`}
            </p>

            {/* Input Fields */}
            {step === "email" ? (
              <div>
                <div
                  className={`flex items-center border rounded-full overflow-hidden shadow-sm bg-white transition-all ${
                    errors.email
                      ? "border-red-400"
                      : "border-neutral-300 focus-within:border-[#003466]"
                  }`}
                >
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2">{errors.email}</p>
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
                onClick={step === "email" ? sendOTP : verifyOTP}
                className={`w-full py-3.5 rounded-full bg-[#003466] text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading
                  ? "Please wait..."
                  : step === "email"
                  ? "Continue"
                  : "Confirm"}
              </button>
            </div>

            {step === "otp" && (
              <button
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setErrors({ email: "", otp: "" });
                }}
                className="text-sm mt-4 text-[#003466] hover:text-[#002850] font-medium hover:underline transition-all"
              >
                Edit email
              </button>
            )}

            <div className="mt-8 w-3/4 mx-auto h-[2px] bg-gradient-to-r from-[#ffc1cc]/70 to-[#003466]/70 rounded-full"></div>

            <p className="text-xs text-gray-500 mt-4">
              We&apos;ll never share your email with anyone.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
