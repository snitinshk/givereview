"use client";

import { DEFAULT_TEXTS, reviewLinkThankyouDefaultValue } from "@/constant";
import React, { createContext, useContext, useState, ReactNode } from "react";

const ReviewLinkThankyouContext = createContext<any>(null);

export const ReviewLinkThankyouProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [reviewLinkThankyou, setReviewLinkThankyou] = useState<any>(reviewLinkThankyouDefaultValue);

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
      "useReviewLinkThankyou must be used within an ClientProvider"
    );
  }
  return context;
};
