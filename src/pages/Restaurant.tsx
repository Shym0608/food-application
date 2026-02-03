// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useParams, useNavigate } from "react-router-dom";
// import { MapPin } from "lucide-react";
// import { Heart } from "lucide-react";
// import { Search } from "lucide-react";
// import { ArrowLeft } from "lucide-react";
// import { Star } from "lucide-react";
// import { Clock } from "lucide-react";
// import api from "@/lib/api";
// import { FoodCard } from "@/components/ui/FoodCard";
// import { useApp } from "@/contexts/AppContext";

// /* ------------------ Menu Categories ------------------ */
// const menuCategories = [
//   { id: "all", label: "All Menu" },
//   { id: "veg", label: "Pure Veg" },
//   { id: "non-veg", label: "Non-Veg" },
//   { id: "combo", label: "Value Combos" },
//   { id: "drinks", label: "Beverages" },
// ];

// export default function RestaurantPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { cartItems } = useApp(); // ✅ Add cartItems

//   const [restaurant, setRestaurant] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [favoriteIds, setFavoriteIds] = useState([]);

//   // ✅ Filter cart items for current restaurant only
//   const currentRestaurantCartItems =
//     cartItems?.filter((item) => item.restaurantId === id) || [];

//   const currentRestaurantCartTotal = currentRestaurantCartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0,
//   );

//   const currentRestaurantCartCount = currentRestaurantCartItems.reduce(
//     (count, item) => count + item.quantity,
//     0,
//   );

//   /* ------------------ Fetch Restaurant & Menu ------------------ */
//   useEffect(() => {
//     if (!id) return;

//     const fetchRestaurantAndMenu = async () => {
//       try {
//         // Fetch restaurant details using the correct endpoint
//         const restaurantRes = await api.get(`/api/restaurants/id/${id}`);
//         setRestaurant(restaurantRes.data);

//         // Fetch menu items using the correct endpoint
//         const menuRes = await api.get(`/api/restaurants/${id}/userMenu`);

//         // ✅ Map backend response to match FoodItem interface
//         const mappedMenuItems = Array.isArray(menuRes.data)
//           ? menuRes.data.map((item: any) => ({
//               ...item,
//               isVeg: item.veg, // Map veg to isVeg
//             }))
//           : [];

//         setMenuItems(mappedMenuItems);
//       } catch (error: any) {
//         console.error("Failed to fetch restaurant:", error);

//         // Handle specific errors
//         if (error.response?.status === 401) {
//           console.error("Unauthorized - check authentication");
//         } else if (error.response?.status === 403) {
//           console.error("Restaurant not approved or not available");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRestaurantAndMenu();
//   }, [id, navigate]);

//   /* ------------------ Loading State ------------------ */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-400 font-bold">
//         Loading restaurant...
//       </div>
//     );
//   }

//   /* ------------------ Error State ------------------ */
//   if (!restaurant) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-400 font-bold">
//         Restaurant not found or not available
//       </div>
//     );
//   }

//   /* ------------------ Image URL ------------------ */
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   const bannerImage = restaurant.imageUrl
//     ? `${API_BASE_URL}${restaurant.imageUrl}`
//     : "/fallback-image.png";

//   /* ------------------ Filter Menu ------------------ */
//   const filteredMenu = menuItems.filter((item: any) => {
//     const matchesSearch = item.name
//       ?.toLowerCase()
//       .includes(searchQuery.toLowerCase());

//     const matchesCategory =
//       activeCategory === "all" || item.category === activeCategory;

//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div className="min-h-screen bg-[#F8F9FB] pb-40">
//       {/* ------------------ Banner ------------------ */}
//       <div className="relative h-64">
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute top-24 left-4 z-50 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg active:scale-90"
//         >
//           <ArrowLeft className="w-6 h-6 text-gray-800" />
//         </button>

//         <img
//           src={bannerImage}
//           alt={restaurant.name}
//           className="w-full h-full object-cover"
//         />

//         <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
//       </div>

//       {/* ------------------ Restaurant Info ------------------ */}
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="relative -mt-20 mx-4"
//       >
//         <div className="bg-white rounded-[2rem] p-6 shadow border">
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-2xl font-black text-gray-900">
//                 {restaurant.name}
//               </h1>
//               <p className="text-gray-400 text-sm font-medium mt-1">
//                 {restaurant.categories?.join(", ")}
//               </p>
//             </div>

//             <div className="bg-green-50 px-3 py-1.5 rounded-2xl flex items-center gap-1">
//               <Star className="w-4 h-4 text-green-600 fill-current" />
//               <span className="font-bold text-green-700 text-sm">
//                 {restaurant.rating ?? "N/A"}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-6 mt-6 pt-6 border-t">
//             <div className="flex items-center gap-2">
//               <Clock className="w-4 h-4 text-orange-500" />
//               <span className="text-sm font-bold text-gray-700">
//                 30–40 mins
//               </span>
//             </div>

//             <div className="flex items-center gap-2">
//               <MapPin className="w-4 h-4 text-blue-500" />
//               <span className="text-sm font-bold text-gray-700">
//                 {restaurant.address?.street || "Location unavailable"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* ------------------ Search + Categories ------------------ */}
//       <div className="px-4 mt-8 sticky top-0 bg-[#F8F9FB]/80 backdrop-blur-sm py-4 z-40">
//         <div className="relative mb-6">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search for dishes..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20"
//           />
//         </div>

//         <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
//           {menuCategories.map((category) => (
//             <button
//               key={category.id}
//               onClick={() => setActiveCategory(category.id)}
//               className={`px-6 py-3.5 rounded-full font-bold text-xs uppercase transition-all ${
//                 activeCategory === category.id
//                   ? "bg-orange-500 text-white shadow"
//                   : "bg-white text-gray-400 border"
//               }`}
//             >
//               {category.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ------------------ Menu List ------------------ */}
//       <div className="px-4 mt-4 space-y-6">
//         <AnimatePresence>
//           {filteredMenu.length > 0 ? (
//             filteredMenu.map((item: any, index: number) => (
//               <div key={item.id} className="relative">
//                 {/* ❤️ Favorite Icon */}
//                 <button
//                   className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow active:scale-90"
//                   onClick={() => {
//                     // future: add favorite logic here
//                   }}
//                 >
//                   <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
//                 </button>

//                 <FoodCard item={item} index={index} restaurantId={id!} />
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-20 opacity-40 font-bold">
//               No dishes found.
//             </div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* ------------------ Cart Button (Only for Current Restaurant) ------------------ */}
//       <AnimatePresence>
//         {currentRestaurantCartCount > 0 && ( // ✅ Use restaurant-specific count
//           <motion.div
//             initial={{ y: 100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: 100, opacity: 0 }}
//             className="fixed bottom-24 left-4 right-4 z-50 max-w-md mx-auto"
//           >
//             <button
//               onClick={() => navigate("/cart")}
//               className="w-full h-20 bg-white rounded-[2rem] flex items-center justify-between px-6 shadow border"
//             >
//               <div>
//                 <p className="text-xs font-black text-orange-500 uppercase">
//                   {currentRestaurantCartCount} Items{" "}
//                   {/* ✅ Use restaurant-specific count */}
//                 </p>
//                 <p className="text-2xl font-black">
//                   ₹{currentRestaurantCartTotal}
//                 </p>{" "}
//                 {/* ✅ Use restaurant-specific total */}
//               </div>

//               <div className="bg-orange-500 px-8 py-3 rounded-2xl text-white font-black">
//                 View Cart →
//               </div>
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Heart, Search, ArrowLeft, Star, Clock } from "lucide-react";
import api from "@/lib/api";
import { FoodCard } from "@/components/ui/FoodCard";
import { useApp } from "@/contexts/AppContext";

/* ------------------ Menu Categories ------------------ */
const menuCategories = [
  { id: "all", label: "All Menu" },
  { id: "veg", label: "Pure Veg" },
  { id: "non-veg", label: "Non-Veg" },
  { id: "combo", label: "Value Combos" },
  { id: "drinks", label: "Beverages" },
];

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems } = useApp();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  /* ------------------ Cart Calculations ------------------ */
  const currentRestaurantCartItems =
    cartItems?.filter((item) => item.restaurantId === id) || [];

  const currentRestaurantCartTotal = currentRestaurantCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const currentRestaurantCartCount = currentRestaurantCartItems.reduce(
    (count, item) => count + item.quantity,
    0,
  );

  /* ------------------ Fetch Restaurant & Menu ------------------ */
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const restaurantRes = await api.get(`/api/restaurants/id/${id}`);
        setRestaurant(restaurantRes.data);

        const menuRes = await api.get(`/api/restaurants/${id}/userMenu`);
        const mappedMenu = Array.isArray(menuRes.data)
          ? menuRes.data.map((item: any) => ({
              ...item,
              isVeg: item.veg,
            }))
          : [];

        setMenuItems(mappedMenu);
      } catch (error) {
        console.error("Failed to fetch restaurant or menu", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ------------------ Fetch Favorites ------------------ */
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("/api/user/favorites");
        const ids = Array.isArray(res.data)
          ? res.data.map((item: any) => item.id)
          : [];
        setFavoriteIds(ids);
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      }
    };

    fetchFavorites();
  }, []);

  /* ------------------ Toggle Favorite ------------------ */
  const toggleFavorite = async (itemId: string) => {
    const isFavorite = favoriteIds.includes(itemId);

    try {
      if (isFavorite) {
        await api.delete(`/api/user/favorites/${itemId}`);
        setFavoriteIds((prev) => prev.filter((id) => id !== itemId));
      } else {
        await api.post(`/api/user/favorites/${itemId}`);
        setFavoriteIds((prev) => [...prev, itemId]);
      }
    } catch (error) {
      console.error("Favorite toggle failed", error);
    }
  };

  /* ------------------ Loading ------------------ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">
        Loading restaurant...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">
        Restaurant not found
      </div>
    );
  }

  /* ------------------ Image ------------------ */
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const bannerImage = restaurant.imageUrl
    ? `${API_BASE_URL}${restaurant.imageUrl}`
    : "/fallback-image.png";

  /* ------------------ Filter Menu ------------------ */
  const filteredMenu = menuItems.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-40">
      {/* ------------------ Banner ------------------ */}
      <div className="relative h-64">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 z-50 p-3 bg-white rounded-full shadow"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <img
          src={bannerImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ------------------ Restaurant Info ------------------ */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative -mt-20 mx-4"
      >
        <div className="bg-white rounded-[2rem] p-6 shadow border">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-black">{restaurant.name}</h1>
              <p className="text-gray-400 text-sm">
                {restaurant.categories?.join(", ")}
              </p>
            </div>

            <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-xl">
              <Star className="w-4 h-4 text-green-600 fill-green-600" />
              <span className="font-bold text-green-700">
                {restaurant.rating ?? "N/A"}
              </span>
            </div>
          </div>

          <div className="flex gap-6 mt-6 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-sm">30–40 mins</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-sm">
                {restaurant.address?.street || "Location unavailable"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ------------------ Search + Categories ------------------ */}
      <div className="px-4 mt-8 sticky top-0 bg-[#F8F9FB]/90 backdrop-blur py-4 z-40">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for dishes..."
            className="w-full h-14 pl-12 rounded-2xl bg-white shadow"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {menuCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-bold text-xs ${
                activeCategory === cat.id
                  ? "bg-orange-500 text-white"
                  : "bg-white border text-gray-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------ Menu List ------------------ */}
      <div className="px-4 mt-4 space-y-6">
        {filteredMenu.map((item, index) => (
          <div key={item.id} className="relative">
            {/* ❤️ Favorite Button */}
            <button
              onClick={() => toggleFavorite(item.id)}
              className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow"
            >
              <Heart
                className={`w-5 h-5 transition ${
                  favoriteIds.includes(item.id)
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400 hover:text-red-400"
                }`}
              />
            </button>

            <FoodCard item={item} index={index} restaurantId={id!} />
          </div>
        ))}
      </div>

      {/* ------------------ Cart Button ------------------ */}
      <AnimatePresence>
        {currentRestaurantCartCount > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-24 left-4 right-4 max-w-md mx-auto"
          >
            <button
              onClick={() => navigate("/cart")}
              className="w-full h-20 bg-white rounded-[2rem] flex justify-between px-6 shadow border"
            >
              <div>
                <p className="text-xs font-black text-orange-500">
                  {currentRestaurantCartCount} Items
                </p>
                <p className="text-2xl font-black">
                  ₹{currentRestaurantCartTotal}
                </p>
              </div>
              <div className="bg-orange-500 px-8 py-3 rounded-2xl text-white font-black">
                View Cart →
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
