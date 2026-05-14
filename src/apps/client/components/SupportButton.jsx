"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  X,
  ChevronRight,
  Phone,
  Mail,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const SupportButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed bottom-5 left-3 md:bottom-8 md:left-8 z-[150] flex flex-col items-start gap-4"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20, y: 20 }}
            className="w-72 bg-white shadow-2xl border border-gray-200 overflow-hidden rounded-2xl"
          >
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-amber-50">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                  Azzipizza Support
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-500 hover:text-red-600 transition-colors" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <p className="text-xs text-gray-600 leading-relaxed font-medium italic">
                "Mamma Mia! Need help with order? We are here for you."
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href="tel:393713985810"
                  className="flex items-center justify-between group p-3 border border-gray-200 rounded-xl hover:border-red-600 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-red-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                      Call Pizzeria
                    </span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-red-600 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://wa.me/393713985810"
                  className="flex items-center justify-between group p-3 border border-gray-200 rounded-xl hover:border-red-600 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FaWhatsapp class="w-4 h-4 text-red-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                      Chat on Whatsapp
                    </span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-red-600 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors border-t border-gray-200 cursor-pointer"
            >
              Dismiss Support
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 cursor-pointer ${
          isOpen
            ? "bg-red-700 text-white rotate-90"
            : "bg-white text-gray-900 hover:bg-red-600 hover:text-white"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>
    </motion.div>
  );
};

export default SupportButton;
