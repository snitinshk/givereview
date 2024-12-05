import Image from "next/image"

export default function ThankYouPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-medium text-gray-800">
            Thanks for your review
          </h1>
        </div>
      </div>

      {/* Restaurant Image */}
      <div className="hidden md:block">
        <Image
          src="/restaurant-interior.jpg"
          alt="Restaurant Interior"
          width={800}
          height={1000}
          className="object-cover w-full h-full"
          priority
        />
      </div>
    </div>
  )
}