"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const [step, setStep] = useState("LOGIN");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [adminId, setAdminId] = useState(null);

  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [loading, setLoading] = useState(false);

  /* ------------------------------------------------------------------
     ✅ SAME OTP SEND FUNCTION AS YOUR WORKING POPUP
  ------------------------------------------------------------------ */
  const sendOTP = async (phone) => {
    try {
      setLoading(true);

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      }

      const fullNumber = `+91${phone}`;

      const result = await signInWithPhoneNumber(
        auth,
        fullNumber,
        window.recaptchaVerifier
      );

      setConfirmationResult(result);
      toast.success("OTP sent");
    } catch (err) {
      console.error("OTP send error:", err);
      toast.error("Couldn't send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------
     ✅ ADMIN LOGIN STEP
  ------------------------------------------------------------------ */
  async function handleLogin() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Invalid credentials");
        return;
      }

      // ✅ SUPER ADMIN = DIRECT LOGIN
      if (data.role === "SUPER_ADMIN") {
        localStorage.setItem("admin_auth", data.token);
        toast.success("Welcome Super Admin");
        router.push("/admin");
        return;
      }

      // ✅ SUB ADMIN = OTP FLOW
      setPhone(data.phone);
      setAdminId(data.adminId);
      setStep("OTP");

      setTimeout(async () => {
  await sendOTP(data.phone);
}, 100);
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------------
     ✅ OTP VERIFY — SAME LOGIC AS POPUP
  ------------------------------------------------------------------ */
  async function verifyOTP() {
    if (!confirmationResult) {
      toast.error("OTP not sent yet");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      // ✅ Firebase verification
      await confirmationResult.confirm(otp);

      // ✅ Backend JWT fetch
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId }),
      });

      const data = await res.json();

      if (!data.success || !data.token) {
        toast.error(data.error || "OTP verification failed");
        return;
      }

      sessionStorage.setItem("admin_auth", data.token);
      sessionStorage.setItem("otp_verified", "true");

      toast.success("Login successful");
      router.push("/admin");

    } catch (err) {
      console.error("OTP verify error:", err);
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------------
     ✅ UI
  ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001c37] via-[#003466] to-[#02284b]
                    flex justify-center items-center px-4">

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10">

        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-[#003466]/10 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck size={34} className="text-[#003466]" />
          </div>

          <h1 className="text-3xl font-bold text-[#003466]">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">
            Secure administrator access
          </p>
        </div>

        {step === "LOGIN" && (
          <div className="space-y-5">

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              className="pl-4 py-3 border w-full rounded-xl text-black"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="pl-4 py-3 border w-full rounded-xl text-black"
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#003466] to-[#002850]
                         text-white py-3 rounded-xl font-semibold"
            >
              {loading ? "Checking..." : "Login"}
            </button>
          </div>
        )}

        {step === "OTP" && (
          <div className="space-y-5 text-center">

            <p className="text-sm text-gray-600">
              OTP sent to <b>+91 {phone}</b>
            </p>

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter OTP"
              className="w-full py-3 border rounded-xl text-black
                        text-center tracking-[0.3em]"
            />

            <button
              onClick={() => setTimeout(() => sendOTP(data.phone), 100)}
              className="text-[#003466] text-sm hover:underline"
            >
              Resend OTP
            </button>

            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#003466] to-[#002850]
                         text-white py-3 rounded-xl font-semibold"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* REQUIRED div for recaptcha */}
            <div id="recaptcha-container"></div>

          </div>
        )}

      </div>
    </div>
  );
}