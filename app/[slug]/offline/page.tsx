import Image from "next/image"
import { TbAlertTriangleFilled } from "react-icons/tb";

export default function OfflinePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6 text-center">
          <TbAlertTriangleFilled className="w-12 h-12 mx-auto text-red-500" />
          <div className="space-y-2 font-MOSTR font-medium">
            <p className="text-2xl text-gray-800">
              The site is offline, contact
              <br />
              <span>&lt;client name&gt;</span>
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