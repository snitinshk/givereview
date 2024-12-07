import Image from "next/image"
import { AlertTriangle } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-red-500" />
          <div className="space-y-2">
            <p className="text-2xl font-medium text-gray-800">
              The site is offline, contact
              <br />
              <span className="text-gray-600">&lt;client name&gt;</span>
            </p>
          </div>
        </div>
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