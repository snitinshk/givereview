import { Heart } from "lucide-react"
import Image from "next/image"

export default function ThankYouPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white relative pb-12">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-medium font-MOSTR text-gray-800">
            Thanks for your review
          </h1>
        </div>
        <div className="font-MOSTR text-sm text-gray-600 flex items-center gap-1 absolute left-1/2 bottom-3 -translate-x-1/2"><span className="font-medium">Powered</span> with <Heart className="text-red-600" /> by place booster</div>
      </div>

      {/* Restaurant Image */}
      <div className="hidden h-screen md:block">
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