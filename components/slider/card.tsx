import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import { Testimonial } from "../data/testimonialsData";
import { WidgetReview } from "@/interfaces/widget";
import { useWidget } from "@/app/context/widget-context";

interface SliderCardProps {
  testimonial: WidgetReview;
}

const SliderCard: React.FC<SliderCardProps> = ({ testimonial }) => {
  const { widget } = useWidget();

  const {
    reviewersName,
    reviewDate,
    reviewCount,
    reviewDescription,
    channelLogo,
    reviewersAvtar,
  } = testimonial;

  const formattedDate = new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(reviewDate as Date));

  function truncateString(str: string, maxLength = 140) {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  }

  return (
    <div className="bg-white drop-shadow-cl-box-shadow p-4 rounded-lg flex flex-col gap-4 h-full">
      <div className="flex items-center gap-3 relative">
        {channelLogo && widget?.settings?.showChannelLogo && (
          <div className="absolute right-2 top-2">
            <Image
              src={channelLogo}
              alt="Platform Logo"
              width={20}
              height={20}
            />
          </div>
        )}
        {widget?.settings?.showCustomerAvatar && (
          <div className="w-14 h-14 relative">
            <Image
              src={reviewersAvtar || "/images/placeholder.svg"}
              alt={`${reviewersName}'s Image`}
              className="rounded-full object-cover"
              layout="fill"
            />
          </div>
        )}

        <div className="flex flex-col">
          {widget?.settings?.showCustomerName && (
            <h4 className="text-base font-semibold">{reviewersName}</h4>
          )}
          {widget?.settings?.showReviewDate && (
            <p className="text-gray-500 text-sm">{formattedDate}</p>
          )}
        </div>
      </div>
      {widget?.settings?.showRating && (
        <div className="flex items-center text-yellow-500 gap-1">
          {Array.from({ length: reviewCount as number }).map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>
      )}
      <p className="text-gray-600 text-sm min-h-[62px]">
        {truncateString(reviewDescription ?? "")}
      </p>
    </div>
  );
};

export default SliderCard;
