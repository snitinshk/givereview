"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RatingItem } from "./rating";

export default function NegativeFeedback({ reviewLink }: any) {
  const { cliens: client, negative_review_link_details } = reviewLink;

  const [ratings, setRatings] = useState({
    Food: 0,
    Service: 0,
    Atmosphere: 0,
  });
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
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
    if (review.trim() === "") {
      newErrors.review = "Review is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log({ ratings, name, review });
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      // Reset form
      setRatings({ Food: 0, Service: 0, Atmosphere: 0 });
      setName("");
      setReview("");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
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
          <div className="text-center mb-8 space-y-2">
            <p className="text-gray-700">
              We want our customers to be 100% satisfied.
            </p>
            <p className="text-gray-700">
              Please let us know why you had a bad experience,
              <br />
              so we can improve our service. Leave your email
              <br />
              to be contacted.
            </p>
          </div>

          {/* Google Review Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <Image
              src="/placeholder.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-600">
              Appears publicly on Google
            </span>
          </div>

          {/* Rating Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div>
                <Textarea
                  placeholder="Review"
                  className="min-h-[100px] border-gray-300"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  aria-invalid={errors.review ? "true" : "false"}
                />
                {errors.review && (
                  <p className="text-red-500 text-sm">{errors.review}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              Send
            </Button>
          </form>
        </div>
      </div>

      {/* Restaurant Image */}
      <div className="hidden md:block">
        <Image
          src="/placeholder.svg"
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
