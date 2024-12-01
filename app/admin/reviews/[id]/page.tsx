"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VscTriangleLeft } from "react-icons/vsc";
import { FaStar } from "react-icons/fa6";

const reviews = [
  {
    id: "1",
    date: "2024-11-30",
    client: "John Doe",
    stars: 4,
    name: "Great Service",
    review: "This is a fantastic service. Highly recommend it!",
    phone: "123-456-7890",
    email: "john.doe@example.com",
    good: "Friendly staff and quick service.",
    bad: "Limited parking space.",
    comments: "Will definitely visit again!",
    image: "",
  },
  {
    id: "2",
    date: "2024-12-01",
    client: "Jane Smith",
    stars: 5,
    name: "Excellent Experience",
    review: "Everything was perfect. Couldn’t ask for more!",
    phone: "",
    email: "jane.smith@example.com",
    good: "Impeccable customer care.",
    bad: "",
    comments: "",
    image: "",
  },
];

const ReviewDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [review, setReview] = useState<typeof reviews[0] | null>(null);

  useEffect(() => {
    if (id) {
      const fetchedReview = reviews.find((r) => r.id === id);
      setReview(fetchedReview || null);
    }
  }, [id]);

  if (!review) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">Review not found</p>
      </div>
    );
  }

  const renderStarRating = (label: string, rating: number) => (
    <div className="flex gap-2">
      <p className="w-28">{label}</p>
      <div className="flex gap-2">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`text-2xl ${index < rating ? "text-yellow-400" : "text-gray-300"
              }`}
          />
        ))}
      </div>
    </div>
  );

  const renderField = (label: string, value: string | undefined) => (
    <div>
      <label className="block font-semibold text-gray-500 text-sm mb-1">{label}</label>
      <p className="text-gray-700">{value || "N/A"}</p>
    </div>
  );

  return (
    <>
      <Button
        className="bg-gray-200 text-black hover:text-white -mt-12 mb-8 ml-auto flex"
        onClick={() => router.back()}
      >
        <VscTriangleLeft /> Back
      </Button>
      <div className="p-8 px-0 max-w-3xl">
        <div className="mb-16 flex flex-col gap-4">
          {renderStarRating("Food", review.stars)}
          {renderStarRating("Atmosphere", review.stars)}
          {renderStarRating("Noise Level", review.stars)}
          {renderStarRating("Price", review.stars)}
          {renderStarRating("Cleanliness", review.stars)}
          {renderStarRating("Waiting Time", review.stars)}
        </div>
        <div className="space-y-6">
          {renderField("Client", review.client)}
          {renderField("Review", review.review)}
          {renderField("Phone nr", review.phone)}
          {renderField("Email", review.email)}
          {renderField("What was good about your visit?", review.good)}
          {renderField("What was bad about your visit?", review.bad)}
          {renderField("Other comments", review.comments)}
        </div>
      </div>
    </>
  );
};

export default ReviewDetail;
