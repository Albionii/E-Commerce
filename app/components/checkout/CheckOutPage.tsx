// /checkout/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";

// Defines the structure of items in your cart
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number; // Stock count at the time of adding to cart
  quantity: number;
}

// Defines the structure of the entire cart object in localStorage
interface LocalStorageCart {
  state: {
    items: CartItem[];
  };
  version: number;
}

// Defines the structure of the data returned by our availability API
interface AvailabilityInfo {
  id: string;
  stock: number;
  name: string;
}

const CheckoutPage = () => {
  const { clearCart, getTotalPrice } = useCartStore();

  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  // Load cart from localStorage when the page opens
  useEffect(() => {
    // Make sure you use the correct key for your localStorage item
    const storedCart = localStorage.getItem("cart-storage"); // <-- IMPORTANT: Use your actual key
    if (storedCart) {
      try {
        const parsedData: LocalStorageCart = JSON.parse(storedCart);
        setItems(parsedData.state.items);
      } catch (e) {
        setStatusMessage({
          type: "error",
          message: "Could not read cart from memory.",
        });
      }
    }
  }, []);

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    if (items.length === 0) {
      setStatusMessage({ type: "error", message: "Your cart is empty." });
      setIsLoading(false);
      return;
    }

    try {

      // 1. Call our new API route to get the latest stock information
      const response = await fetch("/api/products/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify product availability.");
      }

      const serverStockLevels: AvailabilityInfo[] = await response.json();

      // 2. Check for any discrepancies
      const unavailableItems: string[] = [];
      for (const cartItem of items) {
        const productOnServer = serverStockLevels.find(
          (p) => p.id === cartItem.id
        );

        // Check if product exists or if stock is less than requested quantity
        if (!productOnServer || productOnServer.stock < cartItem.quantity) {
          unavailableItems.push(
            `${cartItem.name} (Available: ${
              productOnServer?.stock ?? 0
            }, Requested: ${cartItem.quantity})`
          );
        }
      }

      // 3. If there are issues, stop and inform the user
      if (unavailableItems.length > 0) {
        const errorMessage = `Some items are no longer available or have insufficient stock: ${unavailableItems.join(
          "; "
        )}. Please adjust your cart.`;
        setStatusMessage({ type: "error", message: errorMessage });
        setIsLoading(false);
        return;
      }

      // 4. If everything is OK, proceed with the order
      console.log("All items are in stock. Placing order...");
      setStatusMessage({
        type: "success",
        message: "Order placed successfully! Redirecting...",
      });
      localStorage.removeItem("cart-storage");
      clearCart();
      router.replace("/");
    } catch (err) {
      setStatusMessage({
        type: "error",
        message:
          err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Order Summary
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Review your items before placing the order.
        </p>

        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">{item.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              Your cart is empty.
            </p>
          )}
        </div>

        <div className="mt-8">
          {statusMessage && (
            <div
              className={`p-3 rounded-lg mb-4 text-sm ${
                statusMessage.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {statusMessage.message}
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={isLoading || items.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
