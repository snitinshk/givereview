"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RatingItem } from "./rating";
import { Heart } from "lucide-react";
import { saveNegativeReview } from "../action";
import { useRouter } from "next/navigation";

export default function NegativeFeedback({ reviewLink, averageRating }: any) {
  const router = useRouter();
  const { clients: client, negative_review_link_details } = reviewLink;

  const {
    channel_logo,
    negative_page_title,
    negative_page_description,
    is_food_review_enabled,
    is_noise_review_enabled,
    is_price_review_enabled,
    is_service_review_enabled,
    is_wait_time_review_enabled,
    is_atmosphere_review_enabled,
    is_cleanliness_review_enabled,
    is_input_name_enabled,
    is_input_email_enabled,
    is_input_phone_enabled,
    is_input_other_comments_enabled,
    is_input_visit_drawbacks_enabled,
    is_input_place_experience_enabled,
    is_input_visit_highlights_enabled,
  } = negative_review_link_details;

  const getInitialRatings = () => {
    const ratingsTemplate = {
      Food: 0,
      Service: 0,
      Atmosphere: 0,
      "Noise Level": 0,
      Price: 0,
      Cleanliness: 0,
      "Waiting time": 0,
    };

    const fieldMappings = {
      Food: is_food_review_enabled,
      Service: is_service_review_enabled,
      Atmosphere: is_atmosphere_review_enabled,
      "Noise Level": is_noise_review_enabled,
      Price: is_price_review_enabled,
      Cleanliness: is_cleanliness_review_enabled,
      "Waiting time": is_wait_time_review_enabled,
    };

    // Return only the fields that are enabled
    return Object.fromEntries(
      Object.entries(ratingsTemplate).filter(
        ([key]) => fieldMappings[key as keyof typeof fieldMappings]
      )
    );
  };

  const [ratings, setRatings] = useState(() => getInitialRatings());

  //Inputs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  //Textareas
  const [placeExperience, setPlaceExperience] = useState("");
  const [visitHighlights, setVisitHighlights] = useState("");
  const [visitDrawbacks, setDrawbacks] = useState("");
  const [otherComments, setOtherComments] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleRatingChange = (
    category: keyof typeof ratings,
    newRating: number
  ) => {
    setRatings((prev) => ({ ...prev, [category]: newRating }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (name.trim() === "" && is_input_name_enabled) {
      newErrors.name = "Your name is required";
    }

    if (email.trim() === "" && is_input_email_enabled) {
      newErrors.email = "Your email is required";
    }

    if (visitDrawbacks.trim() === "" && is_input_visit_drawbacks_enabled) {
      newErrors.visitDrawbacks = "This is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      saveNegativeReviewInDb();
    }
  };

  const saveNegativeReviewInDb = async () => {
    const negativeReviewData = {
      reviewers_name: is_input_name_enabled ? name : null,
      reviewers_email: is_input_email_enabled ? email : null,
      reviewers_phone: is_input_phone_enabled ? phone : null,
      reviewers_place_experience: is_input_place_experience_enabled
        ? placeExperience
        : null,
      reviewers_visit_highlights: is_input_visit_highlights_enabled
        ? visitHighlights
        : null,
      reviewers_visit_drawbacks: is_input_visit_drawbacks_enabled
        ? visitDrawbacks
        : null,
      reviewers_other_comments: is_input_other_comments_enabled
        ? otherComments
        : null,
      food_review: ratings?.Food ?? null,
      service_review: ratings?.Service ?? null,
      atmosphere_review: ratings?.Atmosphere ?? null,
      noise_review: ratings["Noise Level"] ?? null,
      price_review: ratings?.Price ?? null,
      cleanliness_review: ratings?.Cleanliness ?? null,
      wait_time_review: ratings["Waiting time"] ?? null,
      average_rating: averageRating,
      review_link_id: reviewLink?.id,
    };

    const { error } = await saveNegativeReview(negativeReviewData);
    
    if (!error) {
      router.push(`/${reviewLink?.review_link_slug}/thank-you`);
    }

  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white relative pb-12">
        <div className="w-full max-w-md space-y-7">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src={client?.client_logo}
              alt="Client Logo"
              width={100}
              height={100}
              className="h-24 w-auto"
            />
          </div>

          {/* Description */}
          <div className="text-center mb-8 space-y-2 font-MOSTR font-light text-gray-700 text-base max-w-[394px] mx-auto">
            {negative_page_description}
          </div>

          {/* Google placeExperience Indicator */}
          <div className="flex items-center gap-3 mb-6 font-MOSTR font-light text-black text-base">
            {channel_logo?.enabled && (
              <Image
                src={channel_logo?.logo}
                alt="Google"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            )}
            {negative_page_title?.enabled && (
              <span className="text-sm">
                {negative_page_title?.title}
              </span>
            )}
          </div>

          {/* Rating Form */}
          <form onSubmit={handleSubmit} className="space-y-6 font-MOSTR">
            <div className="space-y-2">
              {Object.entries(ratings).map(([category, rating]) => (
                <RatingItem
                  key={category}
                  name={category}
                  rating={rating}
                  onRatingChange={(newRating) =>
                    handleRatingChange(
                      category as keyof typeof ratings,
                      newRating
                    )
                  }
                />
              ))}
              {errors.ratings && (
                <p className="text-red-500 text-sm">{errors.ratings}</p>
              )}
            </div>

            <div className="space-y-4">
              {is_input_name_enabled && (
                <div>
                  <Input
                    placeholder="Your name"
                    className="border-gray-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
              )}
              {is_input_phone_enabled && (
                <div>
                  <Input
                    placeholder="Phone no"
                    className="border-gray-300"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-invalid={errors.phone ? "true" : "false"}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
              )}
              {is_input_email_enabled && (
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="border-gray-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              )}

              {is_input_place_experience_enabled && (
                <div>
                  <Textarea
                    placeholder="Share information about how you experienced the place"
                    className="min-h-[100px] border-gray-300"
                    value={placeExperience}
                    onChange={(e) => setPlaceExperience(e.target.value)}
                    aria-invalid={errors.placeExperience ? "true" : "false"}
                  />
                  {errors.placeExperience && (
                    <p className="text-red-500 text-sm">
                      {errors.placeExperience}
                    </p>
                  )}
                </div>
              )}
              {is_input_visit_highlights_enabled && (
                <div>
                  <Textarea
                    placeholder="What was good about your visit?"
                    className="min-h-[100px] border-gray-300"
                    value={visitHighlights}
                    onChange={(e) => setVisitHighlights(e.target.value)}
                    aria-invalid={errors.visitHighlights ? "true" : "false"}
                  />
                  {errors.visitHighlights && (
                    <p className="text-red-500 text-sm">
                      {errors.visitHighlights}
                    </p>
                  )}
                </div>
              )}
              {is_input_visit_drawbacks_enabled && (
                <div>
                  <Textarea
                    placeholder="What was bad about your visit?"
                    className="min-h-[100px] border-gray-300"
                    value={visitDrawbacks}
                    onChange={(e) => setDrawbacks(e.target.value)}
                    aria-invalid={errors.visitDrawbacks ? "true" : "false"}
                  />
                  {errors.visitDrawbacks && (
                    <p className="text-red-500 text-sm">
                      {errors.visitDrawbacks}
                    </p>
                  )}
                </div>
              )}
              {is_input_other_comments_enabled && (
                <div>
                  <Textarea
                    placeholder="Other comments"
                    className="min-h-[100px] border-gray-300"
                    value={otherComments}
                    onChange={(e) => setOtherComments(e.target.value)}
                    aria-invalid={errors.otherComments ? "true" : "false"}
                  />
                  {errors.otherComments && (
                    <p className="text-red-500 text-sm">
                      {errors.otherComments}
                    </p>
                  )}
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-half bg-black hover:bg-gray-800 text-white"
            >
              Send
            </Button>
          </form>
        </div>
        {reviewLink?.powered_by_enabled && (
          <div className="font-MOSTR text-sm text-gray-600 flex items-center gap-1 absolute left-1/2 bottom-3 -translate-x-1/2">
            <span className="font-medium">Powered</span> with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by place
            booster
          </div>
        )}
      </div>

      {/* Restaurant Image */}
      <div className="hidden h-screen sticky top-0 md:block">
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
