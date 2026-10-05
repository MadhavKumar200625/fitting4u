"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, CheckCircle, Filter, LocateFixed, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

const LOCATIONS = {
  All: [],
  Delhi: ["Connaught Place", "Saket", "Dwarka", "Rohini", "Laxmi Nagar"],
  Bangalore: ["Jayanagar", "Rajajinagar", "Hebbal", "Whitefield"],
};

const geocodePincode = async (pincode) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(`${pincode} India`)}`,
    {
      headers: {
        "User-Agent": "Fitting4U-Web",
      },
    }
  );

  const data = await response.json();

  if (!Array.isArray(data) || !data[0]) {
    throw new Error("Invalid pincode");
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
};

const fetchNearbyBoutiques = async ({ lat, lng, radius = 50000000 }) => {
  const response = await fetch(`/api/boutiques/nearby?lat=${lat}&long=${lng}&radius=${radius}`);
  const data = await response.json();

  if (!data.success || !Array.isArray(data.boutiques)) {
    throw new Error("No boutiques returned");
  }

  return data.boutiques;
};

const requestDeviceLocation = (geolocation, options) =>
  new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(resolve, reject, options);
  });

export default function BoutiqueSearchPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "All",
    priceRange: "All",
    verified: "All",
    location: "All",
    subLocation: "All",
  });
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [locationPromptOpen, setLocationPromptOpen] = useState(false);
  const [userPincode, setUserPincode] = useState("");
  const [locationError, setLocationError] = useState("");
  const [userLocationLabel, setUserLocationLabel] = useState("");

  const fetchBoutiques = async (overridePage = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      type: filters.type,
      priceRange: filters.priceRange,
      verified: filters.verified,
      location: filters.location,
      page: String(overridePage),
      subLocation: filters.subLocation,
      limit: "20",
    });

    try {
      const res = await fetch(`/api/boutiques/search?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setBoutiques(data.results || []);
      setTotalPages(Math.max(1, Number(data.totalPages) || 1));
      setPage(overridePage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem("boutiqueLocationPreference");

    if (!savedLocation) {
      setLocationPromptOpen(true);
      return;
    }

    try {
      const parsed = JSON.parse(savedLocation);
      if (parsed?.lat && parsed?.lng) {
        setUserLocationLabel(parsed.label || "Current location");
        setLocationPromptOpen(false);
        (async () => {
          try {
            const nearby = await fetchNearbyBoutiques(parsed);
            setBoutiques(nearby || []);
            setTotalPages(1);
            setPage(1);
          } catch {
            setBoutiques([]);
          }
        })();
      } else {
        setLocationPromptOpen(true);
      }
    } catch {
      setLocationPromptOpen(true);
    }
  }, []);

  const handleFilterChange = (e) =>
    setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBoutiques(1);
  };

  const saveLocationPreference = (value) => {
    localStorage.setItem("boutiqueLocationPreference", JSON.stringify(value));
    setUserLocationLabel(value.label || "Current location");
    setLocationPromptOpen(false);
    setLocationError("");
  };

  const handleUseCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Location access is not available on this device. Please enter a pincode instead.");
      return;
    }

    if (!window.isSecureContext) {
      setLocationError("Current location requires a secure connection (HTTPS). Please enter a pincode instead.");
      return;
    }

    const locate = async () => {
      let position;

      try {
        position = await requestDeviceLocation(navigator.geolocation, {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 300000,
        });
      } catch (error) {
        if (error.code !== 2) {
          if (error.code === 1) {
            setLocationError("Location permission is blocked by your browser or device. Allow location access for this site, then try again, or enter a pincode.");
          } else if (error.code === 3) {
            setLocationError("Getting your location took too long. Please try again or enter a pincode.");
          } else {
            setLocationError("We could not get your location. Please try again or enter a pincode.");
          }
          return;
        }

        try {
          position = await requestDeviceLocation(navigator.geolocation, {
            enableHighAccuracy: true,
            timeout: 45000,
            maximumAge: 0,
          });
        } catch (retryError) {
          if (retryError.code === 1) {
            setLocationError("Location permission is blocked by your browser or device. Allow location access for this site, then try again, or enter a pincode.");
          } else if (retryError.code === 3) {
            setLocationError("Getting your location took too long. Please try again or enter a pincode.");
          } else {
            setLocationError("Your device still could not determine your location. Check that location services are enabled, or enter a pincode to search.");
          }
          return;
        }
      }

      const { latitude, longitude } = position.coords;

      try {
        const nearby = await fetchNearbyBoutiques({ lat: latitude, lng: longitude });
        saveLocationPreference({ lat: latitude, lng: longitude, label: "Current location" });
        setBoutiques(nearby || []);
        setTotalPages(1);
        setPage(1);
      } catch {
        toast.error("Unable to load boutiques near your location.");
        setBoutiques([]);
      }
    };

    locate();
  };

  const handlePincodeSubmit = async (e) => {
    e.preventDefault();
    const trimmed = userPincode.trim();

    if (!/^\d{6}$/.test(trimmed)) {
      setLocationError("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      const { lat, lng } = await geocodePincode(trimmed);
      const nearby = await fetchNearbyBoutiques({ lat, lng });
      saveLocationPreference({ lat, lng, label: trimmed });
      setBoutiques(nearby || []);
      setTotalPages(1);
      setPage(1);
    } catch {
      setLocationError("We could not find boutiques for this pincode. Please try another one.");
      setBoutiques([]);
    }
  };

  const pageTokens = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);

    const middleStart = page <= 3 ? 2 : page >= totalPages - 2 ? totalPages - 2 : page - 1;
    const middleEnd = page <= 3 ? 3 : page >= totalPages - 2 ? totalPages - 1 : page + 1;
    const pages = [1];

    if (middleStart > 2) pages.push("start-ellipsis");
    for (let pageNumber = middleStart; pageNumber <= middleEnd; pageNumber += 1) {
      pages.push(pageNumber);
    }
    if (middleEnd < totalPages - 1) pages.push("end-ellipsis");
    pages.push(totalPages);

    return pages;
  })();

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#fdfdfd] via-[#f9fafc] to-[#ffffff] md:pt-32 pt-40 px-4 md:px-10 pb-20 font-[Inter] text-black">
      {locationPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001a33]/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffc1cc] text-[#003466]">
                <LocateFixed size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#003466]/70">Find boutiques nearby</p>
                <h2 className="text-2xl font-bold text-[#003466]">Let’s explore near you</h2>
              </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              We need your location or pincode to show boutiques around you first. You can always search later using filters too.
            </p>

            {locationError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {locationError}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleUseCurrentLocation}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#003466] px-5 py-3.5 font-semibold text-white transition hover:bg-[#002b55]"
              >
                <MapPin size={18} /> Use my current location
              </button>

              <form onSubmit={handlePincodeSubmit} className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userPincode}
                    onChange={(e) => setUserPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter pincode"
                    className="w-full rounded-full border border-gray-200 bg-[#f9fafb] px-4 py-3 text-sm text-black outline-none focus:border-[#003466]"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-[#ffc1cc] px-5 py-3 font-semibold text-[#003466] transition hover:bg-[#ffb8c9]"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
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
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Boutique Type</label>
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

            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Price Range</label>
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

            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Verification</label>
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

            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Location</label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-[#f9f9fb] border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ffc1cc] transition cursor-pointer hover:border-[#003466]/30"
              >
                {Object.keys(LOCATIONS).map((loc) => (
                  <option key={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Sub Location</label>
              <select
                name="subLocation"
                value={filters.subLocation}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-[#f9f9fb] border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ffc1cc] cursor-pointer hover:border-[#003466]/30"
              >
                <option value="All">All</option>
                {LOCATIONS[filters.location]?.map((sub) => (
                  <option key={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => fetchBoutiques(1)}
              className="mt-4 w-full rounded-full bg-[#003466] py-2.5 font-semibold text-white transition-all hover:bg-[#002b55]"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <form onSubmit={handleSearch} className="relative w-full sm:w-2/3">
              <input
                type="text"
                placeholder="Search for boutiques, designers, or cities..."
                className="w-full rounded-full border border-gray-200 bg-white px-6 py-3.5 text-black shadow-sm transition-all placeholder-gray-400 focus:ring-2 focus:ring-[#ffc1cc]/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 rounded-full bg-[#ffc1cc] p-2.5 text-[#003466] shadow-sm transition hover:scale-105"
              >
                <Search size={18} />
              </button>
            </form>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-full border border-[#003466]/20 bg-[#f2f6fc] px-5 py-2 text-[#003466] shadow-sm transition hover:bg-[#e8eff8] sm:hidden"
            >
              <Filter size={18} /> Filters
            </button>
          </div>

          {userLocationLabel && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dbe7ff] bg-[#eef5ff] px-3 py-2 text-sm text-[#003466]">
              <MapPin size={16} /> Using: {userLocationLabel}
            </div>
          )}

          {loading ? (
            <div className="mt-32 flex justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#003466]/30 border-t-[#003466]" />
            </div>
          ) : boutiques.length === 0 ? (
            <div className="mt-20 rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
              <p className="text-lg font-medium text-gray-700">No boutiques found matching your search.</p>
              <p className="mt-2 text-sm">Try a different pincode, location, or keyword.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {boutiques.map((b, i) => (
                  <Link
                    href={`/boutiques/${b.websiteUrl || b.slug}`}
                    key={b._id || `${b.title}-${i}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                    className="group animate-fadeIn overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_35px_rgba(0,0,0,0.12)]"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={b.businessLogo || "/no-logo.png"}
                        alt={b.title}
                        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {b.verified && (
                        <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#003466] shadow-sm">
                          <CheckCircle size={12} /> Verified
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="mb-1 text-xl font-semibold text-black transition group-hover:text-[#001f47]">
                        {b.title}
                      </h3>
                      <p className="mb-3 line-clamp-2 text-sm text-black">{b.tagline}</p>
                      <p className="mb-3 flex items-center text-sm text-black">
                        <MapPin size={14} className="mr-2 text-[#003466]" />
                        {b.googleAddress || "Unknown Location"}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-black">{b.priceRange}</span>
                        <span className="font-semibold text-[#ffc1cc]">{b.type}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
              <nav aria-label="Boutique pages" className="mt-16 flex items-center justify-center gap-2">
                <button
                  type="button"
                  aria-label="Previous page"
                  title="Previous page"
                  onClick={() => fetchBoutiques(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>

                {pageTokens.map((token) =>
                  typeof token === "number" ? (
                    <button
                      key={token}
                      type="button"
                      aria-current={page === token ? "page" : undefined}
                      onClick={() => fetchBoutiques(token)}
                      className={`h-10 min-w-10 rounded-full px-3 text-sm font-medium transition ${
                        page === token
                          ? "bg-[#003466] text-white shadow-md"
                          : "border border-gray-200 bg-white text-gray-700 hover:bg-[#f1f5f9]"
                      }`}
                    >
                      {token}
                    </button>
                  ) : (
                    <span key={token} aria-hidden="true" className="px-1 text-gray-500">
                      …
                    </span>
                  )
                )}

                <button
                  type="button"
                  aria-label="Next page"
                  title="Next page"
                  onClick={() => fetchBoutiques(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
              )}
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