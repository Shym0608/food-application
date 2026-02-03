import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { Plus } from "lucide-react";
import { Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";
import logo from "@/Logo/logo.jpeg";
import AddDishDialog from "./AddDishDialog";
import api from "@/lib/api";

/* ---------------- IMAGE URL HELPER ---------------- */
const getDishImageUrl = (path: string) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  return path ? `${BASE_URL}${path}?t=${Date.now()}` : "/placeholder.png";
};

const RestaurantDashboard = () => {
  const [dishes, setDishes] = useState<any[]>([]);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [ownerStatus, setOwnerStatus] = useState("pending");
  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();
  const restaurantId = localStorage.getItem("restaurantId");

  /* ---------------- FETCH RESTAURANT + DISHES ---------------- */
  useEffect(() => {
    if (!restaurantId) {
      toast.error("Restaurant not found. Please login again.");
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const { data } = await api.get(`/api/restaurants/${restaurantId}`);

        setOwnerStatus(data.active ? "approved" : "pending");
        setOwnerName(data.name);
        setIsStoreOpen(data.open);

        if (data.active) {
          await fetchDishes();
        }
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [restaurantId]);

  /* ---------------- FETCH DISHES (SOURCE OF TRUTH) ---------------- */
  const fetchDishes = async () => {
    try {
      const { data } = await api.get(`/api/restaurants/${restaurantId}/menu`);

      const formatted = data.map((dish: any) => ({
        ...dish,
        available: dish.available ?? true, // ✅ DEFAULT TRUE
        imageUrl: getDishImageUrl(dish.imageUrl),
      }));

      setDishes(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dishes");
    }
  };

  /* ---------------- CHECK APPROVAL STATUS ---------------- */
  const fetchRestaurantStatus = async (showToast = false) => {
    try {
      showToast ? setRefreshing(true) : setLoading(true);

      const { data } = await api.get(`/api/restaurants/${restaurantId}`);

      setOwnerStatus(data.active ? "approved" : "pending");
      setOwnerName(data.name);
      setIsStoreOpen(data.open);

      if (data.active) {
        await fetchDishes();
        showToast && toast.success("Restaurant approved 🎉");
      } else {
        showToast && toast.info("Still pending approval");
      }
    } catch {
      toast.error("Failed to refresh status");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ---------------- TOGGLE DISH ENABLE/DISABLE ---------------- */
  const toggleDishStatus = async (itemId: string, available: boolean) => {
    try {
      await api.patch(
        `/api/restaurants/${restaurantId}/menu/${itemId}/availability`,
        { available: !available },
      );

      setDishes((prev) =>
        prev.map((dish) =>
          dish.id === itemId ? { ...dish, available: !available } : dish,
        ),
      );

      toast.success(`Dish ${!available ? "enabled 🟢" : "disabled 🔴"}`);
    } catch {
      toast.error("Failed to update dish");
    }
  };

  /* ---------------- TOGGLE STORE ---------------- */
  const toggleStoreOpen = async () => {
    try {
      if (isStoreOpen) {
        await api.patch(`/api/restaurants/${restaurantId}/close`);
      } else {
        await api.patch(`/api/restaurants/${restaurantId}/open`);
      }

      setIsStoreOpen(!isStoreOpen);
      toast.success(`Restaurant is now ${!isStoreOpen ? "OPEN" : "CLOSED"}`);
    } catch {
      toast.error("Failed to update restaurant status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* NAVBAR */}
      <nav className="bg-white border-b px-8 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <img src={logo} alt="logo" className="h-16" />
            <div>
              <h1 className="font-black text-xl">
                Welcome, {ownerName || "Owner"}
              </h1>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-black ${
                  ownerStatus === "approved"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {ownerStatus.toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-50"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {ownerStatus === "pending" ? (
          <div className="h-[70vh] flex items-center justify-center">
            <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
              <AlertCircle size={40} className="mx-auto text-amber-500 mb-4" />
              <h2 className="text-2xl font-black mb-3">
                Restaurant under review
              </h2>
              <p className="text-slate-500 mb-6">
                Your restaurant is awaiting admin approval
              </p>
              <button
                onClick={() => fetchRestaurantStatus(true)}
                disabled={refreshing}
                className="px-6 py-3 bg-black text-white rounded-xl flex gap-2 mx-auto disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Check Status
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* RESTAURANT STATUS */}
            <div className="bg-white p-8 rounded-3xl shadow border flex justify-between mb-10">
              <div className="flex items-center gap-4">
                <Store size={30} />
                <div>
                  <h2 className="text-xl font-black">Restaurant Status</h2>
                  <p className="text-sm text-slate-500">
                    Currently {isStoreOpen ? "Open" : "Closed"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleStoreOpen}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  isStoreOpen
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
              >
                {isStoreOpen ? "OPEN" : "CLOSED"}
              </button>
            </div>

            {/* MENU */}
            <div className="bg-white p-10 rounded-3xl shadow">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-black">Menu Management</h2>
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
                >
                  <Plus size={18} /> Add Dish
                </button>
              </div>

              {dishes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-lg mb-2">
                    No dishes added yet
                  </p>
                  <p className="text-slate-300 text-sm">
                    Start building your menu by adding your first dish
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="border rounded-2xl p-4 hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="h-40 w-full object-cover rounded-xl mb-3"
                      />

                      <h3 className="font-black text-lg">{dish.name}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {dish.description}
                      </p>
                      <div className="mt-3 space-y-1">
                        <p className="font-bold text-lg">₹{dish.price}</p>
                        <p className="text-sm text-slate-600">
                          {dish.category}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-1 text-xs rounded-full font-bold ${
                            dish.veg
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {dish.veg ? "VEG" : "NON-VEG"}
                        </span>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() =>
                            toggleDishStatus(dish.id, dish.available)
                          }
                          className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                            dish.available
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "bg-red-500 text-white hover:bg-red-600"
                          }`}
                          title={
                            dish.available ? "Disable Dish" : "Enable Dish"
                          }
                        >
                          {dish.available ? "Available" : "Unavailable"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <AddDishDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={async () => {
          await fetchDishes(); // 🔥 SINGLE SOURCE OF TRUTH
          setIsAddDialogOpen(false);
        }}
        restaurantId={restaurantId!}
      />
    </div>
  );
};

export default RestaurantDashboard;
