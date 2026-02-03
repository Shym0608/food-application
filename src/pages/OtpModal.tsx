import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

interface OTPModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string, newPassword: string) => void;
}

export default function OTPModal({
  email,
  isOpen,
  onClose,
  onVerify,
}: OTPModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/api/auth/reset-password", {
        email,
        otp: enteredOtp,
        newPassword,
      });

      toast.success("Password reset successful 🎉");

      onVerify(enteredOtp, newPassword);
      onClose();

      navigate("/home");
    } catch (error: any) {
      console.error("Reset password error:", error);

      toast.error(error?.response?.data?.message || "OTP not valid");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to resend OTP");

      setOtp(Array(6).fill(""));
      toast.success("New OTP sent to your email 📩");
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white/50 backdrop-blur-2xl rounded-3xl w-full max-w-sm p-8 relative shadow-lg shadow-orange-200"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-orange-500 font-bold text-xl"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Verify OTP
            </h3>

            <p className="text-center text-gray-500 text-sm mb-6">
              Enter the 6-digit OTP sent to{" "}
              <span className="font-semibold">{email}</span>
            </p>

            <div className="flex justify-between gap-2 mb-5">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-bold rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 bg-white/70"
                />
              ))}
            </div>

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 bg-white/70"
            />

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-3 rounded-2xl shadow-md mb-4"
            >
              {isLoading ? "Resetting..." : "Verify & Reset Password"}
            </Button>

            <div className="text-center text-gray-500 text-sm">
              Didn’t receive OTP?{" "}
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-orange-500 font-semibold hover:underline"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
