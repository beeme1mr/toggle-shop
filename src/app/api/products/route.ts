import type { Product } from "@/types/product";
import { NextResponse } from "next/server";

const products: Product[] = [
  {
    id: 1,
    name: "Light Switch",
    price: 19.99,
    image: "/light_switch.jpg",
    description: "State of the art light switch for your smart home.",
  },
  {
    id: 2,
    name: "Network Switch",
    price: 199.99,
    image: "/network_switch.jpg",
    description: "High-speed network switch for your home office.",
  },
  {
    id: 3,
    name: "Train Switch",
    price: 79.99,
    image: "/rail_bill_exchange_train.jpg",
    description: "Directional switch for train enthusiasts.",
  },
  {
    id: 4,
    name: "Switchboard",
    price: 49.99,
    image: "/switchboard.jpg",
    description: "Who needs a cellphone when you have a switchboard?",
  },
  {
    id: 5,
    name: "Wireless Keyboard",
    price: 59.99,
    image: "/placeholder.svg",
    description: "Sleek wireless keyboard with long battery life.",
  },
  {
    id: 6,
    name: "Noise-Cancelling Headphones",
    price: 249.99,
    image: "/placeholder.svg",
    description:
      "Over-ear headphones with advanced noise cancellation technology.",
  },
  {
    id: 7,
    name: "Portable Charger",
    price: 39.99,
    image: "/placeholder.svg",
    description: "High-capacity portable charger for all your devices.",
  },
  {
    id: 8,
    name: "Webcam",
    price: 69.99,
    image: "/placeholder.svg",
    description: "HD webcam for clear video calls and streaming.",
  },
];

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return NextResponse.json(products);
}
