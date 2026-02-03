// // src/config/api.config.ts

// export const API_CONFIG = {
//   BASE_URL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api`,
//   ENDPOINTS: {
//     ORDERS: "/orders",
//     PAYMENT: "/payment",
//     CREATE_SESSION: (orderId: string) => `/payment/create-session/${orderId}`,
//   },
// };

// // Helper function to get auth token
// export const getAuthToken = () => {
//   // Implement your auth token retrieval logic
//   return localStorage.getItem("authToken") || "";
// };

// // Helper function to get auth headers
// export const getAuthHeaders = () => {
//   const token = getAuthToken();
//   return {
//     "Content-Type": "application/json",
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };
// };



// src/config/Api.config.ts

export const API_CONFIG = {
  BASE_URL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api`,
  ENDPOINTS: {
    ORDERS: "/orders",
    PAYMENT: "/payment",
    CREATE_SESSION: (orderId: string) => `/payment/create-session/${orderId}`,
  },
};

// Helper function to get auth token
export const getAuthToken = () => {
  // Try multiple possible token storage locations
  const token = 
    localStorage.getItem("token") || 
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    "";
  
  // Debug logging - REMOVE IN PRODUCTION
  console.log("🔑 Auth Token Check:");
  console.log("- Token found:", token ? "YES ✅" : "NO ❌");
  console.log("- Token length:", token?.length || 0);
  console.log("- Token preview:", token ? `${token.substring(0, 20)}...` : "none");
  
  // List all localStorage keys to help identify the correct token key
  console.log("📦 Available localStorage keys:", Object.keys(localStorage));
  
  return token;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  
  console.log("📨 Request Headers:", headers);
  
  return headers;
};