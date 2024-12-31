"use client";

import { reviewLinkThankyouDefaultValue } from "@/constant";
import { ReviewLinkThankYouUI } from "@/interfaces/reviewlink";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Define the context type
interface ReviewLinkThankYouUIContextType {
  reviewLinkThankyou: ReviewLinkThankYouUI;
  setReviewLinkThankyou: Dispatch<SetStateAction<ReviewLinkThankYouUI>>;
}

const ReviewLinkThankyouContext = createContext<ReviewLinkThankYouUIContextType | null>(null);

export const ReviewLinkThankyouProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [reviewLinkThankyou, setReviewLinkThankyou] = useState<ReviewLinkThankYouUI>(reviewLinkThankyouDefaultValue);

  return (
    <ReviewLinkThankyouContext.Provider
      value={{ reviewLinkThankyou, setReviewLinkThankyou }}
    >
      {children}
    </ReviewLinkThankyouContext.Provider>
  );
};

// Custom hook for consuming the alert context
export const useReviewLinkThankyou = (): any => {
  const context = useContext(ReviewLinkThankyouContext);
  if (!context) {
    throw new Error(
      "useReviewLinkThankyou must be used within a ClientProvider"
    );
  }
  return context;
};
