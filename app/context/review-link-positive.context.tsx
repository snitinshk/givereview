"use client";

import { DEFAULT_TEXTS } from "@/constant";
import React, { createContext, useContext, useState, ReactNode } from "react";

const ReviewLinkPositiveContext = createContext<any>(null);

export const ReviewLinkPositiveProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [reviewLinkPositive, setReviewLinkPositive] = useState<any>({
    reviewLinkPositiveTitle: DEFAULT_TEXTS?.positiveReviewTitle,
    selectedChannels: [],
  });

  return (
    <ReviewLinkPositiveContext.Provider
      value={{ reviewLinkPositive, setReviewLinkPositive }}
    >
      {children}
    </ReviewLinkPositiveContext.Provider>
  );
};

// Custom hook for consuming the alert context
export const useReviewLinkPositive = (): any => {
  const context = useContext(ReviewLinkPositiveContext);
  if (!context) {
    throw new Error(
      "useReviewLinkPositive must be used within an ClientProvider"
    );
  }
  return context;
};
