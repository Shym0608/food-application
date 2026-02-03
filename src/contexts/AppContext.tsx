import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import api from "@/lib/api";

// Types
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  veg: boolean;
  rating: number;
  quantity: number;
  restaurantId?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    default?: boolean;
  };
  rating?: number;
  isOpen: boolean;
  cuisine: string;
  basePrice?: number;
  phone?: string;
  categories?: string[];
  isActive?: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Address {
  id: string;
  address: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  status: "confirmed" | "pending" | "preparing" | "on-the-way" | "delivered";
  date: string;
  deliveryAddress: string;
}

export type Role = "user" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  imageUrl?: string;
  addresses: Address[];
  role: Role;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  cart: CartItem[];
  orders: Order[];
  selectedAddress: Address | null;
}

type AppAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "ADD_TO_CART"; payload: FoodItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "SELECT_ADDRESS"; payload: Address }
  | { type: "ADD_ADDRESS"; payload: Address }
  | { type: "UPDATE_ADDRESS"; payload: Address }
  | { type: "DELETE_ADDRESS"; payload: string };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  orders: [],
  selectedAddress: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        selectedAddress:
          action.payload.addresses.find((a) => a.isDefault) || null,
      };

    case "LOGOUT":
      return {
        ...initialState,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case "ADD_TO_CART": {
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_CART_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
      };

    case "ADD_ORDER":
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };

    case "SELECT_ADDRESS":
      return {
        ...state,
        selectedAddress: action.payload,
      };

    case "ADD_ADDRESS":
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              addresses: [...state.user.addresses, action.payload],
            }
          : null,
      };

    case "UPDATE_ADDRESS":
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              addresses: state.user.addresses.map((addr) =>
                addr.id === action.payload.id ? action.payload : addr,
              ),
            }
          : null,
        selectedAddress:
          state.selectedAddress?.id === action.payload.id
            ? action.payload
            : state.selectedAddress,
      };

    case "DELETE_ADDRESS":
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              addresses: state.user.addresses.filter(
                (addr) => addr.id !== action.payload,
              ),
            }
          : null,
        selectedAddress:
          state.selectedAddress?.id === action.payload
            ? null
            : state.selectedAddress,
      };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  cartTotal: number;
  cartItemCount: number;
  cartItems: CartItem[]; // ✅ Added cartItems to the context type
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const cartTotal = state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const cartItemCount = state.cart.reduce(
    (count, item) => count + item.quantity,
    0,
  );

  // Fetch cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await api.get("/api/cart");

        // Map backend cart response to frontend format
        const cartItems: CartItem[] = response.data.items.map((item: any) => ({
          id: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl || "",
          description: item.description || "",
          veg: item.veg !== undefined ? item.veg : true,
          rating: item.rating || 0,
          restaurantId: response.data.restaurantId,
        }));

        dispatch({ type: "SET_CART", payload: cartItems });
      } catch (error: any) {
        // If cart doesn't exist (404), that's okay - user has empty cart
        if (error.response?.status === 404) {
       
          dispatch({ type: "SET_CART", payload: [] });
        } else {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchCart();
  }, []); // Run once on mount

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        cartTotal,
        cartItemCount,
        cartItems: state.cart, // ✅ Expose cartItems in the context value
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
