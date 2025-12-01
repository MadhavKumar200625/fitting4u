"use client";

import { useEffect, useState } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import jwt from "jsonwebtoken";
import LoginPopup from "@/components/LoginPopup";
import { X, Truck, ShieldCheck, Sparkles, Trash2 } from "lucide-react";


export default function Page() {
  const [cart, setCart] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { config, loadingConfig } = useSiteConfig();
  
  // Load cart + fabrics
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length === 0) {
      setLoading(false);
      return;
    }
    setCart(storedCart);

    const ids = storedCart.map((i) => i.id);
    fetch("/api/fabrics/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setFabrics(data.fabrics);
        else toast.error("Failed to load fabrics");
      })
      .finally(() => setLoading(false));
  }, []);

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      const decoded = jwt.decode(token);
      if (decoded?.phone) {
        fetch(`/api/user?phone=${decoded.phone}`)
          .then((r) => r.json())
          .then((data) => setUser(data.user || { phone: decoded.phone }))
          .catch(() => setUser({ phone: decoded.phone }));
      }
    } catch {
      console.error("JWT invalid");
    }
  }, []);

  console.log(config)

  if (!config?.sections?.fabricStore)
    return <p className="text-center mt-32 text-gray-500">Not accepting orders currently</p>;

  // Handle quantity change
  const updateQuantity = (id, delta) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        let newQty = Math.max(0.25, (item.qty + delta).toFixed(2));
        return { ...item, qty: parseFloat(newQty) };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };
  // Remove an item completely from cart
const removeFromCart = (id) => {
  const updated = cart.filter((item) => item.id !== id);
  setCart(updated);
  localStorage.setItem("cart", JSON.stringify(updated));
  window.dispatchEvent(new Event("cartUpdated"));
  toast.success("Item removed from cart");
};

  // Totals
  const itemsWithSubtotal = fabrics.map((f) => {
    const cartItem = cart.find((c) => c.id === f._id);
    const qty = cartItem?.qty || 0;
    const subtotal = f.customerPrice * qty;
    return { ...f, qty, subtotal };
  });
  const subtotal = itemsWithSubtotal.reduce((a, f) => a + f.subtotal, 0);

  // Pay handler
  const handlePay = async () => {
    if (!user) return setShowLogin(true);
    setShowShipping(true);
  };

  const beginPayment = async (address) => {
  try {
    setSubmitting(true);

    // Save shipping locally
    const shippingAddress = address;

    // Create payment order
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: subtotal
      }),
    });

    const data = await res.json();

    if (!data.success) {
      toast.error("Unable to start payment");
      return;
    }

    const order = data.order;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Fitting4U",
      description: "Fabric Order Checkout",
      order_id: order.id,
      theme: { color: "#003466" },

      handler: async function (response) {
        // verify
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const verify = await verifyRes.json();

        if (!verify.success) {
          toast.error("Payment verification failed");
          return;
        }

        
        await confirmOrderWithPayment(shippingAddress, response);
      },

      prefill: {
        name: user?.name || "",
        contact: user?.phone || "",
      },

      modal: {
        ondismiss: () => setSubmitting(false),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    toast.error("Payment initiation failed");
  } finally {
    setSubmitting(false);
  }
};

const confirmOrderWithPayment = async (address, payment) => {
  try {
    setSubmitting(true);

    const orderItems = itemsWithSubtotal.map((f) => ({
      fabricId: f._id,
      qty: f.qty,
      price: f.customerPrice,
      subtotal: f.subtotal,
    }));

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userPhone: user.phone,
        items: orderItems,
        total: subtotal,
        address,

        // ✅ store razorpay payment details
        razorpay: {
          orderId: payment.razorpay_order_id,
          paymentId: payment.razorpay_payment_id,
          signature: payment.razorpay_signature,
        },
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Order placed successfully!");
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      setShowShipping(false);
      window.location.href = "/order-success";
    } else toast.error("Failed to create order");

  } catch (err) {
    console.error(err);
    toast.error("Error creating order");
  } finally {
    setSubmitting(false);
  }
};

  const confirmOrder = async (address) => {
    try {
      setSubmitting(true);
      const orderItems = itemsWithSubtotal.map((f) => ({
        fabricId: f._id,
        qty: f.qty,
        price: f.customerPrice,
        subtotal: f.subtotal,
      }));
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPhone: user.phone,
          items: orderItems,
          total: subtotal,
          address,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Order created successfully!");
        localStorage.removeItem("cart");
        setShowShipping(false);
      } else toast.error("Failed to create order");
    } catch (err) {
      toast.error("Error creating order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading checkout...
      </div>
    );

  if (!cart.length)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Your cart is empty.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f8fc] to-white pt-40 sm:pt-32 pb-20 px-3 sm:px-6 md:px-10 lg:px-16 font-[Poppins]">
      
      {/* 🌟 PROMOTIONAL HEADER */}
      <div className="max-w-[1400px] mx-auto bg-white rounded-3xl shadow-md p-6 sm:p-10 mb-14 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
        <div className="lg:w-2/3">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#003466] leading-snug">
            Ready to Complete Your Perfect Look?
          </h1>
          <p className="text-gray-600 mt-3 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
            You’ve chosen premium fabrics — crafted with style and comfort.
            Add a few final touches to make it yours.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 lg:w-1/3">
          {[{ icon: Truck, label: "Free Delivery" },
            { icon: ShieldCheck, label: "Secure Payment" },
            { icon: Sparkles, label: "Premium Quality" }].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <item.icon className="text-[#003466]" size={32} />
              <p className="mt-2 text-sm text-gray-700 font-semibold">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🧾 MAIN CHECKOUT AREA */}
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 xl:gap-20">
        
        {/* LEFT - CART ITEMS */}
        <div className="flex-[2] bg-white rounded-3xl shadow-xl p-5 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#003466] mb-8">
            Your Fabrics
          </h2>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {itemsWithSubtotal.map((f) => (
              <motion.div
                key={f._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 sm:gap-6"
              >
                {/* IMAGE */}
                <div className="flex justify-center sm:block">
                  <img
                    src={f.images?.[0]}
                    alt={f.name}
                    className="w-32 h-32 sm:w-24 sm:h-24 object-cover rounded-xl"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
                  <div>
                    <p className="font-semibold text-gray-800 text-base sm:text-lg">{f.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      ₹{f.customerPrice}/m • {f.material}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 sm:gap-0">
                    {/* Quantity Controls */}
                    <div className="flex justify-center sm:justify-start items-center gap-3">
                      <button
                        onClick={() => updateQuantity(f._id, -0.25)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#003466] text-white hover:bg-[#002850] transition"
                      >
                        –
                      </button>
                      <span className="text-gray-700 font-semibold w-[60px] text-center">
                        {f.qty.toFixed(2)} m
                      </span>
                      <button
                        onClick={() => updateQuantity(f._id, 0.25)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#003466] text-white hover:bg-[#002850] transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="flex flex-col sm:items-end items-center gap-2">
  <p className="font-semibold text-[#003466] text-lg">
    ₹{f.subtotal.toFixed(2)}
  </p>
  <button
    onClick={() => removeFromCart(f._id)}
    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition"
  >
    <Trash2 size={16} />
    Remove
  </button>
</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="flex-[1] w-full bg-white rounded-3xl shadow-xl p-6 sm:p-10 h-fit sticky top-32 self-start">
          <h2 className="text-2xl font-bold text-[#003466] mb-6">
            Order Summary
          </h2>

          <div className="space-y-3 border-b pb-4">
            <div className="flex justify-between text-gray-700 text-lg">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-[#003466]">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
          </div>

          

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handlePay}
            disabled={submitting}
            className="w-full mt-8 py-4 bg-[#003466] text-white rounded-full text-lg font-semibold hover:bg-[#002850] shadow-md hover:shadow-lg transition-all"
          >
            {submitting ? "Processing..." : "Proceed to Pay"}
          </motion.button>

          <div className="mt-8 bg-gradient-to-r from-[#003466]/5 to-[#ffc1cc]/10 p-4 rounded-2xl text-sm text-center text-gray-600">
            <p className="font-semibold text-[#003466]">✨ Limited Offer:</p>
            <p>
              Get <span className="text-[#003466] font-semibold">10% OFF</span> on
              your next order after checkout!
            </p>
          </div>
        </div>
      </div>

      {/* LOGIN POPUP */}
      <LoginPopup
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => {
          setShowLogin(false);
          window.location.reload();
        }}
      />

      {/* SHIPPING POPUP */}
      {/* SHIPPING POPUP (Bottom Sheet Style) */}
<AnimatePresence>
  {showShipping && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      {/* Bottom Sheet Container */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:w-[480px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowShipping(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#003466]"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#003466] mb-6 text-center">
          Shipping Details
        </h2>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const address = {
              name: form.name.value,
              phone: user?.phone || "",
              street: form.street.value,
              landmark: form.landmark.value,
              city: form.city.value,
              district: form.district.value,
              state: form.state.value,
              postalCode: form.postalCode.value,
              country: form.country.value,
            };
            beginPayment(address);
          }}
          className="space-y-4 pb-8"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-[#003466] mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              defaultValue={user?.name || ""}
              className="w-full p-3 rounded-lg border border-[#003466]/20 bg-[#f9fbff] text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#003466] outline-none transition-all"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-[#003466] mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              readOnly
              value={user?.phone || ""}
              className="w-full p-3 rounded-lg border border-[#003466]/20 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-semibold text-[#003466] mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              placeholder="House No, Street, Locality"
              defaultValue={user?.address?.street || ""}
              className="w-full p-3 rounded-lg border border-[#003466]/20 bg-[#f9fbff] text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#003466] outline-none transition-all"
              required
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#003466] mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                placeholder="City"
                defaultValue={user?.address?.city || ""}
                className="w-full p-3 rounded-lg border border-[#003466]/20 bg-[#f9fbff] text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#003466] outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#003466] mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                placeholder="State"
                defaultValue={user?.address?.state || ""}
                className="w-full p-3 rounded-lg border border-[#003466]/20 bg-[#f9fbff] text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#003466] outline-none transition-all"
                required
              />
            </div>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
  <label className="block text-sm font-semibold text-[#003466] mb-1">
    Landmark
  </label>
  <input
    type="text"
    name="landmark"
    placeholder="Nearby landmark"
                className="w-full p-3 rounded-lg border border-[#003466]/20 bg-[#f9fbff] text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#003466] outline-none transition-all"
  />
</div>

{/* District */}
<div>
  <label className="block text-sm font-semibold text-[#003466] mb-1">
    District
  </label>
  <input
    type="text"
    name="district"
    placeholder="District"
                className="w-full p-3 rounded-lg border border-[#003466]/20 bg-[#f9fbff] text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#003466] outline-none transition-all"
  />
</div>
          </div>

          {/* Landmark */}


          {/* Postal + Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#003466] mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                placeholder="e.g. 110001"
                defaultValue={user?.address?.postalCode || ""}
                className="w-full p-3 rounded-lg border border-[#003466]/20 bg-[#f9fbff] text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#003466] outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#003466] mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                defaultValue={user?.address?.country || "India"}
                className="w-full p-3 rounded-lg border border-[#003466]/20 bg-[#f9fbff] text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#003466] outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#003466] to-[#002850] text-white font-semibold rounded-full shadow hover:shadow-lg transition-all text-lg"
          >
            {submitting ? "Placing Order..." : "Confirm & Create Order"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}