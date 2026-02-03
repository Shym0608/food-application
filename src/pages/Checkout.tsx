import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { X } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { CreditCard } from "lucide-react";
import { Smartphone } from "lucide-react";
import { Banknote } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddressesModal from "./AddressesModal";
import { PaymentService } from "@/Payment.service";

const paymentMethods = [
  {
    id: "upi",
    name: "UPI",
    icon: Smartphone,
    description: "GPay, PhonePe, Paytm",
  },
  {
    id: "card",
    name: "Cards",
    icon: CreditCard,
    description: "Visa, Mastercard, RuPay",
  },
  { id: "cod", name: "Cash", icon: Banknote, description: "Pay on delivery" },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state, cartTotal } = useApp();
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showUpiQR, setShowUpiQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const { cart, selectedAddress } = state;
  const deliveryFee = 40;
  const taxes = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + taxes;

  const YOUR_UPI_ID = "yourname@okicici";
  const YOUR_NAME = "Your Store Name";

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Select a delivery address first");
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare payload with real restaurantId & items
      const payload = {
        restaurantId: cart[0]?.restaurantId, // from cart
        items: cart.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
        paymentMethod: selectedPayment.toUpperCase() as "COD" | "UPI" | "CARD",
        deliveryAddress: selectedAddress.address,
      };

      // 1️⃣ Create order in backend
      const order = await PaymentService.createOrder(payload);
      setOrderId(order.orderId);

      // 2️⃣ Handle payment method
      if (selectedPayment === "UPI") {
        setShowUpiQR(true);
      } else if (selectedPayment === "card") {
        // Create Stripe session and redirect
        const session = await PaymentService.createStripeSession(order.orderId);
        window.location.href = session.sessionUrl;
      } else {
        toast.success("Order placed via Cash on Delivery!");
        navigate(`/payment-success?orderId=${order.orderId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  const upiLink = `upi://pay?pa=${YOUR_UPI_ID}&pn=${encodeURIComponent(YOUR_NAME)}&am=${grandTotal}&cu=INR`;

  return (
    <div className="min-h-screen bg-slate-50 pb-40">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-xl px-6 h-20 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Checkout</h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest">
              {cart?.length || 0} Items • ₹{grandTotal}
            </p>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="px-4 py-6 space-y-6">
        {/* Delivery Address */}
        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Delivery Address</h2>
            <button
              onClick={() => setShowAddressModal(true)}
              className="text-orange-600 font-bold text-sm flex items-center gap-1 hover:text-orange-700"
            >
              <MapPin className="w-4 h-4" />
              {selectedAddress ? "CHANGE" : "SELECT"}
            </button>
          </div>
          {selectedAddress ? (
            <div className="p-4 rounded-xl border-2 border-orange-500 bg-orange-50">
              <p className="text-sm text-slate-700 font-medium">
                {selectedAddress.address}
              </p>
            </div>
          ) : (
            <div
              onClick={() => setShowAddressModal(true)}
              className="p-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center cursor-pointer hover:border-orange-300"
            >
              <p className="text-slate-500 text-sm">Select delivery address</p>
            </div>
          )}
        </section>

        {/* Payment Methods */}
        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Payment Method</h2>
          {paymentMethods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedPayment(m.id)}
              className={`w-full p-4 mb-3 rounded-xl border-2 transition-all ${
                selectedPayment === m.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-slate-200"
              }`}
            >
              <div className="flex gap-3 items-center">
                <div
                  className={`p-2 rounded-lg ${
                    selectedPayment === m.id
                      ? "bg-orange-100 text-orange-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <m.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.description}</p>
                </div>
              </div>
            </button>
          ))}
        </section>

        {/* Bill Details */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            Bill Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Item Total</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Taxes</span>
              <span>₹{taxes}</span>
            </div>
            <div className="h-px bg-slate-100 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-xl font-black">Total</span>
              <span className="text-xl font-black text-orange-600">
                ₹{grandTotal}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* PLACE ORDER FOOTER */}
      <AnimatePresence>
        <motion.footer
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-10 left-4 right-4 z-[60] max-w-md mx-auto"
        >
          <div className="w-full h-24 bg-white/80 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-between px-4 shadow-2xl border border-white">
            <div className="pl-6">
              <span className="text-[10px] font-black uppercase text-slate-500 block">
                To Pay
              </span>
              <span className="text-2xl font-black text-slate-900">
                ₹{grandTotal}
              </span>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="h-14 px-8 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest"
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </motion.footer>
      </AnimatePresence>

      {/* UPI QR MODAL */}
      <AnimatePresence>
        {showUpiQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 text-center relative"
            >
              <button
                onClick={() => setShowUpiQR(false)}
                className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />
              <h2 className="text-2xl font-black mb-1">Pay with UPI</h2>
              <p className="text-slate-500 mb-6 text-sm">
                Scan QR or open your preferred UPI app
              </p>

              <div className="bg-slate-50 p-6 rounded-[2rem] mb-6 inline-block border border-slate-100">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`}
                  alt="UPI QR"
                  className="w-48 h-48 mx-auto mix-blend-multiply"
                />
              </div>

              <div className="space-y-3">
                <a
                  href={upiLink}
                  className="block w-full py-4 bg-orange-500 text-white rounded-2xl font-bold uppercase tracking-wider shadow-lg shadow-orange-200"
                >
                  Open GPay / PhonePe
                </a>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowUpiQR(false);
                    toast.success("Payment confirmed manually!");
                    navigate(
                      `/payment-success?orderId=${cart[0]?.restaurantId}`,
                    );
                  }}
                  className="w-full text-slate-400 text-xs"
                >
                  I have completed the payment
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <AddressesModal close={() => setShowAddressModal(false)} />
      )}
    </div>
  );
}
