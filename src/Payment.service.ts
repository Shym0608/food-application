import { API_CONFIG, getAuthHeaders } from "./Api.config";

/* ================== TYPES ================== */

export type PaymentMethod = "COD" | "UPI" | "CARD";

export interface CreateOrderPayload {
  restaurantId: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  cartId?: string;
}

export interface OrderResponse {
  orderId: string;
  restaurantId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

/* ================== SERVICE ================== */

export class PaymentService {
  private static baseUrl = API_CONFIG.BASE_URL;

  /**
   * Create a new order in backend
   */
  static async createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create order");
    }

    return response.json();
  }

  /**
   * Mark an order as paid (UPI / CARD / Manual confirmation)
   */
  static async markOrderAsPaid(orderId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/payment/mark-paid/${orderId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to mark order as paid");
    }
  }


  static async getOrder(orderId: string): Promise<OrderResponse> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch order details");
    }

    return response.json();
  }

  /**
   * Create Stripe session for CARD payments
   * Backend endpoint: POST /api/payment/create-session/{orderId}
   */
  static async createStripeSession(orderId: string): Promise<{ sessionId: string; sessionUrl: string }> {
    const response = await fetch(`${this.baseUrl}/payment/create-session/${orderId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create Stripe session");
    }

    const data = await response.json();
    return {
      sessionId: data.sessionId,
      sessionUrl: data.sessionUrl,
    };
  }
}