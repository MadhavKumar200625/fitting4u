"use client";

import { useState } from "react";
import { ShoppingCart, Heart, User, Menu, X, Search } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // replace later with auth logic

  return (
    <header className="w-full fixed top-0 z-50 backdrop-blur-md bg-[rgba(0,52,102,0.6)] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-semibold tracking-tight">
          <span className="text-[var(--color-accent)]">Fitting</span>
          <span className="text-white">4U</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-base md:text-lg font-medium">
          {["Boutiques", "Fabric Store", "Home Measurement"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative group text-white"
            >
              <span className="transition-colors duration-300 text-white group-hover:text-[var(--color-accent)]">
                {item}
              </span>
              <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-[var(--color-accent)] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 text-gray-300" size={18} />
          <input
            type="text"
            placeholder="Search products or fabrics..."
            className="pl-10 pr-4 py-2 rounded-full text-white text-sm md:text-base bg-white/20 placeholder-gray-300 focus:bg-white/30 outline-none transition-all duration-300 w-36 md:w-48 lg:w-64 focus:w-64"
          />
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <button className="btn-accent text-sm md:text-base px-4 py-2 rounded-full hover:shadow-md transition-all duration-300">
              Login
            </button>
          ) : (
            <>
              <Heart className="cursor-pointer text-white hover:text-[var(--color-accent)] transition-colors duration-300" />
              <ShoppingCart className="cursor-pointer text-white hover:text-[var(--color-accent)] transition-colors duration-300" />
              <User className="cursor-pointer text-white hover:text-[var(--color-accent)] transition-colors duration-300" />
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(0,52,102,0.95)] backdrop-blur-md text-center py-4 space-y-3 transition-all fade-in-up">
          {["Boutiques", "Fabric Store", "Home Measurement"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="block text-lg text-white hover:text-[var(--color-accent)] transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="px-6">
            <input
              type="text"
              placeholder="Search..."
              className="w-full mt-3 py-2 px-4 rounded-full bg-white/20 text-white placeholder-gray-300 focus:bg-white/30 outline-none transition-all"
            />
          </div>
        </div>
      )}
    </header>
  );
}