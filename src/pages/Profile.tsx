import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { User } from "lucide-react";
import { Mail } from "lucide-react";
import { Phone } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { LogOut } from "lucide-react";
import { Heart } from "lucide-react";
import { HelpCircle } from "lucide-react";
import { Camera } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { Pencil } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import AddressesModal from "./AddressesModal";
import api from "@/lib/api";

const menuItems = [
  {
    icon: MapPin,
    label: "My Addresses",
    path: "",
    color: "bg-green-50 text-green-500",
  },
  {
    icon: Heart,
    label: "My Favorite Food",
    path: "/favorites",
    color: "bg-red-50 text-red-500",
  },
  {
    icon: Check,
    label: "Past Orders",
    path: "/orders",
    color: "bg-purple-50 text-purple-500",
  },
  {
    icon: ShieldCheck,
    label: "Terms & Conditions",
    path: "/terms",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    path: "/help",
    color: "bg-orange-50 text-orange-500",
  },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useApp();
  const { user } = state;

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [showAddresses, setShowAddresses] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      try {
        const res = await api.get("/api/user/me");
        const userData = res.data;

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: "",
        });

        // Set profile image from backend
        setProfileImage(userData.imageUrl || null);

        dispatch({
          type: "UPDATE_USER",
          payload: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            imageUrl: userData.imageUrl,
            addresses: [],
          },
        });
      } catch (error: any) {
        console.error("Profile fetch failed:", error);
        toast.error(
          "Failed to load profile. Please check your backend or token.",
        );
      }
    };

    fetchProfile();
  }, [dispatch, navigate]);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success("Profile photo selected! Click save to update.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        imageUrl: profileImage || "", // Send base64 or empty string
      };

      const res = await api.put("/api/user/me", payload);

      const updatedUser = res.data;

      setFormData((prev) => ({
        ...prev,
        name: updatedUser.name,
        phone: updatedUser.phone,
        email: updatedUser.email,
      }));

      // Update profile image from response
      if (updatedUser.imageUrl) {
        setProfileImage(updatedUser.imageUrl);
      }

      dispatch({
        type: "UPDATE_USER",
        payload: updatedUser,
      });

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32 font-sans">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-gray-50 rounded-full"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <h1 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
          Account
        </h1>
        <div className="w-9" />
      </div>

      <div className="px-6 mt-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div
                  onClick={handleImageClick}
                  className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      className="w-full h-full object-cover"
                      alt="User"
                    />
                  ) : (
                    <User className="w-10 h-10 text-orange-500" />
                  )}
                </div>
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 bg-orange-500 p-1.5 rounded-full border-2 border-white"
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {formData.name}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">{formData.email}</p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-200"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6 pt-2">
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <InfoItem
                    icon={User}
                    label="Full Name"
                    value={formData.name}
                  />
                  <InfoItem icon={Mail} label="Email" value={formData.email} />
                  <InfoItem icon={Phone} label="Phone" value={formData.phone} />
                </motion.div>
              ) : (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <EditField
                    icon={User}
                    label="Full Name"
                    value={formData.name}
                    onChange={(v) => setFormData({ ...formData, name: v })}
                    disabled={false}
                  />
                  <EditField
                    icon={Mail}
                    label="Email"
                    value={formData.email}
                    onChange={(v) => setFormData({ ...formData, email: v })}
                    disabled={true}
                  />
                  <EditField
                    icon={Phone}
                    label="Phone"
                    value={formData.phone}
                    onChange={(v) => setFormData({ ...formData, phone: v })}
                    disabled={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "My Addresses") setShowAddresses(true);
                else navigate(item.path);
              }}
              className="w-full flex items-center justify-between p-4 bg-white rounded-3xl border border-gray-100 group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-800">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="flex justify-center w-full mt-10">
          <button
            onClick={handleLogout}
            className="w-full max-w-[280px] h-16 rounded-[1.5rem] bg-white text-black border border-gray-100 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 shadow-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 group"
          >
            <LogOut className="w-4 h-4 transition-colors group-hover:text-white" />
            Logout Account
          </button>
        </div>
      </div>

      {showAddresses && (
        <AddressesModal close={() => setShowAddresses(false)} />
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-orange-600" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400">{label}</p>
        <p className="text-base font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function EditField({ icon: Icon, label, value, onChange, disabled }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-orange-600" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1 ml-1">
          {label}
        </p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-900 outline-none transition-all ${
            disabled
              ? "cursor-not-allowed bg-gray-50 text-gray-500"
              : "focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
          }`}
        />
      </div>
    </div>
  );
}
