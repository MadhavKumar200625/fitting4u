"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Heart, User, Menu, X, Search } from "lucide-react";
import Link from "next/link";
import LoginPopup from "@/components/LoginPopup"; // ✅ Popup import

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const tabs = [
    { name: "Home", link: "/", active: true },
    { name: "About", link: "/about", active: true },
    { name: "Boutiques", link: "/boutiques", active: true },
    { name: "Fabric Store", link: "/fabric-store", active: true },
    { name: "Home Measurement", link: "/home-measurement", active: true },
  ];


useEffect(() => {
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  };

  updateCartCount(); // initial load

  // Listen for both 'storage' and custom 'cartUpdated' events
  window.addEventListener("storage", updateCartCount);
  window.addEventListener("cartUpdated", updateCartCount);

  return () => {
    window.removeEventListener("storage", updateCartCount);
    window.removeEventListener("cartUpdated", updateCartCount);
  };
}, []);

  // 👤 Handle protected actions (e.g. profile)
  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    // TODO: later route to /profile
  };

  // ❤️ Wishlist click
  const handleWishlistClick = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    // TODO: later route to /wishlist
  };

  return (
    <>
      <header className="w-full fixed top-0 z-50 bg-white/90 backdrop-blur-xl shadow-md border-b border-gray-100 transition-all duration-300">
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-10 lg:px-16 py-4 sm:py-5 gap-y-3">
          {/* LEFT: LOGO */}
          <Link
            href="/"
            className="text-3xl md:text-4xl font-bold tracking-tight flex-shrink-0"
          >
            <span className="text-[var(--color-primary)]">Fitting</span>
            <span className="text-[var(--color-accent)]">4U</span>
          </Link>

          {/* CENTER: SEARCH BAR */}
          <div className="order-3 w-full sm:order-none sm:w-auto sm:flex-grow flex justify-center sm:justify-center">
            <div className="relative w-full max-w-2xl sm:max-w-3xl md:max-w-4xl">
              <Search
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={24}
              />
              <input
                type="text"
                placeholder="Search for boutiques, fabrics, or measurements..."
                className="w-full pl-14 pr-6 py-4 rounded-full text-md text-gray-800 placeholder-gray-400 bg-gradient-to-r from-white/90 to-white/70 border border-gray-200 shadow-[0_0_20px_rgba(0,0,0,0.05)] focus:shadow-[0_0_30px_rgba(255,193,204,0.4)] focus:ring-3 ring-[var(--color-primary)] ring-2 focus:ring-[var(--color-accent)] outline-none transition-all duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[var(--color-accent)]/70 to-[var(--color-primary)]/70 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full"></div>
            </div>
          </div>

          {/* RIGHT: ICONS */}
          <div className="flex items-center space-x-6 text-[var(--color-primary)] relative">
            <>
              {/* ❤️ Wishlist */}
              <Heart
                size={24}
                onClick={handleWishlistClick}
                className="cursor-pointer hover:text-[var(--color-accent)] transition-colors"
              />

              {/* 🛒 Cart */}
              <Link href="/checkout" className="relative cursor-pointer">
                <ShoppingCart
                  size={24}
                  className="hover:text-[var(--color-accent)] transition-colors"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* 👤 Profile */}
              <User
                size={24}
                onClick={handleProfileClick}
                className="cursor-pointer hover:text-[var(--color-accent)] transition-colors"
              />
            </>

            {/* MENU ICON (Mobile) */}
            <button
              className="text-[var(--color-primary)] sm:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="bg-white border-t border-gray-200 py-5 px-6 space-y-4 text-center shadow-inner animate-fade-in-up">
            <div className="flex flex-col items-center space-y-3 text-[var(--color-primary)] text-lg font-medium">
              {tabs.map(
                (tab) =>
                  tab.active && (
                    <Link
                      key={tab.name}
                      href={tab.link}
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-[var(--color-accent)] transition-colors"
                    >
                      {tab.name}
                    </Link>
                  )
              )}
            </div>
          </div>
        )}
      </header>

      {/* ✅ Login Popup */}
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