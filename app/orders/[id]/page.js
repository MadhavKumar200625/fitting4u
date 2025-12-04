"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

import {
  Truck,
  Store,
  CheckCircle,
  MapPin
} from "lucide-react";

export default function OrderViewPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD ORDER ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Login required");
      window.location.href = "/";
      return;
    }

    fetch(`/api/order/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
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
  }, [id]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-16 h-16 border-4 border-[#003466]/30 border-t-[#003466] rounded-full"
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        Order not found
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen px-4 sm:px-10 lg:px-20 py-24 bg-gradient-to-br from-[#f6f9ff] to-white">

      <div className="max-w-[1400px] mx-auto space-y-10">

        {/* ---------- HEADER ---------- */}
        <div className="text-center space-y-3">
          <CheckCircle size={80} className="mx-auto text-green-500" />

          <h1 className="text-4xl font-extrabold text-black">
            Order Details
          </h1>

          <p className="text-gray-700">
            Order ID:{" "}
            <span className="font-semibold text-[#003466] break-all">
              {order._id}
            </span>
          </p>
        </div>

        {/* ---------- MAIN GRID ---------- */}
        <div className="grid lg:grid-cols-2 gap-12">

          {/* ================= LEFT: ITEMS ================= */}
          <div className="bg-white border rounded-3xl shadow p-6 sm:p-8 space-y-4">

            <h2 className="text-2xl font-bold text-black">
              Order Items
            </h2>

            {order.items.map((item, i) => (
              <Link
                key={i}
                href={`/fabrics/${item.fabricId?.slug}`}
                className="
                  flex items-center justify-between gap-4
                  p-4 border rounded-xl bg-white
                  hover:border-[#003466] hover:shadow
                  transition
                "
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">

                  {/* IMAGE */}
                  <div className="
                    w-14 h-14 rounded-full overflow-hidden border bg-gray-50
                  ">
                    {item.fabricId?.images?.[0] ? (
                      <img
                        src={item.fabricId.images[0]}
                        alt={item.fabricId.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* NAME */}
                  <div>
                    <p className="font-semibold text-black">
                      {item.fabricId?.name || item.name}
                    </p>

                    <p className="text-sm text-gray-600">
                      Qty: {item.qty} meter(s)
                    </p>
                  </div>
                </div>

                {/* PRICE */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    ₹{item.price} / m
                  </p>

                  <p className="font-bold text-[#003466]">
                    ₹{item.subtotal}
                  </p>
                </div>
              </Link>
            ))}

            {/* TOTAL */}
            <div className="flex justify-between text-xl font-bold border-t pt-4 text-black">
              <span>Total</span>
              <span className="text-[#003466]">
                ₹{order.total}
              </span>
            </div>
          </div>

          {/* ================= RIGHT: DELIVERY ================= */}
          <div className="bg-white border rounded-3xl shadow p-6 sm:p-8 space-y-5">

            <h2 className="text-2xl font-bold text-black">
              Delivery Information
            </h2>

            {order.deliveryType === "HOME" ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-black">
                  <Truck size={20} />
                  <p className="font-semibold">
                    Home Delivery
                  </p>
                </div>

                <p className="text-gray-700">
                  {order.deliveryAddress?.name}
                </p>

                <p className="text-gray-700">
                  {order.deliveryAddress?.street},{" "}
                  {order.deliveryAddress?.city},{" "}
                  {order.deliveryAddress?.state} —{" "}
                  {order.deliveryAddress?.postalCode}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-black">
                  <Store size={20} />
                  <p className="font-semibold">
                    Boutique Delivery
                  </p>
                </div>

                <p className="text-lg font-medium text-black">
                  {order.pickupBoutiqueId?.title}
                </p>

                <p className="text-gray-600">
                  {order.pickupBoutiqueId?.googleAddress}
                </p>

                {/* MAP */}
                {order.pickupBoutiqueId?.lat &&
                  order.pickupBoutiqueId?.long && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${order.pickupBoutiqueId.lat},${order.pickupBoutiqueId.long}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        mt-2 inline-flex items-center gap-2
                        px-6 py-3 rounded-full
                        bg-gradient-to-r from-[#003466] to-[#002850]
                        text-white
                        hover:shadow-xl
                        transition
                      "
                    >
                      <MapPin size={16} />
                      Get Directions
                    </a>
                  )}
              </div>
            )}

            {/* STATUS */}
            <div className="border-t pt-4 space-y-1">
              <p className="font-semibold text-black">
                Order Status:
                <span className="ml-2 text-[#003466]">
                  {order.status.replace("_", " ")}
                </span>
              </p>

              <p className="font-semibold text-black">
                Payment:
                <span className="ml-2 text-[#003466]">
                  {order.payment?.status || "PENDING"}
                </span>
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}