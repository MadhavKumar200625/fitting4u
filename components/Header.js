"use client";

import { useState } from "react";
import { ShoppingCart, Heart, User, Menu, X, Search } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const tabs = [
    { name: "Home", link: "/", active: true },
    { name: "About", link: "/about", active: true },
    { name: "Boutiques", link: "/boutiques", active: true },
    { name: "Fabric Store", link: "/fabric-store", active: true },
    { name: "Home Measurement", link: "/home-measurement", active: true },
  ];

  return (
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
            {/* Accent Glow Line */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[var(--color-accent)]/70 to-[var(--color-primary)]/70 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full"></div>
          </div>
        </div>

        {/* RIGHT: ICONS */}
        <div className="flex items-center space-x-6 text-[var(--color-primary)]">
          {isLoggedIn ? (
            <>
              <Heart
                size={24}
                className="cursor-pointer hover:text-[var(--color-accent)] transition-colors"
              />
              <ShoppingCart
                size={24}
                className="cursor-pointer hover:text-[var(--color-accent)] transition-colors"
              />
              <User
                size={24}
                className="cursor-pointer hover:text-[var(--color-accent)] transition-colors"
              />
            </>
          ) : (
            <button className="px-5 py-2 bg-[var(--color-primary)] text-white rounded-full font-medium hover:bg-[#002a54] transition-all">
              Login
            </button>
          )}

          {/* MENU ICON */}
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
  );
}