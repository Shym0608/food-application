// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate, Link } from "react-router-dom";
// import { User } from "lucide-react";
// import { Eye } from "lucide-react";
// import { EyeOff } from "lucide-react";
// import { UtensilsCrossed } from "lucide-react";
// import { Store } from "lucide-react";
// import { Shield } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useApp } from "@/contexts/AppContext";
// import { toast } from "sonner";
// import api from "@/lib/api";

// type Role = "user" | "owner" | "admin";

// interface LoginForm {
//   email: string;
//   password: string;
// }

// type LoginFormData = {
//   user: LoginForm;
//   owner: LoginForm;
//   admin: LoginForm;
// };

// const mapBackendRoleToFrontend = (role: string): Role => {
//   switch (role) {
//     case "USER":
//       return "user";
//     case "RESTAURANT_ADMIN":
//       return "owner";
//     case "ADMIN":
//       return "admin";
//     default:
//       throw new Error("Unknown backend role: " + role);
//   }
// };

// export default function LoginPage() {
//   const [role, setRole] = useState<Role>("user");
//   const [formData, setFormData] = useState<LoginFormData>({
//     user: { email: "", password: "" },
//     owner: { email: "", password: "" },
//     admin: { email: "", password: "" },
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();
//   const { dispatch } = useApp();

//   const updateField = (field: keyof LoginForm, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [role]: {
//         ...prev[role],
//         [field]: value,
//       },
//     }));
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const currentData = formData[role];

//     if (!currentData.email || !currentData.password) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const loginRes = await api.post("/api/auth/login", {
//         email: currentData.email,
//         password: currentData.password,
//         role,
//       });

//       const token = loginRes.data.token || loginRes.data.data?.token;
//       if (!token) throw new Error("Token missing in login response");

//       localStorage.setItem("token", token);

//       const userRes = await api.get("/api/user/me");
//       const userData = userRes.data;

//       const frontendRole: Role = mapBackendRoleToFrontend(userData.role);

//       // Store owner name for dashboard
//       if (userData.name) {
//         localStorage.setItem("ownerName", userData.name);
//       }

//       if (frontendRole === "owner") {
//         // Try to get restaurant ID from user data
//         const restaurantId =
//           userData.restaurantId ||
//           userData.restaurant_id ||
//           userData.restaurant?.id ||
//           userData.id; // Sometimes the user ID itself is the restaurant owner ID

//         if (restaurantId) {
//           localStorage.setItem("restaurantId", restaurantId.toString());

//         } else {
//           console.warn("No restaurant ID found in user data");
//           toast.warning(
//             "Restaurant information not found. Please contact support."
//           );
//         }
//       }

//       dispatch({
//         type: "LOGIN",
//         payload: {
//           id: userData.id,
//           name: userData.name,
//           email: userData.email,
//           phone: userData.phone ?? "",
//           role: frontendRole,
//           addresses: [],
//         },
//       });

//       toast.success(`Welcome back, ${userData.name}!`);

//       if (frontendRole === "admin") navigate("/admin/dashboard");
//       else if (frontendRole === "owner") navigate("/owner/dashboard");
//       else navigate("/home");
//     } catch (error: any) {
//       console.error("Login error:", error);
//       toast.error(
//         error?.response?.data?.message || "Invalid email or password"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
//       <div className="relative w-full max-w-[1100px] bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row overflow-hidden my-8">
//         <div className="relative hidden lg:flex lg:w-[45%] min-h-[600px] overflow-hidden">
//           <img
//             src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop"
//             className="absolute inset-0 object-cover w-full h-full"
//           />
//           <div className="relative z-10 w-full flex flex-col items-center justify-center text-white p-12 text-center">
//             <div className="bg-white/20 backdrop-blur-xl p-5 rounded-[2rem] mb-4 border border-white/30">
//               <UtensilsCrossed className="w-12 h-12" />
//             </div>
//             <h1 className="text-6xl font-black mb-4">
//               Hungry? <span className="italic font-light">Let's</span>
//               <br />
//               <span className="text-orange-400">Eat!</span>
//             </h1>
//             <p className="text-white/90 mt-2 text-lg">
//               Discover flavors, explore dishes, and enjoy every bite
//             </p>
//           </div>
//         </div>

//         <div className="flex-1 flex items-center justify-center p-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="w-full max-w-sm space-y-8"
//           >
//             <header>
//               <h2 className="text-4xl font-black">Welcome Back</h2>
//               <p className="text-gray-500 mt-2">Sign in to continue</p>
//             </header>

//             <div className="grid grid-cols-3 gap-2">
//               {[
//                 { key: "user", icon: User },
//                 { key: "owner", icon: Store },
//                 { key: "admin", icon: Shield },
//               ].map(({ key, icon: Icon }) => (
//                 <button
//                   key={key}
//                   type="button"
//                   onClick={() => setRole(key as Role)}
//                   className={`h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition ${
//                     role === key
//                       ? "bg-orange-500 text-white"
//                       : "bg-gray-100 text-gray-500"
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   {key}
//                 </button>
//               ))}
//             </div>

//             <form onSubmit={handleLogin} className="space-y-6">
//               <Input
//                 placeholder="Email"
//                 className="h-12 bg-slate-50 border-none rounded-xl px-5"
//                 value={formData[role].email}
//                 onChange={(e) => updateField("email", e.target.value)}
//               />
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   className="h-12 bg-slate-50 border-none rounded-xl px-5 pr-12"
//                   value={formData[role].password}
//                   onChange={(e) => updateField("password", e.target.value)}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//               <div className="text-right">
//                 <Link
//                   to="/forgot-password"
//                   className="text-sm text-orange-500 font-semibold hover:underline"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full h-14 rounded-2xl bg-orange-500 text-white font-bold"
//               >
//                 {isLoading ? "Signing in..." : "Sign In"}
//               </Button>
//             </form>

//             <p className="text-center text-gray-500">
//               Don't have an account?{" "}
//               <Link to="/signup" className="text-orange-500 font-bold">
//                 Sign Up
//               </Link>
//             </p>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { User } from "lucide-react";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { UtensilsCrossed } from "lucide-react";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import api from "@/lib/api";

type Role = "user" | "owner";
type BackendRole = "user" | "owner" | "admin";

interface LoginForm {
  email: string;
  password: string;
}

type LoginFormData = {
  user: LoginForm;
  owner: LoginForm;
};

const mapBackendRoleToFrontend = (role: string): BackendRole => {
  switch (role) {
    case "USER":
      return "user";
    case "RESTAURANT_ADMIN":
      return "owner";
    case "ADMIN":
      return "admin";
    default:
      throw new Error("Unknown backend role: " + role);
  }
};

export default function LoginPage() {
  const [role, setRole] = useState<Role>("user");
  const [formData, setFormData] = useState<LoginFormData>({
    user: { email: "", password: "" },
    owner: { email: "", password: "" },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { dispatch } = useApp();

  const updateField = (field: keyof LoginForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value,
      },
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentData = formData[role];

    if (!currentData.email || !currentData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const loginRes = await api.post("/api/auth/login", {
        email: currentData.email,
        password: currentData.password,
        role,
      });

      const token = loginRes.data.token || loginRes.data.data?.token;
      if (!token) throw new Error("Token missing in login response");

      localStorage.setItem("token", token);

      const userRes = await api.get("/api/user/me");
      const userData = userRes.data;

      const frontendRole: BackendRole = mapBackendRoleToFrontend(userData.role);

      // Store owner name for dashboard
      if (userData.name) {
        localStorage.setItem("ownerName", userData.name);
      }

      if (frontendRole === "owner") {
        // Try to get restaurant ID from user data
        const restaurantId =
          userData.restaurantId ||
          userData.restaurant_id ||
          userData.restaurant?.id ||
          userData.id; // Sometimes the user ID itself is the restaurant owner ID

        if (restaurantId) {
          localStorage.setItem("restaurantId", restaurantId.toString());
        } else {
          console.warn("No restaurant ID found in user data");
          toast.warning(
            "Restaurant information not found. Please contact support.",
          );
        }
      }

      dispatch({
        type: "LOGIN",
        payload: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone ?? "",
          role: frontendRole,
          addresses: [],
        },
      });

      toast.success(`Welcome back, ${userData.name}!`);

      // Redirect based on backend role (including admin)
      if (frontendRole === "admin") {
        navigate("/admin/dashboard");
      } else if (frontendRole === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error?.response?.data?.message || "Invalid email or password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="relative w-full max-w-[1100px] bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row overflow-hidden my-8">
        <div className="relative hidden lg:flex lg:w-[45%] min-h-[600px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop"
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-white p-12 text-center">
            <div className="bg-white/20 backdrop-blur-xl p-5 rounded-[2rem] mb-4 border border-white/30">
              <UtensilsCrossed className="w-12 h-12" />
            </div>
            <h1 className="text-6xl font-black mb-4">
              Hungry? <span className="italic font-light">Let's</span>
              <br />
              <span className="text-orange-400">Eat!</span>
            </h1>
            <p className="text-white/90 mt-2 text-lg">
              Discover flavors, explore dishes, and enjoy every bite
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-8"
          >
            <header>
              <h2 className="text-4xl font-black">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Sign in to continue</p>
            </header>

            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "user", icon: User, label: "Customer" },
                { key: "owner", icon: Store, label: "Restaurant" },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key as Role)}
                  className={`h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition ${
                    role === key
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                placeholder="Email"
                className="h-12 bg-slate-50 border-none rounded-xl px-5"
                value={formData[role].email}
                onChange={(e) => updateField("email", e.target.value)}
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-12 bg-slate-50 border-none rounded-xl px-5 pr-12"
                  value={formData[role].password}
                  onChange={(e) => updateField("password", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-500 font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-orange-500 text-white font-bold"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-orange-500 font-bold">
                Sign Up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>  
  );
}
