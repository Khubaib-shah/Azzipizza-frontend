import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@shared/components/ui/button";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const uniqueKey = `${item._id}-${JSON.stringify(
    item.selectedIngredients.map((ing) => ing.name).sort()
  )}-${item.customizations || ""}`;
  const itemTotal = item.price * item.quantity;

  return (
    <div className="card-premium p-6 flex flex-col sm:flex-row gap-6 relative group bg-white">
      <div className="w-full sm:w-36 h-36 flex-shrink-0 overflow-hidden rounded-[var(--radius-md)] shadow-sm relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 lg:group-hover:scale-110"
        />
        {item.discount > 0 && (
          <div className="absolute top-2 left-2 bg-[var(--color-basil)] text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            {item.discount}% OFF
          </div>
        )}
      </div>
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[var(--color-text)] leading-tight">
              {item.name}
            </h3>
            <div className="text-right flex flex-col items-end">
              <p className="font-['Playfair_Display'] font-bold text-xl text-[var(--color-primary)]">
                €{itemTotal.toFixed(2)}
              </p>
              {item.originalPrice && item.originalPrice > item.price && (
                <p className="text-sm text-[var(--color-text-lighter)] line-through">
                  €{(item.originalPrice * item.quantity).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div className="text-sm text-[var(--color-text-light)] font-['Poppins'] mb-3 flex items-center gap-2">
            <span className="bg-[var(--color-background)] px-2 py-0.5 rounded text-xs border border-[var(--color-cream)]">
              €{item.price.toFixed(2)} each
            </span>
          </div>

          {item.selectedIngredients?.length > 0 && (
            <div className="mt-3 p-3 bg-[var(--color-background)] rounded-[var(--radius-sm)] border border-[var(--color-cream)]">
              <p className="text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Plus size={10} /> Extras
              </p>
              <ul className="space-y-1">
                {item.selectedIngredients.map((ing, i) => (
                  <li
                    key={i}
                    className="flex justify-between text-sm text-[var(--color-text)]"
                  >
                    <span>{ing.name}</span>
                    <span className="font-medium text-[var(--color-accent-dark)]">
                      +€{(ing.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-4">
          <div className="flex items-center bg-[var(--color-background)] rounded-full border border-[var(--color-cream)] p-1 shadow-inner">
            <Button
              onClick={() => onQuantityChange(item, "decrease")}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[var(--color-text)] shadow-sm border-none p-0 cursor-pointer"
              disabled={item.quantity <= 1}
            >
              <Minus size={14} />
            </Button>
            <span className="w-10 text-center font-semibold text-[var(--color-text)]">
              {item.quantity}
            </span>
            <Button
              onClick={() => onQuantityChange(item, "increase")}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] transition-colors shadow-sm shadow-[var(--color-accent)]/30 border-none p-0 cursor-pointer"
            >
              <Plus size={14} />
            </Button>
          </div>
          <Button
            onClick={() => onRemove(item._id)}
            className="flex items-center gap-2 text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors px-3 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-primary)]/5 text-sm font-medium group/delete border-none shadow-none bg-transparent hover:bg-transparent cursor-pointer"
            aria-label="Remove item from cart"
          >
            <Trash2
              size={16}
              className="group-hover/delete:scale-110 transition-transform"
            />
            <span>Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
