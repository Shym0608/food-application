import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentFailed() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const [countdown, setCountdown] = useState(20);

  // Auto redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/checkout");
    }, 20000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 text-center"
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="flex justify-center"
        >
          <div className="bg-red-100 p-5 rounded-full">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-800 mt-6">
          Oops! Payment Failed 😔
        </h1>

        <p className="text-slate-500 mt-2 text-sm">
          Looks like your payment didn’t go through.
        </p>

        {orderId && (
          <p className="text-xs text-slate-400 mt-2">
            Order ID: <span className="font-medium">{orderId}</span>
          </p>
        )}

        {/* Retry Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="mt-6 w-full gap-2 rounded-xl bg-orange-500 hover:bg-orange-600"
            onClick={() => navigate(`/checkout?orderId=${orderId}`)}
          >
            <RotateCcw className="w-4 h-4" />
            Try Payment Again
          </Button>
        </motion.div>

        {/* Countdown */}
        <p className="text-xs text-slate-400 mt-5">
          Redirecting to checkout in{" "}
          <span className="font-semibold text-slate-600">{countdown}s</span>
        </p>

        {/* Food-app friendly message */}
        <p className="text-[11px] text-slate-400 mt-2">
          Don’t worry — your hunger is still safe 🍕
        </p>
      </motion.div>
    </div>
  );
}
