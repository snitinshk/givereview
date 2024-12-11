import { headers } from "next/headers";

import Home from "./home";
import PositiveFeedback from "./positive-feedback/feedback";
import NegativeFeedback from "./negative-feedback/feedback";
import IndexPage from ".";
import Image from "next/image";
import { cloneElement, isValidElement, ReactNode } from "react";
import { HomeStar } from "./components/home-star";
import { Star } from "lucide-react";

export default async function HomeLayout({
  reviewLink,
  children,
}: {
  reviewLink: any;
  children: ReactNode;
}) {
  //   const slug = (await params).slug;
  //   const baseUrl = getBaseUrl();
  //   const data = await fetch(`${baseUrl}/api/web/client?slug=${slug}`);
  //   const reviewLink = await data.json();
    console.log(children);
  const { clients: client } = reviewLink;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src={client?.client_logo}
              alt="The Elephant Pure Indian Kitchen"
              width={150}
              height={150}
              className="w-auto h-32"
            />
          </div>
          {/* Rating Section */}
          {isValidElement(children)
            ? cloneElement(children as React.ReactElement, { reviewLink })
            : children}
        </div>
      </div>

      {/* Restaurant Image */}
      <div className="hidden md:block">
        <Image
          src={reviewLink?.desktop_bg_image}
          alt="Desktop background"
          width={700}
          height={800}
          className="object-cover w-full h-full"
          priority
        />
      </div>
    </div>
  );
}

const getBaseUrl = () => {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
};
