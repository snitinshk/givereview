import { Heart, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { getBaseUrl } from "../action";

export default async function OfflinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const baseUrl = await getBaseUrl();

  const data = await fetch(`${baseUrl}/api/web/client?slug=${slug}`);
  const reviewLink = await data.json();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen max-sm:h-full max-sm:min-h-full">
      <div className="flex flex-col items-center justify-center p-8 bg-white relative pb-12">
        <div className="w-full max-w-md space-y-6 text-center">
          <TriangleAlert className="w-12 h-12 mx-auto text-red-500" />
          <div className="space-y-2 font-MOSTR font-medium">
            <p className="text-2xl text-gray-800">
              The site is offline, contact
              <br />
              <span>{ reviewLink?.clients?.client_name }</span>
            </p>
          </div>
        </div>
        {reviewLink?.powered_by_enabled && (
          <div className="font-MOSTR text-sm text-gray-600 flex items-center gap-1 absolute left-1/2 bottom-3 -translate-x-1/2 max-sm:w-full max-sm:justify-center">
            <span className="font-medium">Powered</span> with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by place
            booster
          </div>
        )}
      </div>

      {/* Restaurant Image */}
      <div className="hidden h-screen md:block">
        <Image
          src={reviewLink?.desktop_bg_image}
          alt="Desktop background"
          width={800}
          height={1000}
          className="object-cover w-full h-full"
          priority
        />
      </div>
    </div>
  );
}