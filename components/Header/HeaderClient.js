"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Search,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import LoginPopup from "@/components/LoginPopup";

export default function HeaderClient({ config }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
  const token =
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  if (token) {
    setIsLoggedIn(true);
  } else {
    setIsLoggedIn(false);
  }
}, []);

  /* ----------------------------------------
      NAV TABS BASED ON CONFIG
  ---------------------------------------- */
  const tabs = [
    { name: "Home", link: "/", enabled: true },
    { name: "Boutiques", link: "/boutiques", enabled: config.sections.boutiques },
    { name: "Fabric Store", link: "/fabrics", enabled: config.sections.fabricStore },
    { name: "Home Measurement", link: "/home-measurement", enabled: config.sections.homeMeasurement },
    { name: "Design Now", link: "/design-now", enabled: config.sections.designNow },
  ].filter((t) => t.enabled);

  /* ----------------------------------------
      CART LISTENER
  ---------------------------------------- */
  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const total = cart.reduce((n, i) => n + i.qty, 0);
      setCartCount(total);
    };
    update();
    window.addEventListener("cartUpdated", update);
    return () => window.removeEventListener("cartUpdated", update);
  }, []);

  /* ----------------------------------------
      SHRINK HEADER ON SCROLL
  ---------------------------------------- */
  useEffect(() => {
    const handleScroll = () => setShrink(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ----------------------------------------
      LOGIN HELPER
  ---------------------------------------- */
  const requireLogin = (fn) => {
  if (!isLoggedIn) {
    setShowLogin(true);
  } else {
    fn();
  }
};

  return (
    <>
      <header
        className={`
          fixed top-0 w-full z-50
          backdrop-blur-2xl bg-white/70 border-b border-white/40
          shadow-[0_8px_20px_rgba(0,0,0,0.06)]
          transition-all duration-300
          ${shrink ? "py-2" : "py-4"}
        `}
      >
        <div
          className="
            flex items-center justify-between
            px-4 sm:px-8 lg:px-16
            gap-x-4
          "
        >
          {/* ---------- LOGO ---------- */}
          <Link
            href="/"
            className="text-3xl md:text-4xl font-extrabold tracking-tight whitespace-nowrap flex-shrink-0"
          >
            <span className="text-[#003466]">Fitting</span>
            <span className="text-[#ffc1cc]">4U</span>
          </Link>

          {/* ---------- NAV (DESKTOP) ---------- */}
          <nav className="hidden xl:flex items-center gap-10 ml-10 flex-shrink-0">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.link}
                className="
                  text-[16px] font-medium text-[#003466]
                  hover:text-[#ffc1cc] transition-all relative group
                "
              >
                {tab.name}
                <span
                  className="
                    absolute left-0 -bottom-1 h-[2px] w-0 
                    bg-[#ffc1cc] rounded-full 
                    transition-all duration-300 group-hover:w-full
                  "
                />
              </Link>
            ))}
          </nav>

          {/* ---------- SEARCH BAR (RESIZED FOR ALL DEVICES) ---------- */}
          <div
            className="
              hidden sm:flex justify-center
              flex-grow
              min-w-[150px]
              max-w-[900px]
              md:max-w-[650px]
              lg:max-w-[750px]
              xl:max-w-[850px]
              2xl:max-w-[900px]
            "
          >
            <div className="relative w-full group">
              <Search
                size={22}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search fabrics, boutiques, measurements…"
                className="
                  w-full pl-14 pr-6 py-3 rounded-full text-gray-800
                  bg-gradient-to-r from-white/80 to-white/60
                  border border-gray-200
                  shadow-[0_2px_15px_rgba(0,0,0,0.05)]
                  focus:shadow-[0_0_25px_rgba(255,193,204,0.45)]
                  focus:ring-2 ring-[#ffc1cc]/70
                  outline-none transition-all duration-300
                "
              />
            </div>
          </div>

          {/* ---------- ICONS ---------- */}
          <div className="flex items-center gap-5 text-[#003466] flex-shrink-0">
            <Heart
              size={24}
              onClick={() => requireLogin(() => {})}
              className="cursor-pointer hover:text-[#ffc1cc] transition"
            />

            <Link href="/checkout" className="relative cursor-pointer">
              <ShoppingCart size={24} className="hover:text-[#ffc1cc] transition" />
              {cartCount > 0 && (
                <span className="
                  absolute -top-2 -right-2 bg-[#003466]
                  text-white text-[10px] px-1.5 py-0.5 rounded-full shadow
                ">
                  {cartCount}
                </span>
              )}
            </Link>

            <User
  size={24}
  onClick={() =>
    requireLogin(() => router.push("/my-account"))
  }
  className="cursor-pointer hover:text-[#ffc1cc] transition"
/>

            {/* MOBILE MENU BUTTON */}
            <button className="xl:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* ---------- MOBILE MENU ---------- */}
        <div
          className={`
            xl:hidden overflow-hidden transition-all duration-500
            ${menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-6 pb-6 pt-2 bg-white/90 backdrop-blur-xl">
            {tabs.map((t) => (
              <Link
                key={t.name}
                href={t.link}
                onClick={() => setMenuOpen(false)}
                className="
                  block py-3 text-lg text-[#003466] font-medium
                  hover:text-[#ffc1cc] transition
                  flex justify-between items-center
                "
              >
                {t.name}
                <ChevronRight size={18} />
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* LOGIN POPUP */}
      <LoginPopup
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => {
          setIsLoggedIn(true);
          setShowLogin(false);
        }}
      />
    </>
  );
}