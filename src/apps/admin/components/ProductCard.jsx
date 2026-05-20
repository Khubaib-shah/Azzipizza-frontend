import React from "react";
import { Edit3, Trash2 } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { getOptimizedImageUrl } from "@shared/utils/cloudinary";
import { motion } from "framer-motion";
import { Button } from "@shared/components/ui/button";

const ProductCard = ({ item, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div
        className="group relative bg-white rounded-2xl shadow-sm lg:hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform-gpu lg:hover:-translate-y-1 will-change-transform"
        style={{ contain: "layout" }}
      >
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
          {item.discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{item.discount}%
            </span>
          )}
          {item.showInChefsSpecials && (
            <span className="bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <FaStar size={8} /> Special
            </span>
          )}
        </div>

        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <img
            loading="lazy"
            decoding="async"
            src={getOptimizedImageUrl(item.image, 400)}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 lg:group-hover:scale-110"
          />

          {/* Quick Actions Overlay (Desktop only) */}
          <div className="absolute inset-0 bg-black/40 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex items-center justify-center gap-3">
            <Button
              className="bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-blue-600 hover:text-white flex items-center gap-1.5 cursor-pointer border-none"
              onClick={() => onEdit(item)}
            >
              <Edit3 className="size-3.5" /> Edit
            </Button>
            <Button
              className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-red-700 flex items-center gap-1.5 cursor-pointer border-none"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="size-3.5" /> Delete
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-1 lg:group-hover:text-blue-600 transition-colors capitalize">
              {item.name}
            </h3>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
              <FaStar className="text-amber-400" />
              <span>{item.rating || 4.5}</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 line-clamp-2 mb-3 leading-relaxed flex-grow">
            {item.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
            <div className="flex flex-col">
              {item.discount > 0 && (
                <span className="text-[10px] text-gray-400 line-through">
                  €{parseFloat(item.price).toFixed(2)}
                </span>
              )}
              <span className="font-bold text-base text-red-600">
                €
                {(
                  item.price -
                  (item.price * (item.discount || 0)) / 100
                ).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${item.available ? "bg-emerald-400" : "bg-red-400"}`}
                ></div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {item.available ? "Active" : "Hidden"}
                </span>
              </div>

              {/* Mobile Quick Action Buttons (Touch Screen Friendly) */}
              <div className="flex items-center gap-1 lg:hidden">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 rounded-lg border-slate-100 bg-slate-50 text-slate-500 hover:text-blue-600 cursor-pointer shadow-none shrink-0"
                  onClick={() => onEdit(item)}
                >
                  <Edit3 className="size-3.5" />
                </Button>
                <Button
                  size="icon"
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border-none cursor-pointer shadow-none shrink-0"
                  onClick={() => onDelete(item)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
