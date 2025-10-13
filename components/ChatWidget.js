"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Hide on specific routes
  const hiddenPaths = ["/something", "/admin", "/checkout"];
  if (hiddenPaths.includes(pathname)) return null;

  return (
    <div className="fixed bottom-20 right-10 z-50">
      {/* Chat Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white border border-gray-100 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] w-80 md:w-96 p-6 mb-4 relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 text-lg tracking-tight">
                Let&apos;s Chat 💬
              </h4>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Hi there! 👋 We&apos;d love to hear from you.  
              Leave a quick message below and our team will reply soon.
            </p>

            <textarea
              rows="3"
              placeholder="Type your message..."
              className="w-full p-3 rounded-xl border border-gray-200 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none transition-all"
            ></textarea>

            <button className="mt-4 w-full py-3 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[#002a54] transition-all shadow-md">
              Send Message
            </button>

            {/* Accent gradient strip */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent)] to-[#ff9cb2]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center fixed bottom-10 right-10 justify-center gap-2 px-5 md:px-6 py-3 rounded-full bg-[var(--color-accent)] text-gray-900 font-medium shadow-[0_10px_30px_rgba(255,193,204,0.5)] hover:shadow-[0_12px_40px_rgba(255,193,204,0.7)] transition-all duration-300"
      >
        <MessageCircle size={22} />
        <span className="hidden sm:inline text-sm font-semibold">
          Let&apos;s Chat
        </span>
      </motion.button>
    </div>
  );
}