import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="animate-bounce">
          <svg
            className="mx-auto h-40 w-auto text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Oops! Page not found
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            The page you are looking for doesnt exist or has been moved.
          </p>
        </div>
      </div>
    </div>
  );
}