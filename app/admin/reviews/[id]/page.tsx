"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import placeholder from "../../../images/placeholder.svg";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: "1",
    date: "2024-11-30",
    client: "John Doe",
    stars: 4,
    name: "Great Service",
    review: "This is a fantastic service. Highly recommend it!",
    image: "",
  },
  {
    id: "2",
    date: "2024-12-01",
    client: "Jane Smith",
    stars: 5,
    name: "Excellent Experience",
    review: "Everything was perfect. Couldn’t ask for more!",
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

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-6 mb-6">
        <Image
          src={review.image || placeholder}
          alt={`${review.name}'s image`}
          width={120}
          height={120}
          className="rounded-md"
        />
        <h1 className="text-3xl font-bold">{review.name}</h1>
      </div>
      <div className="space-y-4 text-lg">
        <p>
          <strong>Date:</strong> {review.date}
        </p>
        <p>
          <strong>Client:</strong> {review.client}
        </p>
        <p>
          <strong>Stars:</strong>{" "}
          {Array.from({ length: review.stars }).map((_, i) => (
            <span key={i} className="text-yellow-500">
              ⭐
            </span>
          ))}
        </p>
        <p>
          <strong>Review:</strong> {review.review}
        </p>
      </div>
      <Button
        className="mt-6 bg-gray-200 text-black hover:text-white"
        onClick={() => router.back()} // Navigate back to the previous page
      >
        Go Back
      </Button>
    </div>
  );
};

export default ReviewDetail;
