import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PositiveFeedback({ reviewLink }: any) {
  const {
    positive_review_link_details: positiveRL,
    negative_review_link_details,
    clients: client,
  } = reviewLink;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center mb-6">
            <Image
              src={client?.client_logo}
              alt="Client Logo"
              width={100}
              height={100}
              className="h-24 w-auto"
            />
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-700">
              {reviewLink?.review_link_positive_title}
            </p>
          </div>

          <div className="space-y-4">
            {positiveRL?.map((reviewLink: any, index: number) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-12 text-base flex items-center gap-2"
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
                  {reviewLink?.channels?.channel_name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
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
