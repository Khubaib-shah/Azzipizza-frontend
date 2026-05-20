import { useState, useRef, useContext, useMemo, Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
  Portal,
} from "@headlessui/react";
import ProductCard from "../components/cards/ProductsCard";
import Context from "@shared/context/dataContext";
import ProductsListSkeleton from "../components/ProductsListSkeleton";
import SectionHeader from "../components/SectionHeader";
import {
  FaSearch,
  FaFilter,
  FaTh,
  FaList,
  FaChevronDown,
  FaCheck,
} from "react-icons/fa";

function Menu() {
  const { items, isLoading } = useContext(Context);
  const categoryRefs = useRef({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const categoriesContainerRef = useRef(null);
  const sortOptions = [
    { id: "discount", label: "Best Offers" },
    { id: "default", label: "Sort By: Default" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "name", label: "Name: A-Z" },
  ];

  const currentSortLabel =
    sortOptions.find((o) => o.id === sortBy)?.label || "Sort By: Default";

  const menuItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return [...new Set(items.map((item) => item.category))];
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!items) return [];

    let filtered = items;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (activeCategory && activeCategory !== "all") {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    return filtered;
  }, [items, searchQuery, activeCategory]);

  // Sort items
  const sortedItems = useMemo(() => {
    let sorted = [...filteredItems];

    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "discount":
        sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        break;
    }

    return sorted;
  }, [filteredItems, sortBy]);

  // Separate offers
  const offerItems = useMemo(() => {
    if (!items) return [];
    return [...items]
      .filter((item) => item.showInWeeklySpecials)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  }, [items]);

  // Group by category (Optimized single-pass grouping)
  const listing = useMemo(() => {
    const result = {};
    sortedItems.forEach((item) => {
      if (!result[item.category]) {
        result[item.category] = [];
      }
      result[item.category].push(item);
    });
    return result;
  }, [sortedItems]);

  const visibleCategories = useMemo(() => Object.keys(listing), [listing]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category !== "all") {
      setTimeout(() => {
        const el = categoryRefs.current[category];
        if (el) {
          const offset = 150;
          const topPos =
            el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({
            top: topPos,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white!">
            Our Menu
          </h1>
          <p className="text-xl text-amber-200">
            Explore our delicious selection of authentic Italian pizzas
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8 pb-12" id="menu">
        {isLoading ? (
          <ProductsListSkeleton />
        ) : items.length > 0 ? (
          <>
            {/* Special Offers Section */}
            {offerItems.length > 0 && (
              <section className="mb-12">
                <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-8 border-2 border-red-200 shadow-sm">
                  <SectionHeader
                    title="Weekly Specials"
                    subtitle="Limited time offers – grab them before they're gone!"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {offerItems.slice(0, 8).map((item) => (
                      <ProductCard key={item._id} product={item} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Search and Filters */}
            <div className="card-premium p-6 mb-6 overflow-visible">
              <div className="grid grid-cols-2 md:grid-cols-12 gap-4 overflow-visible">
                {/* Search Bar */}
                <div className="md:col-span-5 relative group">
                  <FaSearch
                    size={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500 group-focus-within:text-red-600 transition-colors z-10"
                  />
                  <input
                    type="text"
                    placeholder="Search for your favorite pizza..."
                    className="pl-12 pr-4 py-3.5 w-full border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all bg-gray-50/50 hover:bg-white hover:border-red-200 font-semibold text-gray-700 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="col-span-1 md:col-span-3 relative">
                  <Listbox value={sortBy} onChange={setSortBy}>
                    <div className="relative group">
                      <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500 group-focus-within:text-red-600 transition-colors z-10" />
                      <ListboxButton className="relative pl-12 pr-10 py-3.5 w-full border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all bg-gray-50/50 hover:bg-white hover:border-red-200 font-semibold text-gray-700 shadow-sm text-left truncate">
                        {currentSortLabel}
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors z-10">
                          <FaChevronDown size={14} />
                        </span>
                      </ListboxButton>

                      <Portal>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <ListboxOptions
                            anchor="bottom end"
                            className="z-[9999] mt-1 w-[var(--button-width)] overflow-auto rounded-2xl bg-white p-1 text-base shadow-2xl ring-1 ring-black/5 focus:outline-none max-h-72 [--anchor-gap:8px]"
                          >
                            {sortOptions.map((option) => (
                              <ListboxOption
                                key={option.id}
                                value={option.id}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-3 pl-10 pr-4 rounded-xl transition-all ${
                                    active
                                      ? "bg-red-50 text-red-600"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${selected ? "font-bold" : "font-medium"}`}
                                    >
                                      {option.label}
                                    </span>
                                    {selected && (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-500">
                                        <FaCheck size={12} aria-hidden="true" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </Transition>
                      </Portal>
                    </div>
                  </Listbox>
                </div>

                {/* View Mode Toggle */}
                <div className="col-span-2 md:col-span-4 gap-2 hidden md:flex">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 py-3.5 px-4 rounded-2xl font-semibold transition-all ${
                      viewMode === "grid"
                        ? "bg-red-600 text-white shadow-md shadow-red-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <FaTh className="inline mr-2" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 py-3.5 px-4 rounded-2xl font-semibold transition-all ${
                      viewMode === "list"
                        ? "bg-red-600 text-white shadow-md shadow-red-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <FaList className="inline mr-2" />
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="bg-white/95 backdrop-blur-md sticky top-[80px] z-20 py-4 px-4 rounded-2xl shadow-lg mb-6 overflow-visible border border-gray-100">
              <div
                ref={categoriesContainerRef}
                className="flex overflow-x-auto gap-4 styled-scrollbar whitespace-nowrap p-2"
              >
                <button
                  onClick={() => handleCategoryClick("all")}
                  className={`px-6 py-2.5 font-semibold text-sm transition-[background-color,color,border-color,transform] duration-300 rounded-full uppercase shadow-md ${
                    activeCategory === "all"
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                      : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border-2 border-gray-200 hover:border-red-300"
                  }`}
                >
                  All Items
                </button>
                {menuItems?.map((item) => (
                  <button
                    key={item}
                    className={`px-6 py-2.5 font-semibold text-sm transition-[background-color,color,border-color,transform] duration-300 rounded-full uppercase shadow-md ${
                      activeCategory === item
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                        : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border-2 border-gray-200 hover:border-red-300"
                    }`}
                    onClick={() => handleCategoryClick(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Display */}
            {searchQuery || activeCategory !== "all" ? (
              // Search/Filter Results
              <div className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : `${activeCategory}`}
                  </h2>
                  <p className="text-gray-600">
                    {sortedItems.length}{" "}
                    {sortedItems.length === 1 ? "item" : "items"} found
                  </p>
                </div>
                {sortedItems.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "space-y-4"
                    }
                  >
                    {sortedItems.map((item) => (
                      <ProductCard key={item._id} product={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-500">
                      No items found. Try adjusting your search or filters.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Category View
              visibleCategories.map((category) => (
                <div
                  key={category}
                  ref={(el) => (categoryRefs.current[category] = el)}
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
                      }[category] || "Handcrafted with love and authentic Italian ingredients"
                    }
                  />
                  {listing[category]?.length > 0 && (
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                          : "space-y-4"
                      }
                    >
                      {listing[category].map((item) => (
                        <ProductCard key={item._id} product={item} />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h1 className="font-mono text-gray-500 tracking-tight text-xl">
              No items available. Please check back later.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
