"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, CheckCircle, Filter } from "lucide-react";
import Link from "next/link";

export default function BoutiqueSearchPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "All",
    priceRange: "All",
    verified: "All",
    location: "All",
  });
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const locations = [
    "All",
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Pune",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Jaipur",
  ];

  const fetchBoutiques = async (overridePage = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      type: filters.type,
      priceRange: filters.priceRange,
      verified: filters.verified,
      location: filters.location,
      page: overridePage,
      limit: 20,
    });

    const res = await fetch(`/api/boutiques/search?${params.toString()}`, {
      cache: "no-store",
    });
    const data = await res.json();
    setBoutiques(data.results);
    setTotalPages(data.totalPages);
    setPage(overridePage);
    setLoading(false);
  };

  useEffect(() => {
    fetchBoutiques(1);
  }, []);

  const handleFilterChange = (e) =>
    setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBoutiques(1);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#fdfdfd] via-[#f9fafc] to-[#ffffff] md:pt-32 pt-40 px-4 md:px-10 pb-20 font-[Inter] text-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        {/* === FILTER PANEL === */}
        <aside
          className={`md:w-1/4 w-full bg-white/70 backdrop-blur-2xl rounded-3xl border border-gray-100/50 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#003466] tracking-wide flex items-center gap-2">
              <Filter size={18} /> Refine Results
            </h2>
            <button
              onClick={() => setShowFilters(false)}
              className="md:hidden text-gray-500 cursor-pointer hover:text-gray-800 transition"
            >
              ✕
            </button>
          </div>

          <div className="space-y-8">
            {/* Boutique Type */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                Boutique Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-[#f9f9fb] border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ffc1cc] transition cursor-pointer hover:border-[#003466]/30"
              >
                {["All", "Men", "Women", "Unisex"].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                Price Range
              </label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-[#f9f9fb] border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ffc1cc] transition cursor-pointer hover:border-[#003466]/30"
              >
                {["All", "Low", "Medium", "High", "Luxury"].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Verification */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                Verification
              </label>
              <select
                name="verified"
                value={filters.verified}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-[#f9f9fb] border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ffc1cc] transition cursor-pointer hover:border-[#003466]/30"
              >
                <option value="All">All</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                Location
              </label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-[#f9f9fb] border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ffc1cc] transition cursor-pointer hover:border-[#003466]/30"
              >
                {locations.map((loc) => (
                  <option key={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => fetchBoutiques(1)}
              className="w-full mt-4 py-2.5 bg-[#003466] hover:bg-[#002b55] text-white font-semibold rounded-full transition-all shadow-md cursor-pointer hover:shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* === MAIN CONTENT === */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
            <form
              onSubmit={handleSearch}
              className="relative w-full sm:w-2/3"
            >
              <input
                type="text"
                placeholder="Search for boutiques, designers, or cities..."
                className="w-full px-6 py-3.5 rounded-full border border-gray-200 bg-white text-black shadow-sm focus:ring-2 focus:ring-[#ffc1cc]/50 transition-all placeholder-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 bg-[#ffc1cc] text-[#003466] p-2.5 rounded-full hover:scale-105 transition-transform shadow-sm cursor-pointer"
              >
                <Search size={18} />
              </button>
            </form>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 text-[#003466] bg-[#f2f6fc] px-5 py-2 rounded-full border border-[#003466]/20 shadow-sm hover:bg-[#e8eff8] transition cursor-pointer"
            >
              <Filter size={18} /> Filters
            </button>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center mt-32">
              <div className="w-10 h-10 border-4 border-[#003466]/30 border-t-[#003466] rounded-full animate-spin"></div>
            </div>
          ) : boutiques.length === 0 ? (
            <p className="text-center text-gray-400 text-lg mt-20">
              No boutiques found matching your search.
            </p>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {boutiques.map((b, i) => (
                  <Link
                    href={`/boutiques/${b.websiteUrl}`}
                    key={b._id}
                    style={{
                      animationDelay: `${i * 0.05}s`,
                    }}
                    className="group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.12)] transition-all duration-500 transform hover:-translate-y-2 animate-fadeIn cursor-pointer"
                  >
                    <div className="overflow-hidden relative">
                      <img
                        src={b.businessLogo || "/no-logo.png"}
                        alt={b.title}
                        className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {b.verified && (
                        <span className="absolute top-4 left-4 bg-white/90 text-[#003466] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                          <CheckCircle size={12} /> Verified
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-black mb-1 group-hover:text-[#001f47] transition">
                        {b.title}
                      </h3>
                      <p className="text-sm text-black line-clamp-2 mb-3">
                        {b.tagline}
                      </p>
                      <p className="flex items-center text-black text-sm mb-3">
                        <MapPin size={14} className="mr-2 text-[#003466]" />
                        {b.googleAddress || "Unknown Location"}
                      </p>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-black font-medium">
                          {b.priceRange}
                        </span>
                        <span className="text-[#ffc1cc] font-semibold">
                          {b.type}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-16 gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchBoutiques(i + 1)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      page === i + 1
                        ? "bg-[#003466] text-white shadow-md"
                        : "bg-white border text-black hover:bg-[#f1f5f9]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
      `}</style>
    </section>
  );
}