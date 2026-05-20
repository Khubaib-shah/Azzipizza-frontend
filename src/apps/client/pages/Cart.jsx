import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import Context from "@shared/context/dataContext";
import OrderModal from "../components/Modal/OrderModel";
import CartItem from "../components/CartItem";
import OrderSummaryCard from "../components/OrderSummaryCard";

function Cart() {
  const { cartItems, addToCart, removeFromCart, CartDecrement } =
    useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleQuantityChange = (item, action) => {
    if (action === "increase") {
      addToCart(item, item.selectedIngredients, item.customizations);
    } else if (action === "decrease" && item.quantity > 1) {
      CartDecrement(item);
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-fade-in relative z-10">
      <div className="flex items-center gap-4 mb-10 border-b border-[var(--color-accent)] pb-4">
        <div className="bg-[var(--color-cream)] p-3 rounded-full">
          <ShoppingBag size={32} className="text-[var(--color-primary)]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold !text-[var(--color-text)] font-['Playfair_Display']">
          Your Cart
        </h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border-2 border-dashed border-[var(--color-accent)] animate-scale-in glass">
          <div className="mx-auto w-28 h-28 bg-[var(--color-cream)] rounded-full flex items-center justify-center mb-6 shadow-[var(--shadow-sm)] animate-float">
            <ShoppingBag size={48} className="text-[var(--color-accent)]" />
          </div>
          <p className="text-2xl text-[var(--color-text)] font-['Playfair_Display'] mb-2 font-semibold">
            Your cart is currently empty
          </p>
          <p className="text-[var(--color-text-light)] mb-8 font-['Poppins'] max-w-md mx-auto">
            Looks like you haven't made your choice yet. Browse our delicious menu and find something you love.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <CartItem
                key={`${item._id}-${JSON.stringify(
                  item.selectedIngredients.map((ing) => ing.name).sort()
                )}-${item.customizations || ""}`}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <OrderSummaryCard
              cartItems={cartItems}
              cartTotal={cartTotal}
              onCheckout={openModal}
            />
          </div>
        </div>
      )}

      <OrderModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        totalPrice={cartTotal}
        cartItems={cartItems}
      />
    </div>
  );
}

export default Cart;
