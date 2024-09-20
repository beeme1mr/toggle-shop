import Header from "@/components/Header";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            About TechGear
          </h1>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl leading-6 font-medium text-gray-900">
                Our Story
              </h2>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Founded</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    2023
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Mission</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    To provide cutting-edge technology products that enhance
                    people&apos;s lives and work.
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Headquarters
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    San Francisco, California
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl leading-6 font-medium text-gray-900">
                Our Commitment
              </h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <p className="text-sm text-gray-500">
                At TechGear, we&apos;re committed to bringing you the latest and
                greatest in technology. Our team of experts carefully curates
                each product in our inventory to ensure it meets our high
                standards for quality, innovation, and user experience. We
                believe that technology should make your life easier and more
                enjoyable, and we&apos;re here to help you find the perfect
                gadgets to do just that.
              </p>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Explore Our Products
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
