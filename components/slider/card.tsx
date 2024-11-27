import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import { Testimonial } from "../data/testimonialsData";

interface SliderCardProps {
  testimonial: Testimonial;
}

const SliderCard: React.FC<SliderCardProps> = ({ testimonial }) => {
  const { author, date, rating, message, platformImage, authorImage } = testimonial;

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg flex flex-col gap-4 h-full">
      <div className="flex items-center gap-3 relative">
        {platformImage && (
          <div className="absolute right-2 top-2">
            <Image src={platformImage} alt="Platform Logo" width={20} height={20} />
          </div>
        )}
        <div className="w-14 h-14 relative">
          <Image
            src={authorImage || "/images/placeholder.svg"}
            alt={`${author}'s Image`}
            className="rounded-full object-cover"
            layout="fill"
          />
        </div>
        <div className="flex flex-col">
          <h4 className="text-base font-semibold">{author}</h4>
          <p className="text-gray-500 text-sm">{date}</p>
        </div>
      </div>
      <div className="flex items-center text-yellow-500 gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <FaStar key={i} />
        ))}
      </div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default SliderCard;
