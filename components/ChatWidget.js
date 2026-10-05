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

  const whatsappMessage = "Hi Fitting4U, I would like to know more about partnering my boutique with you.";
  const whatsappUrl = `https://wa.me/918006640664?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed bottom-20 right-10 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Fitting4U on WhatsApp"
        className="fixed bottom-24 right-10 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(37,211,102,0.35)]"
      >
        <MessageCircle size={21} />
        <span className="hidden sm:inline text-sm">WhatsApp us</span>
      </a>
      {/* Chat Popup */}
     

      
    </div>
  );
}