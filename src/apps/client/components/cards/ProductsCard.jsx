import { FaPlus, FaStar } from "react-icons/fa";
import { lazy, Suspense, useContext, useMemo, useState, memo } from "react";
import { motion } from "framer-motion";
import Context from "@shared/context/dataContext";
import { toast } from "react-toastify";
import { getOptimizedImageUrl } from "@shared/utils/cloudinary";
import { Button } from "@shared/components/ui/button";
const Modal = lazy(() => import("../Modal/Modal"));

const ProductCard = memo(({ product }) => {
  const { addToCart } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState([]);

  const discount = product.discount || 0;
  const basePrice = product.price;
  const discountedPrice = useMemo(
    () => basePrice - (basePrice * discount) / 100,
    [basePrice, discount],
  );

  const rating = useMemo(() => product.rating || 4.5, [product.rating]);
  const reviews = useMemo(
    () =>
      product.reviews ||
      (product._id ? (parseInt(product._id.slice(-2), 16) % 30) + 120 : 150),
    [product.reviews, product._id],
  );

  const toppingsTotal = useMemo(
    () => selectedToppings.reduce((sum, t) => sum + t.price, 0),
    [selectedToppings],
  );

  const finalPrice = useMemo(
    () => discountedPrice + toppingsTotal,
    [discountedPrice, toppingsTotal],
  );

  const handleToppingToggle = (e, topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.some((item) => item._id === topping._id);
      return exists
        ? prev.filter((item) => item._id !== topping._id)
        : [...prev, topping];
    });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cartItem = { ...product, price: finalPrice };
    addToCart(cartItem, selectedToppings);
    toast.success(`"${product.name.toUpperCase()}" added to cart!`);
  };

  // Determine if item is special (derived from product data, not random)
  const isNew = product.isNew || false;
  const isChefSpecial =
    product.isChefSpecial ||
    product.category?.toLowerCase().includes("special");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      {/* Compact Card */}
      <div
        className="group relative bg-white rounded-2xl shadow-sm lg:hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 flex flex-col h-full transform-gpu lg:hover:-translate-y-1 active:scale-95 will-change-transform"
        onClick={() => setIsModalOpen(true)}
        style={{ contain: "layout" }}
      >
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
          {isChefSpecial && (
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
            src={getOptimizedImageUrl(product.image, 400)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 lg:group-hover:scale-110"
          />

          {/* Quick View Overlay (Desktop only) */}
          <div className="absolute inset-0 bg-black/20 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex items-end justify-center pb-4">
            <Button
              className="bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-300 hover:bg-[var(--color-primary)] hover:text-white border-none"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              Quick View
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-1 lg:group-hover:text-[var(--color-primary)] transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
              <FaStar className="text-amber-400" />
              <span>{rating}</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 line-clamp-2 mb-3 leading-relaxed flex-grow">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
            <div className="flex flex-col">
              {discount > 0 && (
                <span className="text-[10px] text-gray-400 line-through">
                  €{basePrice.toFixed(2)}
                </span>
              )}
              <span className="font-bold text-base text-[var(--color-primary)]">
                €{discountedPrice.toFixed(2)}
              </span>
            </div>

            <Button
              className="bg-[var(--color-primary)] text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-sm p-0 border-none cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
              aria-label="Add to cart"
            >
              <FaPlus size={12} />
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] shadow-2xl"
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2 h-48 md:h-auto relative">
                <img
                  src={getOptimizedImageUrl(product.image, 800)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {isChefSpecial && (
                    <span className="bg-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                      Chef's Special
                    </span>
                  )}
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto">
                <div className="mb-4">
                  <h2 className="text-3xl font-bold font-['Playfair_Display'] text-gray-900 mb-2">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex text-amber-400">
                      <FaStar />
                    </div>
                    <span>
                      {rating} ({reviews} reviews)
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  {product.description}
                </p>

                {/* Toppings Section */}
                {product.ingredients?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">
                      Customize Extras
                    </h3>
                    <motion.div
                      className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar"
                      variants={container}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                    >
                      {product.ingredients.map((ing) => (
                        <motion.label
                          key={ing._id}
                          variants={item}
                          className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[var(--color-primary)] cursor-pointer transition-colors bg-gray-50/50"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                              checked={selectedToppings.some(
                                (t) => t._id === ing._id,
                              )}
                              onChange={(e) => handleToppingToggle(e, ing)}
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {ing.name}
                            </span>
                          </div>

                          <span className="text-xs font-bold text-[var(--color-primary)]">
                            +€{ing.price.toFixed(2)}
                          </span>
                        </motion.label>
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase font-bold">
                      Total Price
                    </span>
                    <span className="text-2xl font-bold text-[var(--color-primary)]">
                      €{finalPrice.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    onClick={(e) => {
                      handleAddToCart(e);
                      setIsModalOpen(false);
                    }}
                    className="flex-1 bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-200 lg:hover:-translate-y-1 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
                  >
                    <FaPlus size={16} /> Add to Order
                  </Button>
                </div>
              </div>
            </motion.div>
          </Modal>
        </Suspense>
      )}
    </>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
