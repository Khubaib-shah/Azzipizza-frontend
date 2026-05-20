import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaFire, FaClock, FaShippingFast } from "react-icons/fa";
import Context from "@shared/context/dataContext";
import ProductCard from "../components/cards/ProductsCard";
import ProductCardSkeleton from "../components/cards/ProductCardSkeleton";
import HeroSection from "../components/heroSection/HeroSection";
import SectionHeader from "../components/SectionHeader";
import { ChevronRight } from "lucide-react";

function Landing() {
  const { items, isLoading } = useContext(Context);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [weeklySpecials, setWeeklySpecials] = useState([]);

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
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Special Offers Section */}
      {(isLoading || specialOffers.length > 0) && (
        <section className="!py-2 md:py-16 bg-gradient-to-r from-red-50 to-amber-50">
          <div className="container mx-auto px-px md:px-4">
            <SectionHeader
              title="Special Offers"
              subtitle="Don't miss out on our exclusive deals and limited-time offers!"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
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
        <section className="py-16">
          <div className="container mx-auto px-px md:px-4">
            <SectionHeader
              title="Chef's Specials"
              subtitle="Handpicked by our master chefs"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-8">
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
        <section className="py-16 bg-gradient-to-br from-cream to-amber-50/50">
          <div className="container mx-auto px-px md:px-4">
            <SectionHeader
              title="Weekly Specials"
              subtitle="Taste something new this week with our unique, limited-time creations!"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
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


      {/* Why Choose Us Section */}
      <section className="md:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-px md:px-4">
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
        <div className="container mx-auto px-px md:px-4">
          <SectionHeader
            title="What Our Customers Say"
            subtitle="Don't just take our word for it"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="card-premium p-4 md:p-8">
              <div className="flex mb-2 md:mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className="text-amber-400 text-sm md:text-xl"
                  />
                ))}
              </div>
              <p className="text-sm md:text-lg mb-4 italic">
                "The best pizza in Bologna! The crust is perfect, ingredients
                are fresh, and the flavors are incredible. Highly recommended!"
              </p>
              <p className="font-bold">- Marco R.</p>
            </div>

            <div className="card-premium p-4 md:p-8">
              <div className="flex mb-2 md:mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className="text-amber-400 text-sm md:text-xl"
                  />
                ))}
              </div>
              <p className="text-sm md:text-lg mb-4 italic">
                "Authentic Italian pizza made with love. You can taste the
                quality in every bite. Fast delivery too!"
              </p>
              <p className="font-bold">- Sofia M.</p>
            </div>

            <div className="card-premium p-4 md:p-8">
              <div className="flex mb-2 md:mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className="text-amber-400 text-sm md:text-xl"
                  />
                ))}
              </div>
              <p className="text-sm md:text-lg mb-4 italic">
                "Amazing pizza! The wood-fired oven makes all the difference.
                This is now my go-to pizzeria!"
              </p>
              <p className="font-bold">- Luca B.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-px md:px-4 text-center">
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
    </div>
  );
}

export default Landing;
