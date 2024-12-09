"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VscTriangleLeft } from "react-icons/vsc";
import { FaStar } from "react-icons/fa6";
import { TransformedReview } from "@/interfaces/i-reviews";
import { useSelectedReview } from "@/app/context/selected-negative-review-context";

const ReviewDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const { selectedReview } = useSelectedReview();
  const [review, setReview] = useState<TransformedReview | null>(
    selectedReview
  );
  console.log(review);
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
            className={`text-2x ${
              rating >= index + 1 ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );

  // "text-yellow-400" : "text-gray-300"

  const renderField = (label: string, value: string | undefined) => (
    <div>
      <label className="block font-semibold text-gray-500 text-sm mb-1">
        {label}
      </label>
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
          {renderStarRating("Food", Number(review.foodReview))}
          {renderStarRating("Atmosphere", Number(review.atmosphereReview))}
          {renderStarRating("Noise Level", Number(review.noiseReview))}
          {renderStarRating("Price", Number(review.priceReview))}
          {renderStarRating("Cleanliness", Number(review.cleanlinessReview))}
          {renderStarRating("Waiting Time", Number(review.waitTimeReview))}
        </div>
        <div className="space-y-6">
          {renderField("Client", review.client)}
          {renderField("Review", review.review)}
          {renderField("Phone nr", review.reviewerPhone ?? "")}
          {renderField("Email", review.reviewerEmail ?? "")}
          {renderField(
            "What was good about your visit?",
            review.reviewerExperience ?? ""
          )}
          {renderField(
            "What was bad about your visit?",
            review.reviewerDrawbacks ?? ""
          )}
          {renderField("Other comments", review.reviewerComments ?? "")}
        </div>
      </div>
    </>
  );
};

export default ReviewDetail;