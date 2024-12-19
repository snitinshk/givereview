import { Heart } from "lucide-react";
import Image from "next/image";
import { getBaseUrl } from "../action";

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const baseUrl = await getBaseUrl();

  const data = await fetch(`${baseUrl}/api/web/client?slug=${slug}`);
  const reviewLink = await data.json();

  const { thankyou_review_link_details } = reviewLink;

  // console.log(reviewLink);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white relative">
        <div className="space-y-8 mb-10 -mt-20">
          {/* Logo */}
          {thankyou_review_link_details?.review_thankyou_bg_image && (
            <div className="flex justify-center">
              <Image
                src={thankyou_review_link_details?.review_thankyou_bg_image}
                alt="Restaurant Logo"
                width={350}
                height={350}
              />
            </div>
          )}
        </div>
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-medium text-gray-800">
            {thankyou_review_link_details?.review_thankyou_title}
          </h1>
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
          src={
            reviewLink?.desktop_bg_image
          }
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
