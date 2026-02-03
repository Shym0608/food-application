// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate, Link } from "react-router-dom";
// import { Shield } from "lucide-react";
// import { Eye } from "lucide-react";
// import { EyeOff } from "lucide-react";
// import { User } from "lucide-react";
// import { ArrowRight } from "lucide-react";
// import { UtensilsCrossed } from "lucide-react";
// import { Store } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useApp } from "@/contexts/AppContext";
// import { toast } from "sonner";
// import api from "@/lib/api";

// type Role = "user" | "owner" | "admin";

// const initialFormData = {
//   name: "",
//   email: "",
//   phone: "",
//   password: "",
//   restaurantName: "",
//   description: "",
//   cuisine: "",
//   basePrice: "",
//   categories: [] as string[],
//   street: "",
//   city: "",
//   state: "",
//   pincode: "",
// };

// export default function SignupPage() {
//   const [role, setRole] = useState<Role>("user");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [categoryInput, setCategoryInput] = useState("");
//   const [restaurantImage, setRestaurantImage] = useState(null);
//   const [formData, setFormData] = useState(initialFormData);

//   const navigate = useNavigate();
//   const { dispatch } = useApp();

//   const nameRegex = /^[A-Za-z\s]+$/;
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const phoneRegex = /^[0-9]{6,15}$/;
//   const pincodeRegex = /^[0-9]{6}$/;

//   /* ================= HELPERS ================= */
//   const updateField = (field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const resetFormByRole = () => {
//     setFormData(initialFormData);
//     setCategoryInput("");
//     setRestaurantImage(null);
//   };

//   const toBase64 = (file: File): Promise<string> =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = reject;
//     });

//   /* ================= SIGNUP ================= */
//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name.trim()) {
//       toast.error("Name is required");
//       return;
//     }

//     if (!nameRegex.test(formData.name)) {
//       toast.error("Name should contain only letters");
//       return;
//     }

//     if (!emailRegex.test(formData.email)) {
//       toast.error("Please enter a valid email");
//       return;
//     }

//     if (formData.password.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }

//     if (role !== "admin") {
//       if (!phoneRegex.test(formData.phone)) {
//         toast.error("Phone number must be between 6 and 15 digits");
//         return;
//       }
//     }

//     if (role === "owner") {
//       if (!pincodeRegex.test(formData.pincode)) {
//         toast.error("Pincode must be 6 digits");
//         return;
//       }

//       if (!restaurantImage) {
//         toast.error("Please upload restaurant image");
//         return;
//       }
//     }

//     setIsLoading(true);

//     try {
//       let formDataPayload: any;
//       let headers: any = {};

//       if (role === "owner") {
//         // For owner registration - use FormData (multipart)
//         formDataPayload = new FormData();

//         // Admin fields
//         formDataPayload.append("name", formData.name);
//         formDataPayload.append("email", formData.email);
//         formDataPayload.append("password", formData.password);
//         formDataPayload.append("phone", formData.phone);

//         // 🔑 IMAGE (VERY IMPORTANT)
//         formDataPayload.append("image", restaurantImage);

//         // Restaurant fields (dot notation)
//         formDataPayload.append("restaurant.name", formData.restaurantName);
//         formDataPayload.append("restaurant.description", formData.description);
//         formDataPayload.append("restaurant.cuisine", formData.cuisine);
//         formDataPayload.append(
//           "restaurant.basePrice",
//           String(formData.basePrice),
//         );
//         formDataPayload.append("restaurant.phone", formData.phone);

//         // Categories
//         formData.categories.forEach((cat, index) => {
//           formDataPayload.append(`restaurant.categories[${index}]`, cat);
//         });

//         // Address
//         formDataPayload.append("restaurant.address.street", formData.street);
//         formDataPayload.append("restaurant.address.city", formData.city);
//         formDataPayload.append("restaurant.address.state", formData.state);
//         formDataPayload.append("restaurant.address.pincode", formData.pincode);

//         headers["Content-Type"] = "multipart/form-data";
//       } else {
//         // For regular user/admin registration - use JSON
//         formDataPayload = {
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//           phone: formData.phone,
//         };

//         headers["Content-Type"] = "application/json";
//       }

//       const endpoint =
//         role === "owner"
//           ? "/api/restaurants/register-restaurant-admin"
//           : "/api/auth/register";

//       await api.post(endpoint, formDataPayload, { headers });

//       toast.success("Account created successfully!");
//       navigate("/login");
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Signup failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="h-screen w-screen bg-slate-50 flex items-center justify-center p-4">
//       <div className="flex w-full max-w-[1000px] h-[650px] bg-white rounded-[2.5rem] shadow-lg overflow-hidden">
//         {/* LEFT */}
//         <div className="w-[55%] p-12 overflow-y-auto">
//           <h2 className="text-4xl font-black">Create Account</h2>
//           <p className="text-slate-400 mb-6">Choose role & sign up</p>

//           {/* ROLE SWITCH */}
//           <div className="flex gap-2 mb-6">
//             {[
//               { key: "user", icon: User },
//               { key: "owner", icon: Store },
//               { key: "admin", icon: Shield },
//             ].map(({ key, icon: Icon }) => (
//               <button
//                 key={key}
//                 type="button"
//                 onClick={() => {
//                   setRole(key as Role);
//                   resetFormByRole();
//                 }}
//                 className={`flex-1 py-3 rounded-xl font-bold flex justify-center gap-2 ${
//                   role === key ? "bg-[#FF7A1A] text-white" : "bg-slate-100"
//                 }`}
//               >
//                 <Icon size={16} /> {key}
//               </button>
//             ))}
//           </div>

//           <form onSubmit={handleSignup} className="space-y-3">
//             <Input
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 if (value === "" || nameRegex.test(value)) {
//                   updateField("name", value);
//                 }
//               }}
//             />

//             {/* OWNER FIELDS */}
//             <AnimatePresence>
//               {role === "owner" && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="space-y-3"
//                 >
//                   <Input
//                     placeholder="Restaurant Name"
//                     value={formData.restaurantName}
//                     onChange={(e) =>
//                       updateField("restaurantName", e.target.value)
//                     }
//                   />

//                   <Input
//                     placeholder="Description"
//                     value={formData.description}
//                     onChange={(e) => updateField("description", e.target.value)}
//                   />

//                   <Input
//                     placeholder="Cuisine"
//                     value={formData.cuisine}
//                     onChange={(e) => updateField("cuisine", e.target.value)}
//                   />
//                   <Input
//                     placeholder="Base Price"
//                     value={formData.basePrice}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, "");
//                       updateField("basePrice", value);
//                     }}
//                   />

//                   {/* CATEGORIES */}
//                   <div className="flex gap-2">
//                     <Input
//                       placeholder="Add category"
//                       value={categoryInput}
//                       onChange={(e) => setCategoryInput(e.target.value)}
//                     />
//                     <Button
//                       type="button"
//                       onClick={() => {
//                         if (!categoryInput.trim()) return;
//                         setFormData((prev) => ({
//                           ...prev,
//                           categories: [...prev.categories, categoryInput],
//                         }));
//                         setCategoryInput("");
//                       }}
//                     >
//                       Add
//                     </Button>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     {formData.categories.map((cat, i) => (
//                       <span
//                         key={i}
//                         onClick={() =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             categories: prev.categories.filter(
//                               (_, idx) => idx !== i,
//                             ),
//                           }))
//                         }
//                         className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm cursor-pointer"
//                       >
//                         {cat} ✕
//                       </span>
//                     ))}
//                   </div>

//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) =>
//                       e.target.files && setRestaurantImage(e.target.files[0])
//                     }
//                   />

//                   <Input
//                     placeholder="Street"
//                     value={formData.street}
//                     onChange={(e) => updateField("street", e.target.value)}
//                   />
//                   <Input
//                     placeholder="City"
//                     value={formData.city}
//                     onChange={(e) => updateField("city", e.target.value)}
//                   />
//                   <Input
//                     placeholder="State"
//                     value={formData.state}
//                     onChange={(e) => updateField("state", e.target.value)}
//                   />
//                   <Input
//                     placeholder="Pincode"
//                     value={formData.pincode}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, "");
//                       if (value.length <= 6) {
//                         updateField("pincode", value);
//                       }
//                     }}
//                   />
//                 </motion.div>
//               )}
//             </AnimatePresence>
//             <Input
//               placeholder="Email"
//               value={formData.email}
//               onChange={(e) => updateField("email", e.target.value)}
//             />

//             <Input
//               placeholder="Phone"
//               value={formData.phone}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/\D/g, "");
//                 if (value.length <= 15) {
//                   updateField("phone", value);
//                 }
//               }}
//             />

//             <div className="relative">
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={(e) => updateField("password", e.target.value)}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2"
//               >
//                 {showPassword ? <EyeOff /> : <Eye />}
//               </button>
//             </div>

//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-[#FF7A1A] text-white"
//             >
//               {isLoading ? "Creating..." : "Create Account"}
//               <ArrowRight className="ml-2 w-4 h-4" />
//             </Button>
//           </form>

//           <p className="text-center mt-4">
//             Already have an account?{" "}
//             <Link to="/login" className="text-[#FF7A1A] font-bold">
//               Sign In
//             </Link>
//           </p>
//         </div>

//         {/* RIGHT */}
//         <div className="relative hidden lg:flex lg:w-[45%] min-h-[600px] overflow-hidden">
//           <img
//             src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
//             className="absolute inset-0 object-cover w-full h-full"
//           />
//           <div className="relative z-10 w-full flex flex-col items-center justify-center text-white p-12 text-center">
//             <div className="bg-white/20 backdrop-blur-xl p-5 rounded-[2rem] mb-4 border border-white/30">
//               <UtensilsCrossed className="w-12 h-12" />
//             </div>
//             <h1 className="text-6xl font-black mb-6">
//               Good <span className="italic font-light">Food,</span>
//               <br />
//               <span className="text-orange-400">Great Mood!</span>
//             </h1>
//             <p className="text-white/90 mt-4 text-lg">
//               Explore flavors that make every bite unforgettable
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { User } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { UtensilsCrossed } from "lucide-react";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import api from "@/lib/api";

type Role = "user" | "owner";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  restaurantName: "",
  description: "",
  cuisine: "",
  basePrice: "",
  categories: [] as string[],
  street: "",
  city: "",
  state: "",
  pincode: "",
};

export default function SignupPage() {
  const [role, setRole] = useState<Role>("user");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [categoryInput, setCategoryInput] = useState("");
  const [restaurantImage, setRestaurantImage] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const navigate = useNavigate();
  const { dispatch } = useApp();

  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{6,15}$/;
  const pincodeRegex = /^[0-9]{6}$/;

  /* ================= HELPERS ================= */
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetFormByRole = () => {
    setFormData(initialFormData);
    setCategoryInput("");
    setRestaurantImage(null);
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  /* ================= SIGNUP ================= */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!nameRegex.test(formData.name)) {
      toast.error("Name should contain only letters");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be between 6 and 15 digits");
      return;
    }

    if (role === "owner") {
      if (!pincodeRegex.test(formData.pincode)) {
        toast.error("Pincode must be 6 digits");
        return;
      }

      if (!restaurantImage) {
        toast.error("Please upload restaurant image");
        return;
      }
    }

    setIsLoading(true);

    try {
      let formDataPayload: any;
      let headers: any = {};

      if (role === "owner") {
        // For owner registration - use FormData (multipart)
        formDataPayload = new FormData();

        // Admin fields
        formDataPayload.append("name", formData.name);
        formDataPayload.append("email", formData.email);
        formDataPayload.append("password", formData.password);
        formDataPayload.append("phone", formData.phone);

        // 🔑 IMAGE (VERY IMPORTANT)
        formDataPayload.append("image", restaurantImage);

        // Restaurant fields (dot notation)
        formDataPayload.append("restaurant.name", formData.restaurantName);
        formDataPayload.append("restaurant.description", formData.description);
        formDataPayload.append("restaurant.cuisine", formData.cuisine);
        formDataPayload.append(
          "restaurant.basePrice",
          String(formData.basePrice),
        );
        formDataPayload.append("restaurant.phone", formData.phone);

        // Categories
        formData.categories.forEach((cat, index) => {
          formDataPayload.append(`restaurant.categories[${index}]`, cat);
        });

        // Address
        formDataPayload.append("restaurant.address.street", formData.street);
        formDataPayload.append("restaurant.address.city", formData.city);
        formDataPayload.append("restaurant.address.state", formData.state);
        formDataPayload.append("restaurant.address.pincode", formData.pincode);

        headers["Content-Type"] = "multipart/form-data";
      } else {
        // For regular user registration - use JSON
        formDataPayload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        };

        headers["Content-Type"] = "application/json";
      }

      const endpoint =
        role === "owner"
          ? "/api/restaurants/register-restaurant-admin"
          : "/api/auth/register";

      await api.post(endpoint, formDataPayload, { headers });

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-[1000px] h-[650px] bg-white rounded-[2.5rem] shadow-lg overflow-hidden">
        {/* LEFT */}
        <div className="w-[55%] p-12 overflow-y-auto">
          <h2 className="text-4xl font-black">Create Account</h2>
          <p className="text-slate-400 mb-6">Choose role & sign up</p>

          {/* ROLE SWITCH */}
          <div className="flex gap-2 mb-6">
            {[
              { key: "user", icon: User, label: "Customer" },
              { key: "owner", icon: Store, label: "Restaurant" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setRole(key as Role);
                  resetFormByRole();
                }}
                className={`flex-1 py-3 rounded-xl font-bold flex justify-center gap-2 ${
                  role === key ? "bg-[#FF7A1A] text-white" : "bg-slate-100"
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSignup} className="space-y-3">
            <Input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || nameRegex.test(value)) {
                  updateField("name", value);
                }
              }}
            />

            {/* OWNER FIELDS */}
            <AnimatePresence>
              {role === "owner" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <Input
                    placeholder="Restaurant Name"
                    value={formData.restaurantName}
                    onChange={(e) =>
                      updateField("restaurantName", e.target.value)
                    }
                  />

                  <Input
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />

                  <Input
                    placeholder="Cuisine"
                    value={formData.cuisine}
                    onChange={(e) => updateField("cuisine", e.target.value)}
                  />
                  <Input
                    placeholder="Base Price"
                    value={formData.basePrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      updateField("basePrice", value);
                    }}
                  />

                  {/* CATEGORIES */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add category"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (!categoryInput.trim()) return;
                        setFormData((prev) => ({
                          ...prev,
                          categories: [...prev.categories, categoryInput],
                        }));
                        setCategoryInput("");
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((cat, i) => (
                      <span
                        key={i}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            categories: prev.categories.filter(
                              (_, idx) => idx !== i,
                            ),
                          }))
                        }
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm cursor-pointer"
                      >
                        {cat} ✕
                      </span>
                    ))}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && setRestaurantImage(e.target.files[0])
                    }
                  />

                  <Input
                    placeholder="Street"
                    value={formData.street}
                    onChange={(e) => updateField("street", e.target.value)}
                  />
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                  <Input
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                  />
                  <Input
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) {
                        updateField("pincode", value);
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Input
              placeholder="Email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />

            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 15) {
                  updateField("phone", value);
                }
              }}
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF7A1A] text-white"
            >
              {isLoading ? "Creating..." : "Create Account"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FF7A1A] font-bold">
              Sign In
            </Link>
          </p>
        </div>

        {/* RIGHT */}
        <div className="relative hidden lg:flex lg:w-[45%] min-h-[600px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-white p-12 text-center">
            <div className="bg-white/20 backdrop-blur-xl p-5 rounded-[2rem] mb-4 border border-white/30">
              <UtensilsCrossed className="w-12 h-12" />
            </div>
            <h1 className="text-6xl font-black mb-6">
              Good <span className="italic font-light">Food,</span>
              <br />
              <span className="text-orange-400">Great Mood!</span>
            </h1>
            <p className="text-white/90 mt-4 text-lg">
              Explore flavors that make every bite unforgettable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
