"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";


const ReviewLinkContext = createContext<any>(null);

export const ReviewLinkProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  
  const [reviewLinkDetail, setReviewLinkDetail] = useState<any>(null);

  return (
    <ReviewLinkContext.Provider
      value={{ reviewLinkDetail, setReviewLinkDetail }}
    >
      {children}
    </ReviewLinkContext.Provider>
  );
};

// Custom hook for consuming the alert context
export const useReviewLink = (): any => {
  const context = useContext(ReviewLinkContext);
  if (!context) {
    throw new Error("useReviewLink must be used within an ClientProvider");
  }
  return context;
};
