import Link from "next/link";

interface BannerProps {
  mobileMessage: string;
  desktopMessage?: string;
  learnMoreHref?: string;
}

export default function Banner({
  mobileMessage,
  desktopMessage,
  learnMoreHref,
}: BannerProps) {
  return (
    <div className="bg-yellow-400 text-gray-900">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-yellow-500">
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </span>
            <p className="ml-3 font-medium truncate">
              <span className="md:hidden">{mobileMessage}</span>
              <span className="hidden md:inline">
                {desktopMessage ?? mobileMessage}
              </span>
            </p>
          </div>
          {learnMoreHref ? (
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <Link
                href={learnMoreHref}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-600 bg-white hover:bg-yellow-50"
              >
                Learn more
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
