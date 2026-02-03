import { Star } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { Phone } from "lucide-react";
import { MapPin } from "lucide-react";
import { ShoppingBag } from "lucide-react";

export default function OrderTracking() {
  const steps = [
    { title: "Confirmed", done: true },
    { title: "Cooking", done: true },
    { title: "On the way", done: true, active: true },
    { title: "Arrived", done: false },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
        <div className="p-8 pb-4 flex items-center justify-between">
          <button
            onClick={() => (window.location.href = "/home")}
            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Estimated Time
            </p>
            <p className="text-xl font-black text-orange-500">12:55 PM</p>
          </div>
        </div>

        <div className="px-8 pt-4">
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Track Order
          </h1>
          <p className="text-slate-500 text-sm">
            Order ID: <span className="font-bold text-slate-800">#F-9921</span>
          </p>
        </div>

        <div className="px-8 py-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 z-0" />

            {steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full border-4 ${
                    step.active
                      ? "bg-orange-500 border-orange-100 scale-125 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                      : step.done
                      ? "bg-orange-500 border-white"
                      : "bg-slate-200 border-white"
                  }`}
                />
                <span
                  className={`text-[10px] mt-3 font-bold uppercase tracking-tighter ${
                    step.active ? "text-orange-500" : "text-slate-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-6 p-6 bg-slate-50 rounded-[32px] mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <ShoppingBag size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                Your Order
              </p>
              <p className="text-sm font-bold">
                2x Double Patty Burger, 1x Coke
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <MapPin size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                Deliver to
              </p>
              <p className="text-sm font-bold">Apt 4B, Sunset Boulevard</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8">
          <div className="bg-white border border-slate-100 rounded-[32px] p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
                  alt="Rider"
                  className="w-14 h-14 rounded-2xl bg-slate-100 object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  Your Rider
                </p>
                <p className="font-bold text-slate-900">Amit Patel</p>
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-orange-400 text-orange-400" />
                  <span className="text-xs font-bold text-slate-700">4.9</span>
                </div>
              </div>
            </div>
            <a
              href="tel:9876543210"
              className="w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-orange-200"
            >
              <Phone size={22} fill="currentColor" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
