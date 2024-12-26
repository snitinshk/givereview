"use client";

import { Client } from "@/interfaces/clients";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { useClients } from "./clients-context";
import { useParams } from "next/navigation";
import { TransformedReview } from "@/interfaces/reviews";

interface SelectedReviewContextProps {
  selectedReview: TransformedReview | null;
  setSelectedReview: Dispatch<SetStateAction<TransformedReview | null>>;
}

const SelectedReviewContext = createContext<
  SelectedReviewContextProps | undefined
>(undefined);

export const SelectedReviewProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { slug } = useParams();
  const [selectedReview, setSelectedReview] = useState<TransformedReview | null>(null);

  return (
    <SelectedReviewContext.Provider
      value={{ selectedReview, setSelectedReview }}
    >
      {children}
    </SelectedReviewContext.Provider>
  );
};

// Custom hook for consuming the alert context
export const useSelectedReview = (): SelectedReviewContextProps => {
  const context = useContext(SelectedReviewContext);
  if (!context) {
    throw new Error("useSelectedReview must be used within a ClientProvider");
  }
  return context;
};