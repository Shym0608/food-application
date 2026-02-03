import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { BottomNav } from "@/components/layout/BottomNav";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

import RestaurantAdmin from "./pages/RestaurantAdmin";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import OrderTracking from "./pages/OrderTracking";
import TermsAndConditions from "./pages/TermsAndConditions";
import HelpAndSupport from "./pages/HelpAndSupport";
import PaymentSuccess from "./pages/Paymentsuccess";
import PaymentFailed from "./pages/Paymentfailed";
import FavoritesPage from "./pages/FavoritesPage";

const queryClient = new QueryClient();

const AppWrapper = () => {
  const location = useLocation();

  const hideBottomNav = [
    "/login",
    "/signup",
    "/otp",
    "/forgot-password",
    "/admin/dashboard",
    "/owner/dashboard",
    "/checkout",
    "/payment",
    "/order-tracking",
    "/terms",
    "/help",
    "/payment-success",
    " /payment-failed",
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background relative">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/home" element={<Home />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/dashboard" element={<RestaurantAdmin />} />
        <Route path="/owner/dashboard" element={<RestaurantDashboard />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/help" element={<HelpAndSupport />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/favorites" element={<FavoritesPage />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="bottom-right" />
        <BrowserRouter>
          <AppWrapper />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
