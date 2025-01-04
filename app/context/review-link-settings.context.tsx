"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useParams } from "next/navigation";
import { DEFAULT_TEXTS } from "@/constant";
import { generateUniqueSlug } from "../admin/clients/[slug]/review-link/action";
import { useClients } from "./clients-context";

// Define the context type
interface ReviewLinkSettingsContextType {
  reviewLinkSettings: any;
  setReviewLinkSettings: React.Dispatch<
    React.SetStateAction<any>
  >;
}

const ReviewLinkSettingsContext =
  createContext<ReviewLinkSettingsContextType | null>(null);

export const ReviewLinkSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { slug } = useParams();
  const { selectedClient } = useClients();

  const [reviewLinkSettings, setReviewLinkSettings] = useState<any>({
    isActive: true,
    reviewLinkName: "",
    reviewLinkSlug: "",
    title: `${DEFAULT_TEXTS.homeReviewTitle}${selectedClient?.name || ""}`,
    isSkipFirstPageEnabled: false,
    ratingThresholdCount: 4,
    isPoweredByEnabled: true,
    imageFile: "",
  });

  // Update the title when the selected client changes
  useEffect(() => {
    if (selectedClient) {
      setReviewLinkSettings((prev: any) => ({
        ...prev,
        title: `${DEFAULT_TEXTS.homeReviewTitle}${selectedClient.name}`,
      }));
    }
  }, [selectedClient]);

  // Generate a unique slug when the slug changes
  useEffect(() => {
    if (!slug) return;

    const fetchUniqueSlug = async () => {
      try {
        const uniqueSlug = await generateUniqueSlug(slug as string);
        setReviewLinkSettings((prev: any) => ({
          ...prev,
          reviewLinkSlug: uniqueSlug,
        }));
      } catch (error) {
        console.error("Error generating unique slug:", error);
      }
    };

    fetchUniqueSlug();
  }, [slug]);

  return (
    <ReviewLinkSettingsContext.Provider
      value={{ reviewLinkSettings, setReviewLinkSettings }}
    >
      {children}
    </ReviewLinkSettingsContext.Provider>
  );
};

// Custom hook for consuming the context
export const useReviewLinkSettings = (): ReviewLinkSettingsContextType => {
  const context = useContext(ReviewLinkSettingsContext);
  if (!context) {
    throw new Error(
      "useReviewLinkSettings must be used within a ReviewLinkSettingsProvider."
    );
  }
  return context;
};
