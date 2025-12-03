"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  CheckCircle,
  Store,
  Truck,
  ArrowRight,
  MapPin,
} from "lucide-react";

export default function Page() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showBoutiqueSelector, setShowBoutiqueSelector] = useState(false);
  const [pincode, setPincode] = useState("");
  const [boutiques, setBoutiques] = useState([]);
  const [selectedBoutique, setSelectedBoutique] = useState(null);
  const [searching, setSearching] = useState(false);

  /* -----------------------------
        LOAD LATEST ORDER
  -----------------------------*/
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Please login again");
      setLoading(false);
      return;
    }

    fetch("/api/order/latest", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data?.success) {
          toast.error("Order not found");
          return;
        }
        setOrder(data.order);
      })
      .catch(() => toast.error("Failed to load order"))
      .finally(() => setLoading(false));
  }, []);

  /* -----------------------------
          PINCODE → GEO
  -----------------------------*/
  const geocodePincode = async (pin) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${pin},India`
    );
    const data = await res.json();
    if (!data?.length) throw new Error("Invalid pincode");

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  };

  /* -----------------------------
            FIND BOUTIQUES
  -----------------------------*/
  const findBoutiques = async () => {
    if (!pincode || pincode.length < 5) {
      toast.error("Enter valid pincode");
      return;
    }

    try {
      setSearching(true);
      const { lat, lng } = await geocodePincode(pincode);
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `/api/boutiques/nearby?lat=${lat}&long=${lng}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!data.success || !data.boutiques.length) {
        toast.error("No boutiques found");
        return;
      }

      setBoutiques(data.boutiques);
    } catch {
      toast.error("Error searching boutiques");
    } finally {
      setSearching(false);
    }
  };

  /* -----------------------------
            CHANGE TO PICKUP
  -----------------------------*/
  const convertToPickup = async () => {
    if (!selectedBoutique) {
      toast.error("Please select a boutique");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(`/api/order/convert-to-pickup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          boutiqueId: selectedBoutique._id,
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error();

      setOrder(data.order);
      setShowBoutiqueSelector(false);
      toast.success("Pickup location updated");
    } catch {
      toast.error("Pickup update failed");
    }
  };

  /* -----------------------------
           STATES
  -----------------------------*/
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-14 h-14 border-4 rounded-full border-[#003466]/30 border-t-[#003466]"
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 bg-white">
        Invalid order
      </div>
    );
  }

  /* -----------------------------
              UI
  -----------------------------*/
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f9fe] to-white px-8 lg:px-20 py-24 text-gray-900">

      {/* HERO */}
      <div className="text-center mb-20">
        <CheckCircle size={88} className="mx-auto text-green-500" />
        <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold text-[#003466]">
          Order Confirmed
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Your Fitting4U order is ready to be processed.
        </p>

        {order.payment?.status === "PENDING" && (
          <p className="mt-4 bg-orange-50 inline-block px-6 py-2 rounded-full text-orange-600 font-semibold">
            ⏳ Payment verification pending – usually within 30 minutes
          </p>
        )}
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-[1500px] mx-auto grid lg:grid-cols-2 gap-16">

        {/* ---------- LEFT SECTION: ORDER SUMMARY ---------- */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#003466]">
            Order Summary
          </h2>

          <div className="space-y-2 text-gray-800">
            <p><b className="text-[#003466]">Order ID:</b> {order._id}</p>
            <p><b className="text-[#003466]">Items:</b> {order.items.length}</p>
            <p><b className="text-[#003466]">Status:</b> {order.payment?.status}</p>
            <p><b className="text-[#003466]">Total:</b> ₹{order.total}</p>
          </div>

          {/* DELIVERY MODE */}
          <div className="p-6 rounded-2xl bg-[#003466]/5 flex gap-4 border border-[#003466]/10">
            {order.deliveryType === "HOME" ? (
              <>
                <Truck size={28} className="text-[#003466]" />
                <div>
                  <p className="font-semibold text-[#003466]">Home Delivery</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.deliveryAddress?.street},{" "}
                    {order.deliveryAddress?.city},{" "}
                    {order.deliveryAddress?.postalCode}
                  </p>
                </div>
              </>
            ) : (
              <>
                <Store size={28} className="text-[#003466]" />
                <div>
                  <p className="font-semibold text-[#003466]">Pickup from Boutique</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {order.pickupBoutiqueId?.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.pickupBoutiqueId?.googleAddress}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ---------- RIGHT SECTION: BOUTIQUE + CHANGE ---------- */}
        <div className="space-y-6">

          {order.deliveryType === "BOUTIQUE" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl border border-[#003466]/15 bg-white shadow-xl space-y-4"
            >
              <h3 className="text-xl font-bold text-[#003466]">
                Pickup Location
              </h3>

              <p className="text-lg font-semibold text-gray-800">
                {order.pickupBoutiqueId?.title}
              </p>

              <p className="text-sm text-gray-500">
                {order.pickupBoutiqueId?.googleAddress}
              </p>

              {order.pickupBoutiqueId?.lat && order.pickupBoutiqueId?.long && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${order.pickupBoutiqueId.lat},${order.pickupBoutiqueId.long}`}
                  className="
                    inline-flex items-center gap-2
                    px-6 py-3 mt-3
                    rounded-full
                    bg-gradient-to-r from-[#003466] to-[#002850]
                    text-white
                    shadow-lg
                    hover:shadow-2xl
                    transition
                  "
                >
                  <MapPin size={18} />
                  Get Directions
                </a>
              )}

            </motion.div>
          )}

          {order.deliveryType === "HOME" && (
            <>
              <h3 className="text-xl font-bold text-[#003466]">
                Switch to Boutique Pickup
              </h3>

              <button
                onClick={() => setShowBoutiqueSelector(!showBoutiqueSelector)}
                className="
                  w-full flex items-center justify-center gap-2
                  py-3 rounded-full border border-[#003466]
                  text-[#003466]
                  hover:bg-[#003466] hover:text-white
                  transition
                "
              >
                <Store size={18} />
                Find Boutique
              </button>

              {showBoutiqueSelector && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter pincode"
                      className="flex-1 p-3 border rounded-lg text-gray-800"
                    />
                    <button
                      onClick={findBoutiques}
                      disabled={searching}
                      className="px-6 py-3 rounded-lg bg-[#003466] text-white hover:bg-[#002850]"
                    >
                      {searching ? "..." : "Find"}
                    </button>
                  </div>

                  {boutiques.map((b) => (
                    <div
                      key={b._id}
                      onClick={() => setSelectedBoutique(b)}
                      className={`cursor-pointer p-4 rounded-xl border
                        ${
                          selectedBoutique?._id === b._id
                            ? "border-[#003466] bg-[#003466]/10"
                            : "border-gray-200 hover:border-[#003466]"
                        }
                      `}
                    >
                      <p className="font-semibold text-gray-800">{b.title}</p>
                      <p className="text-xs text-gray-500">
                        {b.googleAddress}
                      </p>
                    </div>
                  ))}

                  {selectedBoutique && (
                    <button
                      onClick={convertToPickup}
                      className="w-full py-3 rounded-full
                        bg-gradient-to-r from-[#003466] to-[#002850]
                        text-white font-semibold flex items-center justify-center gap-2"
                    >
                      Confirm Pickup
                      <ArrowRight size={18} />
                    </button>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <Link
          href="/"
          className="inline-flex px-16 py-4 rounded-full bg-[#ffc1cc]
            text-[#001a33] font-semibold text-lg hover:bg-[#ffb1c3]"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}