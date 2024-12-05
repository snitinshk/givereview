'use client'

import { Star } from "lucide-react";
import { useState } from "react";

export function HomeStar() {
  const [rating, setRating] = useState(0);
  return (
    <>
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star} className="relative">
          <Star
            className={`w-12 h-12 cursor-pointer ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 stroke-gray-300"
            }`}
            onClick={() => setRating(star)}
          />
        </div>
      ))}
    </>
  );
}
