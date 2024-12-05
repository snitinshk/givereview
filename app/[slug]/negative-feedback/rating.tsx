import { useState } from "react";
import { Star } from "lucide-react";

interface RatingItemProps {
  name: string;
  rating: number;
  onRatingChange: (newRating: number) => void;
}

export function RatingItem({ name, rating, onRatingChange }: RatingItemProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-base text-gray-700">{name}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              star <= (hover || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${name} ${star} out of 5 stars`}
          />
        ))}
      </div>
    </div>
  );
}