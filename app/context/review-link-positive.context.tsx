"use client";

import { DEFAULT_TEXTS } from "@/constant";
import { ReviewLinkPositive } from "@/interfaces/reviewlink";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface ReviewLinkPositiveContextType {
  reviewLinkPositive: ReviewLinkPositive;
  setReviewLinkPositive: Dispatch<SetStateAction<ReviewLinkPositive>>;
}

const ReviewLinkPositiveContext =
  createContext<ReviewLinkPositiveContextType | null>(null);

export const ReviewLinkPositiveProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [reviewLinkPositive, setReviewLinkPositive] =
    useState<ReviewLinkPositive>({
      title: DEFAULT_TEXTS?.positiveReviewTitle,
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
