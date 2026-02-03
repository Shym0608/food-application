import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Landmark } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import { ReceiptText } from "lucide-react";
import { Truck } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch, cartTotal } = useApp();
  const { cart } = state;
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  const deliveryFee = cartTotal > 0 ? 40 : 0;
  const taxes = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + taxes;

  const restaurantId = cart.length > 0 ? cart[0].restaurantId : null;

  // ✅ Get API base URL for images
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleUpdateQuantity = async (
    id: string,
    newQuantity: number,
    currentQuantity: number,
  ) => {
    if (!restaurantId) {
      toast.error("Restaurant ID not found");
      return;
    }

    // prevent negative qty
    if (newQuantity < 0) return;

    setLoadingItems((prev) => new Set(prev).add(id));

    // optimistic UI update (UNCHANGED UI)
    if (newQuantity === 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: id });
    } else {
      dispatch({
        type: "UPDATE_CART_QUANTITY",
        payload: { id, quantity: newQuantity },
      });
    }

    try {
      // ➕ INCREASE
      if (newQuantity > currentQuantity) {
        await api.post("/api/cart/add", {
          restaurantId,
          menuItemId: id,
          quantity: 1,
        });
      }

      // ➖ DECREASE (THIS IS WHAT YOU WANTED)
      if (newQuantity < currentQuantity) {
        await api.post("/api/cart/decrease", {
          menuItemId: id,
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update cart");

      // rollback UI
      dispatch({
        type: "UPDATE_CART_QUANTITY",
        payload: { id, quantity: currentQuantity },
      });
    } finally {
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // ✅ NEW: Remove item with backend sync
  const handleRemoveItem = async (id: string, currentQuantity: number) => {
    if (!restaurantId) {
      toast.error("Restaurant ID not found");
      return;
    }

    setLoadingItems((prev) => new Set(prev).add(id));

    // Update UI immediately
    dispatch({ type: "REMOVE_FROM_CART", payload: id });

    try {
      // Send negative quantity to remove from backend
      await api.post("/api/cart/add", {
        restaurantId: restaurantId,
        menuItemId: id,
        quantity: -currentQuantity, // Remove all quantity
      });

      toast.success("Item removed from cart");
    } catch (error: any) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");

      // Could revert here if needed, but removal usually should succeed
    } finally {
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-40">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-black uppercase tracking-widest text-gray-400 leading-none mb-1">
              My Cart
            </h1>
            <p className="text-xs font-bold text-gray-900 italic leading-none">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </p>
          </div>
          <div className="w-10" />
        </div>
      </motion.div>

      <div className="px-5 mt-6">
        <AnimatePresence mode="wait">
          {cart.length > 0 ? (
            <motion.div key="cart-content">
              <div className="space-y-4 mb-10">
                {cart.map((item, index) => {
                  const isLoading = loadingItems.has(item.id);

                  // ✅ Fix image URL by prepending API base URL if needed
                  const imageUrl = item.imageUrl?.startsWith("http")
                    ? item.imageUrl
                    : `${API_BASE_URL}${item.imageUrl}`;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
                    >
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          onError={(e) => {
                            // ✅ Fallback image if loading fails
                            e.currentTarget.src = "/fallback-image.png";
                          }}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex justify-between items-center">
                        {/* LEFT: Price + Name (vertical) */}
                        <div className="flex flex-col">
                          <span className="font-black italic text-gray-900">
                            ₹{item.price}
                          </span>
                          <span className="font-black italic text-gray-900 truncate">
                            {item.name}
                          </span>
                        </div>

                        {/* RIGHT: Quantity Controls */}
                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.quantity - 1,
                                item.quantity,
                              )
                            }
                            disabled={isLoading}
                            className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-gray-900 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="w-4 text-center text-xs font-black text-gray-900">
                            {isLoading ? "..." : item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.quantity + 1,
                                item.quantity,
                              )
                            }
                            disabled={isLoading}
                            className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden relative"
              >
                <div className="flex items-center gap-2 mb-6">
                  <ReceiptText className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Order Summary
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                        <ReceiptText className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-gray-500 text-sm font-medium">
                        Subtotal
                      </span>
                    </div>
                    <span className="text-gray-900 font-bold">
                      ₹{cartTotal}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-gray-500 text-sm font-medium">
                        Delivery Fee
                      </span>
                    </div>
                    <span className="text-green-600 font-bold text-sm">
                      ₹{deliveryFee}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                        <Landmark className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-gray-500 text-sm font-medium">
                        Tax & Charges
                      </span>
                    </div>
                    <span className="text-gray-900 font-bold text-sm">
                      ₹{taxes}
                    </span>
                  </div>

                  <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-black uppercase text-gray-900 tracking-widest">
                      Grand Total
                    </span>
                    <div className="text-right">
                      <span className="text-3xl font-black italic text-gray-900 tracking-tighter">
                        ₹{grandTotal}
                      </span>
                      <span className="block text-[10px] font-bold text-green-600 uppercase tracking-tight">
                        Inclusive of all taxes
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-10"
            >
              <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                <span className="text-5xl">🛒</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                Your cart is empty
              </h2>
              <p className="text-gray-400 text-sm font-medium mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button
                onClick={() => navigate("/home")}
                className="h-14 bg-orange-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all"
              >
                Start Ordering
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-4 right-4 z-[60] max-w-md mx-auto sm:bottom-10"
          >
            <button
              onClick={() => navigate("/checkout")}
              className="w-full h-20 bg-white/70 backdrop-blur-xl rounded-[2rem] flex items-center justify-between px-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] border border-white/40 group active:scale-95 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none" />

              <div className="pl-6 flex flex-col items-start leading-none relative z-10">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">
                  Total to pay
                </span>

                <span className="text-2xl font-black italic tracking-tighter text-gray-900">
                  ₹{grandTotal}
                </span>
              </div>

              <div className="bg-orange-500 h-14 px-8 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 relative z-10">
                <span className="text-sm font-black uppercase tracking-widest text-white">
                  Checkout
                </span>
                <ArrowLeft className="w-5 h-5 rotate-180 text-white" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
