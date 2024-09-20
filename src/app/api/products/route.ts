import type { Product } from "@/types/product";
import { NextResponse } from "next/server";

const products: Product[] = [
  {
    id: 1,
    name: "Light Switch",
    price: 19.99,
    image: "/img/products/light_switch.jpg",
    description: "State of the art light switch for your smart home.",
  },
  {
    id: 2,
    name: "Network Switch",
    price: 199.99,
    image: "/img/products/network_switch.jpg",
    description: "High-speed network switch for your home office.",
  },
  {
    id: 3,
    name: "Train Switch",
    price: 79.99,
    image: "/img/products/rail_bill_exchange_train.jpg",
    description: "Directional switch for train enthusiasts.",
  },
  {
    id: 4,
    name: "Switchboard",
    price: 49.99,
    image: "/img/products/switchboard.jpg",
    description: "Who needs a cellphone when you have a switchboard?",
  },
  {
    id: 5,
    name: "Light Switch 'Classic'",
    price: 59.99,
    image: "/img/products/rustic_switch.jpg",
    description: "Probably won't burn your house down.",
  },
  {
    id: 6,
    name: "Advanced Network Switch",
    price: 249.99,
    image: "/img/products/complex_network_switch.jpg",
    description: "Can you figure out where these cables go? Neither can we.",
  },
  {
    id: 7,
    name: "Red Switch",
    price: 39.99,
    image: "/img/products/red_switch.jpg",
    description: "For those who like to live life on the edge.",
  },
  {
    id: 8,
    name: "Industrial Switch",
    price: 69.99,
    image: "/img/products/industrial_switch.jpg",
    description: "Turn on industry with this marvel of switching innovation.",
  },
];

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return NextResponse.json(products);
}
