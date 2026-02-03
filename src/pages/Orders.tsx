import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChefHat } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Package } from "lucide-react";
import { Clock } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Truck } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle2,
  preparing: ChefHat,
  "on-the-way": Truck,
  delivered: Package,
};

const statusColors = {
  pending: "text-yellow-500",
  confirmed: "text-blue-500",
  preparing: "text-orange-500",
  "on-the-way": "text-purple-500",
  delivered: "text-green-500",
};

const statusLabels = {
  pending: "Order Pending",
  confirmed: "Order Confirmed",
  preparing: "Preparing",
  "on-the-way": "On the Way",
  delivered: "Delivered",
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { orders } = state;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-4"
      >
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">My Orders</h1>
        </div>
      </motion.div>

      <div className="px-4 max-w-lg mx-auto mt-4">
        <AnimatePresence mode="wait">
          {orders.length > 0 ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {orders.map((order, index) => {
                const StatusIcon = statusIcons[order.status];
                const statusColor = statusColors[order.status];
                const statusLabel = statusLabels[order.status];

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-2xl p-5 shadow-card border border-border/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Order #{order.id}
                        </p>
                        <h3 className="font-bold text-foreground">
                          {order.restaurantName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary ${statusColor}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-xs font-medium">
                          {statusLabel}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="space-y-2 mb-4">
                        {order.items.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-sm truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-muted-foreground">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="font-bold text-foreground">Total</span>
                        <span className="font-bold text-primary">
                          ₹{order.total}
                        </span>
                      </div>
                    </div>

                    {order.status !== "delivered" && (
                      <Button
                        variant="outline"
                        className="w-full mt-4 rounded-xl border-primary text-primary hover:bg-primary/5"
                      >
                        Track Order
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl block mb-6"
              >
                📦
              </motion.span>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No orders yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Your order history will appear here
              </p>
              <Button
                onClick={() => navigate("/home")}
                className="gradient-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-primary-md"
              >
                Start Ordering
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
