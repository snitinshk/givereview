import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function PositiveFeedback({ reviewLink }: any) {
  const {
    positive_review_link_details: positiveRL,
    negative_review_link_details,
    clients: client,
  } = reviewLink;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white relative pb-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center mb-6">
            <Image
              src={client?.client_logo}
              alt="Client Logo"
              width={100}
              height={100}
              className="h-24 w-auto"
            />
          </div>

          <p className="text-gray-700 font-MOSTR font-light max-w-80 mx-auto">
            {reviewLink?.review_link_positive_title}
          </p>

          <div className="space-y-4 max-w-72 mx-auto">
            {positiveRL?.map((reviewLink: any, index: number) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-12 text-base flex items-center justify-start px-6 gap-2"
                asChild
              >
                <Link href={reviewLink?.channel_review_link}>
                  <Image
                    src={reviewLink?.channels?.channel_logo_url}
                    alt="Google"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <div className="flex-1 text-center font-MOSTR font-bold text-sm">{reviewLink?.channels?.channel_name}</div>
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="font-MOSTR text-sm text-gray-600 flex items-center gap-1 absolute left-1/2 bottom-3 -translate-x-1/2"><span className="font-medium">Powered</span> with <Heart className="text-red-600" /> by place booster</div>
      </div>

      <div className="hidden h-screen md:block">
        <Image
          src={reviewLink?.desktop_bg_image}
          alt="Restaurant Interior"
          width={800}
          height={1000}
          className="object-cover w-full h-full"
          priority
        />
      </div>
    </div>
  );
}
