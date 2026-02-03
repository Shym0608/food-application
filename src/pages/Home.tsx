import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Fish } from "lucide-react";
import { Search } from "lucide-react";
import { MapPin } from "lucide-react";
import { Utensils } from "lucide-react";
import { Coffee } from "lucide-react";
import { Pizza } from "lucide-react";
import { Sandwich } from "lucide-react";
import { IceCream } from "lucide-react";
import { Apple } from "lucide-react";
import { Soup } from "lucide-react";
import { RestaurantCard } from "@/components/ui/RestaurantCard";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import logo from "@/Logo/logo.jpeg";
import { toast } from "sonner";

/* ------------------ Categories ------------------ */
const categories = [
  {
    id: "all",
    name: "All",
    icon: Utensils,
    color: "from-orange-400 to-orange-600",
  },
  { id: "pizza", name: "Pizza", icon: Pizza, color: "from-red-400 to-red-600" },
  {
    id: "burger",
    name: "Burgers",
    icon: Sandwich,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "coffee",
    name: "Cafe",
    icon: Coffee,
    color: "from-amber-600 to-amber-800",
  },
  {
    id: "healthy",
    name: "Healthy",
    icon: Apple,
    color: "from-green-400 to-green-600",
  },
  {
    id: "sushi",
    name: "Sushi",
    icon: Fish,
    color: "from-pink-400 to-pink-600",
  },
  { id: "soup", name: "Soup", icon: Soup, color: "from-blue-400 to-blue-600" },
  {
    id: "dessert",
    name: "Sweets",
    icon: IceCream,
    color: "from-purple-400 to-purple-600",
  },
];

/* ------------------ Skeleton Card ------------------ */
const RestaurantSkeletonCard = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
    <div className="h-40 w-full bg-gray-200 rounded-xl mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
    <div className="flex gap-2">
      <div className="h-6 w-16 bg-gray-200 rounded-full" />
      <div className="h-6 w-20 bg-gray-200 rounded-full" />
    </div>
  </div>
);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  const { state } = useApp();
  const navigate = useNavigate();

  /* ------------------ Fetch Restaurants ------------------ */
  const fetchRestaurants = useCallback(
    async (currentPage: number, isNewSearch: boolean = false) => {
      // Prevent duplicate calls
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        // ✅ FIXED: Correct API endpoint
        const res = await api.get("/api/restaurants", {
          params: {
            search: searchQuery || undefined,
            page: currentPage,
            size: 10,
          },
        });

        const data = res.data;

        // ✅ Handle response based on whether it's content or paginated
        const newRestaurants = Array.isArray(data) ? data : data.content || [];

        if (isNewSearch || currentPage === 0) {
          setRestaurants(newRestaurants);
        } else {
          setRestaurants((prev) => [...prev, ...newRestaurants]);
        }

        // ✅ Check if there are more pages
        setHasMore(newRestaurants.length === 10);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        toast.error("Failed to load restaurants");
        setHasMore(false);
      } finally {
        setLoading(false);
        setInitialLoading(false);
        isFetchingRef.current = false;
      }
    },
    [searchQuery],
  );

  /* ------------------ Reset on Search/Category Change ------------------ */
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setRestaurants([]);
    setInitialLoading(true);
    fetchRestaurants(0, true);
  }, [searchQuery, activeCategory]);

  /* ------------------ Infinite Scroll ------------------ */
  useEffect(() => {
    const handleScroll = () => {
      // Don't fetch if already loading, no more data, or not scrolled enough
      if (loading || !hasMore || isFetchingRef.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // ✅ Trigger next page when user is 300px from bottom
      if (scrollTop + windowHeight >= documentHeight - 300) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchRestaurants(nextPage, false);
          return nextPage;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, fetchRestaurants]);

  /* ------------------ Filter by Category ------------------ */
  const filteredRestaurants =
    activeCategory === "all"
      ? restaurants
      : restaurants.filter((r) =>
          r.categories?.some(
            (c) => c.toLowerCase() === activeCategory.toLowerCase(),
          ),
        );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 md:pt-16 antialiased">
      {/* Mobile Logo */}
      <div className="flex mb-4 md:hidden">
        <img
          src={logo}
          alt="Logo"
          className="h-20 w-auto cursor-pointer"
          onClick={() => navigate("/home")}
        />
      </div>

      {/* Header */}
      <header className="pb-6 px-4 sm:px-6 max-w-[95%] md:max-w-6xl xl:max-w-7xl mx-auto">
        <div className="flex items-center gap-1 text-gray-400 mb-8">
          <MapPin className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Deliver to
          </span>
        </div>

        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-black"
        >
          What's on the{" "}
          <span className="text-orange-500 italic font-light">Menu </span>?
        </motion.h1>

        <div className="mt-6 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, dishes..."
            className="w-full h-14 pl-14 pr-14 rounded-2xl bg-white border shadow-sm focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
      </header>

      {/* Categories */}
      <section className="mb-10 px-4 sm:px-6 max-w-[95%] md:max-w-6xl xl:max-w-7xl mx-auto">
        <h2 className="text-xl font-black mb-4">Categories</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 min-w-[70px]"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  activeCategory === cat.id
                    ? `bg-gradient-to-br ${cat.color} text-white shadow-lg`
                    : "bg-white text-gray-400 border"
                }`}
              >
                <cat.icon className="w-7 h-7" />
              </div>
              <span
                className={`text-xs font-bold ${
                  activeCategory === cat.id
                    ? "text-orange-500"
                    : "text-gray-500"
                }`}
              >
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="px-4 sm:px-6 max-w-[95%] md:max-w-6xl xl:max-w-7xl mx-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-black">Popular Nearby</h2>
          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
            {initialLoading
              ? "Loading..."
              : `${filteredRestaurants.length} Found`}
          </span>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filteredRestaurants.map((res, idx) => (
            <RestaurantCard key={res.id} restaurant={res} index={idx} />
          ))}

          {/* Loading skeletons */}
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <RestaurantSkeletonCard key={`skeleton-${i}`} />
            ))}
        </div>

        {/* No Results */}
        {!initialLoading && !loading && filteredRestaurants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <div className="w-32 h-32 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Utensils className="w-12 h-12" />
            </div>
            <p className="text-lg font-semibold">Oops! No restaurants found.</p>
            <p className="text-sm mt-2">
              Try searching with a different name or category.
            </p>
          </div>
        )}

        {/* Loading More Indicator */}
        {loading && !initialLoading && filteredRestaurants.length > 0 && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading more...</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
