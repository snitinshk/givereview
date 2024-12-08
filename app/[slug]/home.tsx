"use client";

import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useState } from "react";

export default function Home({
  reviewLink,
  setIsNegativePageVisible,
  setIsPositivePageVisible,
  setIsHomeVisible,
  set,
}: any) {
  const { clients: client } = reviewLink;
  const [rating, setRating] = useState(0);

  const handleSelectRating = (star: number) => {
    if (star > 3) {
      setIsPositivePageVisible(true);
      setIsHomeVisible(false);
    } else {
      setIsNegativePageVisible(true);
      setIsHomeVisible(false);
    }
    setRating(star);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white relative pb-12">
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
          <div className="space-y-7 text-center">
            <h1 className="text-3xl font-semibold text-gray-800 font-MOSTR">
              How was your
              <br />
              experience with Silvis ?
            </h1>

            {/* Star Rating */}
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="relative">
                  <Star
                    className={`w-12 h-12 cursor-pointer ${star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 stroke-gray-300"
                      }`}
                    onClick={() => handleSelectRating(star)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="font-MOSTR text-sm text-gray-600 flex items-center gap-1 absolute left-1/2 bottom-3 -translate-x-1/2"><span className="font-medium">Powered</span> with <Heart className="text-red-600" /> by place booster</div>
      </div>

      {/* Restaurant Image */}
      <div className="hidden h-screen md:block">
        <Image
          src={reviewLink?.desktop_bg_image}
          alt="Restaurant Interior"
          width={700}
          height={800}
          className="object-cover w-full h-full"
          priority
        />
      </div>
    </div>
  );
}
