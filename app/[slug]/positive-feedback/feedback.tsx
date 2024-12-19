import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Loading from "@/components/loader/loading";

export default function PositiveFeedback({ reviewLink }: any) {
  const { positive_review_link_details: positiveRL, clients: client } =
    reviewLink;

  if (positiveRL?.length === 1) {
    window.location.href = positiveRL[0]?.channel_review_link;
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white relative pb-12">
        <div className="w-full max-w-md space-y-8">
          {client?.client_logo && (
            <div className="flex justify-center mb-6">
              <Image
                src={client?.client_logo}
                alt="Restaurant Logo"
                width={100}
                height={100}
                className="h-24 w-auto"
              />
            </div>
          )}
          <p className="text-gray-700 font-MOSTR font-light text-center max-w-96 mx-auto">
            {reviewLink?.review_link_positive_title}
          </p>

          <div className="space-y-4 max-w-72 mx-auto">
            {positiveRL?.map((item: any, index: number) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-12 text-base flex items-center justify-start px-6 gap-2"
                asChild
              >
                <Link href={item?.channel_review_link}>
                  <Image
                    src={item?.channels?.channel_logo_url}
                    alt="Google"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <div className="flex-1 text-center font-MOSTR font-bold text-sm">
                    {item?.channels?.channel_name}
                  </div>
                </Link>
              </Button>
            ))}
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
