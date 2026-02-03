import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import api from "@/lib/api";
import { FoodCard } from "@/components/ui/FoodCard";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ Fetch Favorite Foods ------------------ */
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("/api/user/favorites");
        setFavorites(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  /* ------------------ Loading ------------------ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-bold">
        Loading favorite food...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-32">
      {/* ------------------ Header ------------------ */}
      <div className="sticky top-0 z-40 bg-white border-b px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-gray-50 rounded-full"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>

        <h1 className="text-sm font-black flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          My Favorite Food
        </h1>

        <div className="w-9" />
      </div>

      {/* ------------------ Favorite Food List ------------------ */}
      <div className="px-4 mt-6 space-y-6">
        {favorites.length > 0 ? (
          favorites.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <FoodCard
                item={{ ...item, isVeg: item.veg }}
                index={index}
                restaurantId={item.restaurantId}
              />
            </motion.div>
          ))
        ) : (
          <div className="text-center py-24 text-gray-400 font-bold">
            ❤️ No favorite food added yet
          </div>
        )}
      </div>
    </div>
  );
}
