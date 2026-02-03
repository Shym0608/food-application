import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { PaymentService } from "@/Payment.service";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  const [progress, setProgress] = useState(0);

  // ⏳ Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : prev));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // 🚀 Auto redirect
  useEffect(() => {
    if (!orderId) return;

    const timer = setTimeout(async () => {
      try {
        // ✅ Manually mark as paid (temporary)
        await PaymentService.markOrderAsPaid(orderId);

        // ✅ Then fetch order
        await PaymentService.getOrder(orderId);

        navigate(`/order-tracking?orderId=${orderId}`);
      } catch (err) {
        navigate(`/payment-failed?orderId=${orderId}`);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [orderId]);
  // useEffect(() => {
  //   if (!orderId) return;

  //   const timer = setTimeout(async () => {
  //     try {
  //       await PaymentService.getOrder(orderId);
  //       navigate(`/order-tracking?orderId=${orderId}`);
  //     } catch {
  //       navigate(`/payment-failed?orderId=${orderId}`);
  //     }
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, [orderId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-rose-100 to-yellow-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md w-full"
      >
        {/* ✅ Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-14 h-14 text-green-600" />
        </motion.div>

        {/* 🎉 Title */}
        <h1 className="mt-6 text-3xl font-extrabold text-slate-800">
          Payment Successful 🎉
        </h1>

        <p className="text-slate-500 mt-2">
          Your delicious food is cooking 🍕🍔
        </p>

        {/* 🧾 Order ID */}
        {orderId && (
          <p className="mt-4 text-sm text-slate-600">
            Order ID: <strong>{orderId}</strong>
          </p>
        )}

        {/* ⏳ Progress Bar */}
        <div className="mt-6 w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-2 bg-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-slate-400 mt-2">
          Redirecting to order tracking...
        </p>

        {/* 🔘 CTA Button */}
        <button
          onClick={() => navigate(`/order-tracking?orderId=${orderId}`)}
          className="mt-6 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 transition text-white px-6 py-3 rounded-full font-semibold shadow-md"
        >
          Track Order <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
}
