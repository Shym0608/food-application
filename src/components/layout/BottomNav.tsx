import { motion } from "framer-motion";
import { Home, ShoppingBag, ClipboardList, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import logo from "@/Logo/logo.jpeg";



const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/cart", icon: ShoppingBag, label: "Cart" },
  { path: "/orders", icon: ClipboardList, label: "Orders" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItemCount } = useApp();

  if (["/", "/login", "/signup", "/otp"].includes(location.pathname)) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 md:top-0 md:bottom-auto left-0 right-0 bg-white/95 backdrop-blur-lg border-t md:border-t-0 md:border-b border-border safe-bottom z-[100] shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between md:justify-between py-2 px-6">
        {/* ✅ LOGO — DESKTOP ONLY */}
        <div className="hidden md:flex items-center h-12">
          <img
            src={logo}
            alt="Logo"
            className="h-24 w-auto object-contain cursor-pointer mix-blend-multiply"
            onClick={() => navigate("/home")}
          />
        </div>

        {/* NAV ITEMS */}
        <div className="flex items-center justify-around md:justify-end w-full md:w-auto md:gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col md:flex-row items-center py-2 px-4 transition-all hover:opacity-70"
              >
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 md:w-5 md:h-5 transition-colors ${
                      isActive ? "text-orange-500" : "text-gray-400"
                    }`}
                  />

                  {/* CART BADGE */}
                  {item.path === "/cart" && cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </motion.span>
                  )}
                </div>

                <span
                  className={`text-[10px] md:text-sm md:ml-2 mt-1 md:mt-0 font-bold transition-colors ${
                    isActive ? "text-orange-500" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>

                {/* ACTIVE INDICATOR */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 md:top-auto md:-bottom-2 left-1/2 -translate-x-1/2 w-8 md:w-full h-1 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
