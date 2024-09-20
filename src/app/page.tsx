"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import Banner from "@/components/Banner";
import { useFlag } from "@openfeature/react-sdk";

export default function Home() {
  const { value: showBanner } = useFlag("show-landing-page-banner", false);
  // console.log("showBanner", showBanner);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Welcome to</span>{" "}
                  <span className="block text-blue-400 xl:inline">
                    ToggleShop
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Discover the latest advancements in toggle technology. Elevate
                  your lifestyle with our curated selection of cutting-edge
                  toggle related products.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/products"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="#featured-products"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Featured Products
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <Image
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/img/placeholder.svg"
            width={800}
            height={600}
            alt="Toggles"
          />
        </div>
      </div>
      {showBanner ? (
        <Banner mobileMessage="Free shipping on all orders" />
      ) : null}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-between mb-6">
              <h2
                id="featured-products"
                className="text-2xl font-semibold text-gray-900"
              >
                Featured Products
              </h2>
              <Link
                href="/products"
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                View all products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
