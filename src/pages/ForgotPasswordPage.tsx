import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { Mail } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import OTPModal from "./OtpModal";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/api/auth/forgot-password", {
        email,
      });

      toast.success("OTP sent to your email 📩");
      setIsOTPModalOpen(true);
    } catch (error: any) {
      console.error("Forgot password error:", error);

      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#fdfdfd] flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-50/80 rounded-full blur-[120px] z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[480px] bg-white/40 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-orange-500 rounded-[2rem] flex items-center justify-center shadow-lg shadow-orange-200">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
          </div>

          <header className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">
              Forgot Password?
            </h2>
            <p className="text-gray-500 text-base font-medium leading-relaxed">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </header>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                Email Address
              </label>
              <div className="relative flex items-center group">
                <div className="absolute left-5 z-20 pointer-events-none transition-transform group-focus-within:scale-110 duration-300">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative z-10 w-full pl-14 h-15 rounded-2xl bg-white/50 backdrop-blur-md border border-white/20 focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:bg-white/80 transition-all shadow-sm text-base"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-15 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-xl shadow-orange-100 transition-all active:scale-[0.98] relative overflow-hidden"
            >
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100/50 text-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center text-gray-500 font-bold hover:text-orange-500 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Return to Sign In
            </Link>
          </div>
        </div>
      </motion.div>

      <OTPModal
        email={email}
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        onVerify={(otp) => {
      
          toast.success("OTP verified!");
          setIsOTPModalOpen(false);
          navigate("/reset-password", { state: { email, otp } });
        }}
      />
    </div>
  );
}
