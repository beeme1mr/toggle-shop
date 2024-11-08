"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Minus, Plus, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import Header from "@/components/Header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tanstackMetaToHeader } from "@/libs/open-feature/evaluation-context";
import { useFlag } from "@openfeature/react-sdk";

interface FormState {
  name: string;
  email: string;
  address: string;
  card: string;
}

type FormAction = { type: "SET_FIELD"; field: keyof FormState; value: string };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    default:
      return state;
  }
};

export default function Checkout() {
  const router = useRouter();
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  // This should be validated server-side in a real app
  const { value: freeShipping, isAuthoritative } = useFlag(
    "offer-free-shipping",
    false
  );
  const [formData, dispatch] = useReducer(formReducer, {
    name: "",
    email: "",
    address: "",
    card: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_FIELD",
      field: e.target.name as keyof FormState,
      value: e.target.value,
    });
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      return fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...tanstackMetaToHeader(
            queryClient.getDefaultOptions().mutations?.meta
          ),
        },
        body: JSON.stringify({
          items: cartItems,
          customerInfo: formData,
        }),
      });
    },
    onError(error) {
      console.error("Error submitting order:", error);
      alert("There was an error submitting your order. Please try again.");
    },
    onSuccess() {
      router.push("/order-success");
      clearCart();
    },
  });

  const cartPrices = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingPrice =
    freeShipping && isAuthoritative && cartPrices > 50 ? 0 : 10;
  const totalPrice = cartPrices + shippingPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cart Summary
            </h2>
            {cartItems.length === 0 ? (
              <div className="p-32 flex flex-col space-y-8 items-center">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-gray-900">
                    Your cart is empty
                  </div>
                  <div className="text-md text-gray-600">
                    Let&apos;s fix that....
                  </div>
                </div>
                <div className="rounded-md shadow">
                  <Link
                    href="/products"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    See Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {item.name}
                            </h3>
                            <p className="text-gray-600">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="text-gray-500 hover:text-gray-700 p-1"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-2 w-8 text-center text-gray-400 font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="text-gray-500 hover:text-gray-700 p-1"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-4 text-red-500 hover:text-red-700 p-1"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-l font-bold text-right text-gray-400">
                    Shipping: ${shippingPrice.toFixed(2)}
                  </div>
                  <div className="text-xl font-bold text-right text-gray-400">
                    Total: ${totalPrice.toFixed(2)}
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="card"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="card"
                      name="card"
                      value={formData.card}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-slate-100 disabled:text-slate-300"
                      disabled={cartItems.length === 0 || mutation.isPending}
                    >
                      {mutation.isPending ? "Placing Order..." : "Place Order"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
