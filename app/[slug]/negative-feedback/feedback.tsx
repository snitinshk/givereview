"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RatingItem } from "./rating";

export default function NegativeFeedback({ reviewLink }: any) {
  const { clients: client, negative_review_link_details } = reviewLink;
  const {
    channel_logo,
    negative_page_title,
    negative_page_description,
    is_input_name_enabled,
    is_input_email_enabled,
    is_input_phone_enabled,
    is_food_review_enabled,
    is_noise_review_enabled,
    is_price_review_enabled,
    is_service_review_enabled,
    is_wait_time_review_enabled,
    is_atmosphere_review_enabled,
    is_cleanliness_review_enabled,
    is_input_other_comments_enabled,
    is_input_visit_drawbacks_enabled,
    is_input_place_experience_enabled,
    is_input_visit_highlights_enabled,
  } = negative_review_link_details;

  const [ratings, setRatings] = useState({
    Food: 0,
    Service: 0,
    Atmosphere: 0,
    "Noise Level": 0,
    Price: 0,
    Cleanliness: 0,
    "Waiting time": 0,
  });

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

    if (Object.values(ratings).some((rating) => rating === 0)) {
      newErrors.ratings = "Please rate all categories";
    }
    if (name.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (placeExperience.trim() === "") {
      newErrors.placeExperience = "Place Experience is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log({ ratings, name, placeExperience });
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      // Reset form
      setRatings({
        Food: 0,
        Service: 0,
        Atmosphere: 0,
        "Noise Level": 0,
        Price: 0,
        Cleanliness: 0,
        "Waiting time": 0,
      });
      setName("");
      setPlaceExperience("");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white">
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
            We want our customers to be 100% satisfied.
            Please let us know why you had a bad experience,
            so we can improve our service. Leave your email
            to be contacted.
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

            <div className="space-y-4 !mt-10">
              <div>
                <Input
                  placeholder="Your name"
                  className="border-gray-300 max-w-80 h-12"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <Input
                  placeholder="Phone no"
                  className="border-gray-300 max-w-80 h-12"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={errors.phone ? "true" : "false"}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  className="border-gray-300 max-w-80 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div>
                <Textarea
                  placeholder="Share information about how you experienced the place"
                  className="min-h-[100px] border-gray-300 resize-none"
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
              <div>
                <Textarea
                  placeholder="What was good about your visit?"
                  className="min-h-[100px] border-gray-300 resize-none"
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
              <div>
                <Textarea
                  placeholder="Other comments"
                  className="min-h-[100px] border-gray-300 resize-none"
                  value={otherComments}
                  onChange={(e) => setOtherComments(e.target.value)}
                  aria-invalid={errors.otherComments ? "true" : "false"}
                />
                {errors.otherComments && (
                  <p className="text-red-500 text-sm">{errors.otherComments}</p>
                )}
              </div>
              <div>
                <Textarea
                  placeholder="What was bad about your visit?"
                  className="min-h-[100px] border-gray-300 resize-none"
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
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-half bg-black hover:bg-gray-800 text-white px-10 font-semibold"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
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
