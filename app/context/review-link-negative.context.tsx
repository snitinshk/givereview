"use client";

import { reviewLinkNegativeDefaultValue } from "@/constant";
import React, { createContext, useContext, useState, ReactNode } from "react";

const ReviewLinkNegativeContext = createContext<any>(null);

export const ReviewLinkNegativeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [reviewLinkNegative, setReviewLinkNegative] = useState<any>(
    reviewLinkNegativeDefaultValue
  );

  return (
    <ReviewLinkNegativeContext.Provider
      value={{ reviewLinkNegative, setReviewLinkNegative }}
    >
      {children}
    </ReviewLinkNegativeContext.Provider>
  );
};

// Custom hook for consuming the alert context
export const useReviewLinkNegative = (): any => {
  const context = useContext(ReviewLinkNegativeContext);
  if (!context) {
    throw new Error(
      "useReviewLinkNegative must be used within an ClientProvider"
    );
  }
  return context;
};
