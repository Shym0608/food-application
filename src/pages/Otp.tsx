import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

export default function OtpPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { dispatch } = useApp();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("otp");
    setCountdown(30);
    toast.success("OTP sent successfully!");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    dispatch({
      type: "LOGIN",
      payload: {
        id: "1",
        name: "User",
        email: "",
        phone,
        addresses: [],
        role: "user",
      },
    });
    toast.success("Login successful!");
    navigate("/home");
  };

  return (
    <div className="fixed inset-0 bg-[#fdfdfd] flex items-center justify-center p-4 overflow-hidden font-jakarta">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-50/80 rounded-full blur-[120px] z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[480px] bg-white/40 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-orange-500 rounded-[2rem] flex items-center justify-center shadow-lg shadow-orange-200">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  {step === "phone" ? (
                    <Smartphone className="w-10 h-10 text-white" />
                  ) : (
                    <ShieldCheck className="w-10 h-10 text-white" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <header className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">
              {step === "phone" ? "OTP Login" : "Verify Code"}
            </h2>
            <p className="text-gray-500 text-base font-medium leading-relaxed">
              {step === "phone"
                ? "Enter your phone number to receive a secure verification code."
                : `We've sent a 6-digit code to +91 ${phone}`}
            </p>
          </header>

          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.form
                key="phone"
                onSubmit={handleSendOtp}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Phone Number
                  </label>
                  <div className="flex gap-3">
                    <div className="h-14 px-4 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-200 flex items-center text-gray-900 font-bold shadow-sm">
                      +91
                    </div>
                    <Input
                      type="tel"
                      placeholder="Enter number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className="flex-1 h-14 rounded-2xl bg-white/50 backdrop-blur-md border border-gray-200 focus-visible:ring-2 focus-visible:ring-orange-500 transition-all shadow-sm text-base"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-15 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-xl shadow-orange-100 transition-all active:scale-[0.98] relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -25 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        Sending OTP...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -25 }}
                        className="flex items-center gap-2"
                      >
                        Send OTP
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-[14%] h-14 text-center text-xl font-black rounded-xl 
                                 bg-orange-50/50 backdrop-blur-md 
                                 border-2 border-orange-100/50 
                                 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 
                                 outline-none transition-all shadow-inner text-gray-900"
                      maxLength={1}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="w-full h-15 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-xl shadow-orange-100 transition-all active:scale-[0.98] relative overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.span
                          key="verifying"
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -25 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          Verifying...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="btn-text"
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -25 }}
                          className="flex items-center gap-2"
                        >
                          Verify & Login
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-gray-400 font-medium">
                        Resend code in{" "}
                        <span className="text-orange-500 font-bold">
                          {countdown}s
                        </span>
                      </p>
                    ) : (
                      <button
                        onClick={() => {
                          setCountdown(30);
                          toast.success("OTP Resent!");
                        }}
                        className="text-orange-500 font-bold hover:underline transition-all"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
    </div>
  );
}
