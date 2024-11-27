"use client";

import { DEFAULT_TEXTS } from "@/constant";
import { useParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { generateUniqueSlug } from "../admin/clients/[slug]/review-link/action";

const ReviewLinkSettingsContext = createContext<any>(null);

export const ReviewLinkSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { slug } = useParams();
  const [uniqueSlug, setUniqueSlug] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        const uniqueSlug = await generateUniqueSlug(slug as string);
        setUniqueSlug(uniqueSlug);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [slug]);

  const [reviewLinkSettings, setReviewLinkSettings] = useState<any>({
    reviewLinkName: "",
    reviewLinkSlug: uniqueSlug,
    reviewLinkHomeTitle: DEFAULT_TEXTS.homeReviewTitle + "" + slug,
    isSkipFirstPageEnabled: false,
    ratingThresholdCount: 4,
    isPoweredByEnabled: true,
    imageFile: "",
  });

  React.useEffect(() => {
    if (slug) {
      setReviewLinkSettings((prev: any) => ({
        ...prev,
        reviewLinkSlug: slug,
      }));
    }
  }, [slug]);

  return (
    <ReviewLinkSettingsContext.Provider
      value={{ reviewLinkSettings, setReviewLinkSettings }}
    >
      {children}
    </ReviewLinkSettingsContext.Provider>
  );
};

// Custom hook for consuming the alert context
export const useReviewLinkSettings = (): any => {
  const context = useContext(ReviewLinkSettingsContext);
  if (!context) {
    throw new Error(
      "useReviewLinkSettings must be used within an ClientProvider"
    );
  }
  return context;
};
