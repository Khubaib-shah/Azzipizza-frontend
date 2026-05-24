import { useContext, useEffect, useState, useMemo, useRef, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaStar, FaFire, FaClock, FaShippingFast, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import Context from "@shared/context/dataContext";
import ProductCard from "../components/cards/ProductsCard";
import ProductCardSkeleton from "../components/cards/ProductCardSkeleton";
import HeroSection from "../components/heroSection/HeroSection";
import SectionHeader from "../components/SectionHeader";
import { ChevronRight } from "lucide-react";

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
const testimonials = [
  {
    text: "Pizza arrived hot, crust perfect, and honestly exceeded my expectations completely. great",
    img: "/testimonial/testimonial1.png",
  },
  {
    text: "Family order was perfect, everyone loved the taste and quality was really good. delightful",
    img: "/testimonial/testimonial2.png",
  },
  {
    text: "Delivery was quick, pizza stayed hot and fresh just like straight from oven. amazing taste",
    img: "/testimonial/testimonial3.png",
  },
  {
    text: "Didn’t expect much but it turned out fresh, tasty and really well prepared pizza. perfecto",
    img: "/testimonial/testimonial1.png",
  },
  {
    text: "Small get-together order that impressed everyone with taste and overall quality. fantastic",
    img: "/testimonial/testimonial2.png",
  },
  {
    text: "Super fast delivery and pizza stayed hot, you can tell quality is never compromised. great",
    img: "/testimonial/testimonial3.png",
  },
];
function Landing() {
  const { items, isLoading } = useContext(Context);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [weeklySpecials, setWeeklySpecials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("special-offers");
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const categoryRefs = useRef({});
  const filterBlockRef = useRef(null);
  const stickySentinelRef = useRef(null);
  const tabsContainerRef = useRef(null);
  const intersectingSectionsRef = useRef(new Map());
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: "trimSnaps",
    },
    [
      Autoplay({
        delay: 6000,
        stopOnInteraction: false,
      }),
    ]
  );

  const categoryNames = useMemo(
    () => (items ? [...new Set(items.map((item) => item.category))] : []),
    [items],
  );

  const specialSectionKeys = [
    "special-offers",
    "chef-specials",
    "weekly-specials",
  ];

  const landingTabLabels = {
    "special-offers": "Special Offers",
    "chef-specials": "Chef's Specials",
    "weekly-specials": "Weekly Specials",
  };

  const landingTabs = useMemo(
    () => [...specialSectionKeys, ...categoryNames],
    [categoryNames],
  );

  const isSpecialSectionTab = (category) =>
    specialSectionKeys.includes(category);

  const filteredLandingItems = useMemo(() => {
    if (!items) return [];
    let filtered = [...items];

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [items, searchQuery, activeCategory]);

  const landingListing = useMemo(() => {
    const result = {};

    filteredLandingItems.forEach((item) => {
      if (!result[item.category]) {
        result[item.category] = [];
      }
      result[item.category].push(item);
    });

    return result;
  }, [filteredLandingItems]);

  const visibleLandingCategories = useMemo(
    () => Object.keys(landingListing),
    [landingListing],
  );

  const handleLandingCategoryClick = (category) => {
    setActiveCategory(category);
    const offset = 96;

    const el = categoryRefs.current[category];
    if (el) {
      const topPos = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: topPos, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsFilterSticky(!entry.isIntersecting),
      { root: null, rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (searchQuery || visibleLandingCategories.length === 0) return;

    const activeSectionKeys = [
      ...specialSectionKeys,
      ...visibleLandingCategories,
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false;
        entries.forEach((entry) => {
          const category = entry.target.dataset.category;
          if (entry.isIntersecting) {
            intersectingSectionsRef.current.set(category, entry.intersectionRect.height);
            changed = true;
          } else {
            intersectingSectionsRef.current.delete(category);
            changed = true;
          }
        });

        if (changed) {
          let maxCategory = null;
          let maxHeight = -1;

          intersectingSectionsRef.current.forEach((height, category) => {
            if (height > maxHeight) {
              maxHeight = height;
              maxCategory = category;
            }
          });

          if (maxCategory) {
            setActiveCategory((prev) => (prev !== maxCategory ? maxCategory : prev));
          }
        }
      },
      {
        root: null,
        rootMargin: "-25% 0px -25% 0px",
        threshold: Array.from({ length: 21 }, (_, i) => i * 0.05),
      },
    );

    activeSectionKeys.forEach((category) => {
      const section = categoryRefs.current[category];
      if (section) observer.observe(section);
    });

    return () => {
      observer.disconnect();
      intersectingSectionsRef.current.clear();
    };
  }, [searchQuery, visibleLandingCategories, specialOffers, featuredItems, weeklySpecials]);

  useEffect(() => {
    if (activeCategory && tabsContainerRef.current) {
      const activeTabEl = document.getElementById(`tab-${activeCategory}`);
      const container = tabsContainerRef.current;
      if (activeTabEl && container) {
        const containerRect = container.getBoundingClientRect();
        const tabRect = activeTabEl.getBoundingClientRect();
        const scrollOffset = tabRect.left - containerRect.left;
        const targetScrollLeft = container.scrollLeft + scrollOffset - 12; // -12px for padding

        container.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth"
        });
      }
    }
  }, [activeCategory]);

  useEffect(() => {
    if (items && items.length > 0) {
      // Get items marked for special offers, sorted by newest updated first
      const offers = items
        .filter((item) => item.showInSpecialOffers)
        .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
        .slice(0, 6);
      setSpecialOffers(offers);

      // Get chef's special items, sorted by newest updated first
      const specials = items
        .filter((item) => item.showInChefsSpecials)
        .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
        .slice(0, 4);
      setFeaturedItems(specials);

      // Get weekly special items, sorted by newest updated first
      const weekly = items
        .filter((item) => item.showInWeeklySpecials)
        .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
        .slice(0, 3);
      setWeeklySpecials(weekly);
    }
  }, [items]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Search The Menu */}
      <div ref={stickySentinelRef} className="h-0 w-full" />
      <section className="sticky top-12 md:top-20 z-40  bg-transparent pointer-events-none">
        <div className="md:container mx-auto">
          <div>
            <div
              ref={filterBlockRef}
              className={`backdrop-blur-md pointer-events-auto w-full max-w-full transition-all duration-300 ${isFilterSticky
                ? "shadow-xl border-red-200"
                : ""
                }`}
            >
              <div className="px-2 py-1 sm:px-6 md:py-2">
                <div className="grid grid-cols-1 gap-px md:gap-2">
                  <div className="relative group">
                    <FaSearch
                      size={18}
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-red-500 group-focus-within:text-red-600 transition-colors z-10"
                    />
                    <input
                      type="text"
                      placeholder="Search menu items, pizzas, and categories"
                      className="pl-8 sm:pl-12 sm:pr-4 py-1.5 sm:py-3.5 w-full border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all bg-gray-50/50 hover:bg-white hover:border-red-200 text-gray-700 shadow-sm text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <style>{`
                      .no-scrollbar::-webkit-scrollbar { display: none; }
                      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    `}</style>
                    <div
                      ref={tabsContainerRef}
                      className="flex-1 overflow-x-auto no-scrollbar scroll-smooth"
                    >
                      <div className="flex gap-3 whitespace-nowrap p-1">
                        {landingTabs.map((tab) => (
                          <button
                            key={tab}
                            id={`tab-${tab}`}
                            onClick={() => handleLandingCategoryClick(tab)}
                            className={`relative px-3 sm:px-5 py-2 text-xs sm:text-sm rounded-full uppercase whitespace-nowrap transition-colors outline-none ${activeCategory === tab
                              ? "text-white border border-transparent"
                              : "bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600"
                              }`}
                            style={{ WebkitTapHighlightColor: "transparent" }}
                          >
                            {activeCategory === tab && (
                              <motion.div
                                layoutId="landing-active-pill"
                                className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            <span className="relative z-10">{landingTabLabels[tab] || tab}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="p-2.5 sm:p-3 bg-white border border-gray-200 rounded-full text-gray-600 shadow-sm shrink-0 hover:text-red-600 hover:border-red-300 transition-colors"
                      aria-label="View all categories"
                    >
                      <FaBars size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      {(isLoading || specialOffers.length > 0) && (
        <section
          ref={(el) => el && (categoryRefs.current["special-offers"] = el)}
          data-category="special-offers"
          className="!py-2 md:py-16 bg-gradient-to-r from-red-50 to-amber-50"
        >
          <div className="sm:container mx-auto !px-2 md:px-4">
            <SectionHeader
              title="Special Offers"
              subtitle="Don't miss out on our exclusive deals and limited-time offers!"
            />

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
              {isLoading
                ? [...Array(3)].map((_, index) => (
                  <div key={index} className="animate-scale-in">
                    <ProductCardSkeleton />
                  </div>
                ))
                : specialOffers.map((item, index) => (
                  <div
                    key={item._id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={item} />
                  </div>
                ))}
            </div>

            {!isLoading && (
              <div className="text-center">
                <Link
                  to="/menu"
                  className="btn-primary inline-block text-sm md:text-lg px-8 !py-2 md:py-4"
                >
                  View All Offers →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Chef's Special Section */}
      {(isLoading || featuredItems.length > 0) && (
        <section
          ref={(el) => el && (categoryRefs.current["chef-specials"] = el)}
          data-category="chef-specials"
          className="py-16"
        >
          <div className="sm:container mx-auto px-2 md:px-4">
            <SectionHeader
              title="Chef's Specials"
              subtitle="Handpicked by our master chefs"
            />

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-8">
              {isLoading
                ? [...Array(4)].map((_, index) => (
                  <div key={index} className="animate-slide-up">
                    <ProductCardSkeleton />
                  </div>
                ))
                : featuredItems.map((item, index) => (
                  <div
                    key={item._id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <ProductCard product={item} />
                  </div>
                ))}
            </div>

            {!isLoading && (
              <div className="text-center">
                <Link
                  to="/menu"
                  className="btn-accent !text-white inline-block text-sm md:text-lg md:px-8 !py-3 md:py-4"
                >
                  Explore Full Menu →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Weekly Specials Section */}
      {(isLoading || weeklySpecials.length > 0) && (
        <section
          ref={(el) => el && (categoryRefs.current["weekly-specials"] = el)}
          data-category="weekly-specials"
          className="py-16 bg-gradient-to-br from-cream to-amber-50/50"
        >
          <div className="sm:container mx-auto px-2 md:px-4">
            <SectionHeader
              title="Weekly Specials"
              subtitle="Taste something new this week with our unique, limited-time creations!"
            />

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
              {isLoading
                ? [...Array(3)].map((_, index) => (
                  <div key={index} className="animate-scale-in">
                    <ProductCardSkeleton />
                  </div>
                ))
                : weeklySpecials.map((item, index) => (
                  <div
                    key={item._id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={item} />
                  </div>
                ))}
            </div>

            {!isLoading && (
              <div className="text-center">
                <Link
                  to="/menu"
                  className="btn-accent !text-white inline-block text-sm md:text-lg md:px-8 !py-3 md:py-4"
                >
                  Order Weekly Specials →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Browse the Full Menu Section */}
      <section className="py-10 md:py-16 bg-white/90">
        <div className="sm:container mx-auto px-2 md:px-4">
          {filteredLandingItems.length > 0 ? (
            <div className="space-y-10">
              {visibleLandingCategories.map((category) => (
                <div
                  key={category}
                  ref={(el) => el && (categoryRefs.current[category] = el)}
                  data-category={category}
                  className="mt-10 mb-8"
                >
                  <SectionHeader
                    title={category}
                    subtitle={
                      {
                        "pizze rosse": "Classic tomato-based pizzas with rich, authentic flavors",
                        "pizze bianche": "Delicate white pizzas without tomato sauce",
                        "fritti": "Crispy golden fried bites, perfect for sharing",
                        "dolci": "Sweet Italian desserts to end your meal perfectly",
                        "bibite": "Refreshing drinks to complement your pizza",
                        "birre": "Craft and classic beers to pair with your meal",
                      }[category.toLowerCase()] || "Handcrafted with love and authentic Italian ingredients"
                    }
                  />
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {landingListing[category].map((item) => (
                      <ProductCard key={item._id} product={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No matching dishes found. Try another search or select a different category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="md:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="sm:container mx-auto px-2 md:px-4">
          <SectionHeader
            title="Why Choose Azzipizza?"
            subtitle="Experience the difference that passion and quality make"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-8">
            <div className="card-premium !p-4 md:p-8 text-start">
              <div className="bg-red-100 size-14 md:size-20 rounded-full flex items-center justify-center mb-1 md:mb-4">
                <FaFire className="text-red-600 size-7 md:size-10" />
              </div>
              <h3 className="!text-lg md:text-2xl font-bold text-gray-800 mb-px md:mb-3">
                Wood-Fired Oven
              </h3>
              <p className="text-sm text-gray-600">
                Traditional Italian wood-fired oven for authentic taste and
                perfect crust
              </p>
            </div>

            <div className="card-premium !p-4 md:p-8 text-start">
              <div className="bg-green-100 size-14 md:size-20 rounded-full flex items-center justify-center ms-auto mb-1 md:mb-4">
                <FaStar className="text-green-600 size-7 md:size-10" />
              </div>
              <h3 className="!text-lg md:text-2xl font-bold text-gray-800 mb-px md:mb-3">
                Premium Ingredients
              </h3>
              <p className="text-sm text-gray-600">
                Only the finest, freshest ingredients sourced daily for quality
                you can taste
              </p>
            </div>

            <div className="card-premium !p-4 md:p-8 text-start">
              <div className="bg-amber-100 size-14 md:size-20 rounded-full flex items-center justify-center mb-1 md:mb-4">
                <FaClock className="text-amber-600 size-7 md:size-10" />
              </div>
              <h3 className="!text-lg md:text-2xl font-bold text-gray-800 mb-px md:mb-3">
                48-Hour Dough
              </h3>
              <p className="text-sm text-gray-600">
                Long fermentation process for light, digestible, and flavorful
                pizza base
              </p>
            </div>

            <div className="card-premium !p-4 md:p-8 text-start">
              <div className="bg-blue-100 size-14 md:size-20 rounded-full flex items-center justify-center ms-auto mb-1 md:mb-4">
                <FaShippingFast className="text-blue-600 size-7 md:size-10" />
              </div>
              <h3 className="!text-lg md:text-2xl font-bold text-gray-800 mb-px md:mb-3">
                Fast Delivery
              </h3>
              <p className="text-sm text-gray-600">
                Hot and fresh to your door - free delivery on orders over €20
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-4 md:py-16 bg-gradient-to-br from-amber-50 to-red-50">
        <div className="sm:container mx-auto px-2 md:px-4">
          <SectionHeader
            title="What Our Customers Say"
            subtitle="Don't just take our word for it"
          />

          {/* EMBLA */}
          <div className="pt-8 lg:pt-12 px-6" ref={emblaRef}>
            <div className="flex">

              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="flex-[0_0_100%] md:flex-[0_0_33%] px-4"
                >
                  <div className="relative w-full max-w-md mx-auto bg-white shadow-sm rounded-2xl px-3 md:px-6 pt-16 pb-6">

                    {/* Top Logo */}
                    <div className="absolute left-1/2 -top-12 -translate-x-1/2">
                      <div className="w-24 h-24 rounded-full bg-white p-px shadow-md">
                        <img
                          src={t.img}
                          alt="Logo"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>

                    {/* Top Right Decor */}
                    <div className="absolute -top-4 -right-12 md:-top-8 md:-right-10">
                      <img
                        src="/testimonial/decoration.png"
                        alt=""
                        className="size-24 md:size-34 object-contain rotate-12"
                      />
                    </div>

                    {/* Bottom Left Decor */}
                    <div className="absolute -bottom-8 md:-bottom-16 -left-12 md:-left-16">
                      <img
                        src="/testimonial/decoration.png"
                        alt=""
                        className="size-28 md:size-40 object-contain rotate-160"
                      />
                    </div>

                    {/* Text */}
                    <p className="text-sm text-center text-gray-600 leading-relaxed relative z-10">
                      "{t.text}"
                    </p>

                    {/* Stars */}
                    <div className="flex justify-center mt-2 md:mt-4 gap-1 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="text-2xl text-[var(--color-primary)]"
                        >
                          ★
                        </span>
                      ))}
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="sm:container mx-auto px-2 md:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-6">
            Ready to Order?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-4 md:mb-8 max-w-2xl mx-auto">
            Experience authentic Italian pizza delivered hot and fresh to your
            door
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/menu"
              className="btn-primary text-sm !font-medium md:text-lg !px-6 md:!px-10 !py-3 md:py-5"
            >
              <span>Order Now</span>
            </Link>
            <Link
              to="/about"
              className="text-red-600 text-sm flex items-center"
            >
              Learn More About Us <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <Transition show={isCategoryModalOpen} as={Fragment}>
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)} />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300 transform"
            enterFrom="translate-y-full sm:translate-y-4 sm:scale-95 opacity-0"
            enterTo="translate-y-0 sm:scale-100 opacity-100"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-y-0 sm:scale-100 opacity-100"
            leaveTo="translate-y-full sm:translate-y-4 sm:scale-95 opacity-0"
          >
            <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[85vh]">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                <h3 className="font-bold text-lg text-gray-900">Menu Categories</h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded-full transition-colors"
                >
                  <FaTimes size={18} />
                </button>
              </div>
              <div className="overflow-y-auto p-4 flex flex-col gap-2 pb-8">
                {landingTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      handleLandingCategoryClick(tab);
                      setIsCategoryModalOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeCategory === tab
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-white text-gray-700 border border-gray-100 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                  >
                    {landingTabLabels[tab] || tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
}

export default Landing;
