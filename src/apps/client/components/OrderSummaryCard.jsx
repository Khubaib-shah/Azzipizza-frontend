import React from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@shared/components/ui/button";

const OrderSummaryCard = ({ cartItems, cartTotal, onCheckout }) => {
  const totalItemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="glass p-6 md:p-8 rounded-[var(--radius-lg)] sticky top-24 shadow-[var(--shadow-lg)] border-t-4 border-t-[var(--color-accent)] bg-white/90 backdrop-blur-sm">
      <h3 className="text-2xl font-['Playfair_Display'] font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
        Order Summary
      </h3>

      <div className="space-y-4 mb-8 font-['Poppins']">
        <div className="flex justify-between text-[var(--color-text-light)]">
          <span>
            Subtotal <span className="text-xs">({totalItemCount} items)</span>
          </span>
          <span className="font-medium text-[var(--color-text)]">
            €{cartTotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-[var(--color-text-light)]">
          <span>Delivery</span>
          <span className="font-medium text-[var(--color-basil)] flex items-center gap-1">
            Free
          </span>
        </div>
        <div className="decorative-line my-6 opacity-30"></div>
        <div className="flex justify-between items-end">
          <span className="font-bold text-lg text-[var(--color-text)]">
            Total
          </span>
          <span className="font-['Playfair_Display'] font-bold text-3xl text-[var(--color-primary)] drop-shadow-sm">
            €{cartTotal.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-light)] italic">
          *Taxes included where applicable
        </p>
      </div>

      <Button
        onClick={onCheckout}
        className="btn-primary w-full flex items-center justify-center gap-3 group py-4 text-lg border-none cursor-pointer"
      >
        <span>Proceed to Checkout</span>
        <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
          <ShoppingBag
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
        </div>
      </Button>

      <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="h-6 w-10 bg-gray-200 rounded"></div>
        <div className="h-6 w-10 bg-gray-200 rounded"></div>
        <div className="h-6 w-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
