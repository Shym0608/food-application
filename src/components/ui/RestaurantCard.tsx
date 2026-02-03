import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Restaurant } from "@/contexts/AppContext";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  const navigate = useNavigate();

  const imageSrc = restaurant.imageUrl
    ? `${API_BASE_URL}${restaurant.imageUrl}`
    : "/fallback-image.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="group cursor-pointer rounded-3xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all"
    >
      {/* IMAGE */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={imageSrc}
          alt={restaurant.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Rating */}
        {restaurant.rating !== undefined && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-background/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow">
            <Star className="w-4 h-4 text-green-600 fill-green-600" />
            <span className="text-sm font-bold text-foreground">
              {restaurant.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-base font-extrabold text-foreground truncate">
          {restaurant.name}
        </h3>

        <p className="text-sm text-muted-foreground mt-1 truncate">
          {restaurant.cuisine || "Multi-cuisine"}
        </p>

        {/* META */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">
              {restaurant.address?.city ?? "Nearby"}
            </span>
          </div>

          <span className="text-sm font-medium text-muted-foreground">
            ₹{restaurant.basePrice ?? 0} for two
          </span>
        </div>
      </div>
    </motion.div>
  );
}
