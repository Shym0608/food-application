import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { X } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Utensils } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface AddDishDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (dish: any) => void;
  restaurantId: string;
}

const AddDishDialog = ({
  open,
  onClose,
  onAdd,
  restaurantId,
}: AddDishDialogProps) => {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const [dish, setDish] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    veg: null as boolean | null,
  });
  const NAME_REGEX = /^[A-Za-z\s]*$/;
  const PRICE_REGEX = /^\d*$/;

  if (!open) return null;

  const isFormValid =
    dish.name.trim() &&
    dish.price &&
    dish.description.trim() &&
    imageFile &&
    dish.category !== "" &&
    dish.veg !== null;

  /* ---------------- IMAGE ---------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the actual file for upload
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- HANDLERS ---------------- */
  const handleCategoryChange = (category: string) => {
    setDish({ ...dish, category: dish.category === category ? "" : category });
  };

  const handleVegChange = (isVeg: boolean) => {
    setDish({ ...dish, veg: dish.veg === isVeg ? null : isVeg });
  };

  const handleAdd = async () => {
    if (!isFormValid) {
      setError("Please fill all fields and upload a dish photo.");
      return;
    }

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("name", dish.name);
      formData.append("price", dish.price);
      formData.append("category", dish.category);
      formData.append("description", dish.description);
      formData.append("veg", String(dish.veg));
      formData.append("imageUrl", imageFile);
      formData.append("restaurantId", restaurantId);

      await api.post(`/api/restaurants/${restaurantId}/menu`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Dish added successfully!");

      // Add dish to UI with temporary ID
      onAdd({
        name: dish.name,
        price: Number(dish.price),
        category: dish.category,
        description: dish.description,
        veg: dish.veg,
        id: Date.now(),
        available: true,
        enabled: true,
        imageUrl: imagePreview, // Use preview temporarily until refresh
      });

      handleReset();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add dish.");
    }
  };

  const handleReset = () => {
    setDish({
      name: "",
      price: "",
      category: "",
      description: "",
      veg: null,
    });
    setImagePreview(null);
    setImageFile(null);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleReset}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* ---------------- HEADER ---------------- */}
        <div className="px-4 py-3 border-b bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-500 text-white rounded-lg">
              <Utensils size={16} />
            </div>
            <h2 className="text-lg font-black text-slate-800">Add Dish</h2>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-slate-200 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        {/* ---------------- BODY ---------------- */}
        <div className="p-4 space-y-3">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-2 rounded-lg border border-red-100">
              <AlertCircle size={14} />
              <span className="text-[10px] font-bold uppercase">{error}</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* IMAGE UPLOAD */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-56 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer overflow-hidden
    ${
      imageFile
        ? "border-emerald-500 bg-emerald-50"
        : "border-slate-200 hover:border-orange-400 bg-slate-50"
    }`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Dish"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <UploadCloud className="mx-auto text-slate-400" size={22} />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Select Dish Photo *
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Dish Name *
              </label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold focus:border-orange-500 outline-none"
                placeholder="Butter Paneer"
                value={dish.name}
                onChange={(e) => {
                  const value = e.target.value;

                  if (!NAME_REGEX.test(value)) {
                    setError("Dish name should contain only letters");
                    return;
                  }

                  if (value.length > 15) {
                    setError("Dish name max length is 15 characters");
                    return;
                  }

                  setError("");
                  setDish({ ...dish, name: value });
                }}
              />
            </div>

            <div className="w-[110px] space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ₹
                </span>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-6 pr-3 py-2.5 text-sm font-bold focus:border-orange-500 outline-none"
                  placeholder="0"
                  value={dish.price}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!PRICE_REGEX.test(value)) {
                      setError("Price should contain only numbers");
                      return;
                    }

                    if (value.length > 6) {
                      setError("Price maximum 6 digits allowed");
                      return;
                    }

                    setError("");
                    setDish({ ...dish, price: value });
                  }}
                />
              </div>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Category *
            </label>
            <div className="flex gap-2">
              {["Starter", "Main Course", "Dessert"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition
                    ${
                      dish.category === cat
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-300"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FOOD TYPE */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Food Type *
            </label>
            <div className="flex gap-3">
              {[
                { label: "Veg", value: true },
                { label: "Non-Veg", value: false },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleVegChange(item.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition
                    ${
                      dish.veg === item.value
                        ? item.value
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-red-600 text-white border-red-600"
                        : "bg-white text-slate-600 border-slate-300"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Description *
            </label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none h-16 focus:border-orange-500 outline-none"
              placeholder="Describe taste and ingredients..."
              value={dish.description}
              onChange={(e) =>
                setDish({ ...dish, description: e.target.value })
              }
            />
          </div>
        </div>

        {/* ---------------- FOOTER ---------------- */}
        <div className="px-4 py-3 bg-slate-50 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!isFormValid}
            className={`flex-[2] flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition
              ${
                isFormValid
                  ? "bg-slate-900 text-white hover:bg-orange-600"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
          >
            <PlusCircle size={14} />
            Publish Dish
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDishDialog;
