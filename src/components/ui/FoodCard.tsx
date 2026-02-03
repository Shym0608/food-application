import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import { FoodItem, useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

interface FoodCardProps {
  item: FoodItem;
  index?: number;
  restaurantId: string;
}

export function FoodCard({ item, index = 0, restaurantId }: FoodCardProps) {
  const { state, dispatch } = useApp();
  const cartItem = state.cart.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const imageSrc = item.imageUrl
    ? `${API_BASE_URL}${item.imageUrl}`
    : "/fallback-food.png";

  /* ---------------- ADD ITEM ---------------- */
  const handleAdd = async () => {
    if (!restaurantId) return toast.error("Restaurant ID missing");

    setIsLoading(true);
    try {
      await api.post("/api/cart/add", {
        restaurantId,
        menuItemId: item.id,
        quantity: 1,
      });

      dispatch({
        type: "ADD_TO_CART",
        payload: { ...item, restaurantId },
      });

      toast.success("Added to cart");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- UI UPDATE ---------------- */
  const handleUpdateQuantity = (newQty: number) => {
    const oldQty = quantity;

    // optimistic UI update
    dispatch({
      type: "UPDATE_CART_QUANTITY",
      payload: { id: item.id, quantity: newQty },
    });

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      syncWithBackend(oldQty, newQty);
    }, 400);
  };

  /* ---------------- BACKEND SYNC ---------------- */
  const syncWithBackend = async (oldQty: number, newQty: number) => {
    try {
      // ➕ Increase quantity
      if (newQty > oldQty) {
        await api.post("/api/cart/add", {
          restaurantId,
          menuItemId: item.id,
          quantity: newQty - oldQty,
        });
      }

      // ➖ Decrease quantity
      if (newQty < oldQty) {
        await api.post("/api/cart/decrease", {
          menuItemId: item.id,
        });
      }

    
    } catch (error) {
      console.error("❌ Cart sync failed", error);

      // rollback UI
      dispatch({
        type: "UPDATE_CART_QUANTITY",
        payload: { id: item.id, quantity: oldQty },
      });

      toast.error("Failed to update cart");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-4 p-4 bg-white rounded-[2rem] shadow border items-center"
    >
      <img
        src={imageSrc}
        onError={(e) => (e.currentTarget.src = "/fallback-food.png")}
        className="w-24 h-24 object-cover rounded-2xl"
      />

      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">{item.name}</h3>
          <div className="flex items-center gap-1 text-orange-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs">{item.rating ?? 0}</span>
          </div>
        </div>

        {/* Veg / Non-Veg indicator */}
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`w-3 h-3 rounded-full border ${
              item.veg
                ? "bg-green-500 border-green-700"
                : "bg-red-500 border-red-700"
            }`}
          />
          <span className="text-xs text-gray-500">
            {item.veg ? "Veg" : "Non-Veg"}
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-1">
          {item.description || "No description"}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="font-black text-lg">₹{item.price}</span>

          {quantity === 0 ? (
            <Button
              size="sm"
              disabled={isLoading}
              onClick={handleAdd}
              className="bg-orange-500 text-white rounded-xl"
            >
              ADD
            </Button>
          ) : (
            <div className="flex items-center gap-3 bg-orange-500 text-white px-3 py-1 rounded-xl">
              <button onClick={() => handleUpdateQuantity(quantity - 1)}>
                <Minus size={14} />
              </button>

              <span className="font-bold text-sm">{quantity}</span>

              <button onClick={() => handleUpdateQuantity(quantity + 1)}>
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
