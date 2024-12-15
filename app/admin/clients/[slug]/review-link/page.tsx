"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GGLIMG from "@/app/images/google.svg";
import TRIPIMG from "@/app/images/tripadvisor.svg";
import { BiLinkExternal } from "react-icons/bi";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSelectedClient } from "@/app/context/selected-client-context";
import { useToast } from "@/hooks/use-toast";

import {
  deleteReviewLink,
  generateUniqueSlug,
  getReviewLinks,
  getReviewLinkSettings,
} from "./action";
import {
  DEFAULT_TEXTS,
  reviewLinkNegativeDefaultValue,
  reviewLinkPositiveDefaultValue,
  reviewLinkSettingsDefaultValue,
  reviewLinkThankyouDefaultValue,
} from "@/constant";
import { useReviewLinkSettings } from "@/app/context/review-link-settings.context";
import {
  mapNegativeLinkDefault,
  mapPositivePageUIFormat,
  mapSettingsUIFormat,
  mapThankyouUIFormat,
} from "@/mappers/index-mapper";
import { ToastAction } from "@radix-ui/react-toast";
import { useReviewLinkPositive } from "@/app/context/review-link-positive.context";
import { useReviewLinkNegative } from "@/app/context/review-link-negative.context";
import { useReviewLinkThankyou } from "@/app/context/review-link-thankyou.context";
// import Loading from "@/components/loader/loading";
import { useLoader } from "@/app/context/loader.context";

const ReviewLink: React.FC = (params) => {
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setIsLoading } = useLoader();
  const [hasData, setHasData] = useState<boolean>(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-[#def4e9] text-[#1a806a]";
      case "Inactive":
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const { selectedClient } = useSelectedClient();
  const [reviewLinks, setReviewLinks] = useState([]);

  const { slug } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  /**
   * Fetch review link listing data for selected clients
   */

  useEffect(() => {
    // setIsLoading(true);
    (async () => {
      console.log(selectedClient);
      if (selectedClient) {
        setIsLoading(true);
        const response = await getReviewLinks(selectedClient?.id);
        const { data: reviewLink, error } = JSON.parse(response);
        console.log(reviewLink);
        if (error) {
          toast({ description: "Error in fetching review links." });
        }
        setIsLoading(false);
        setReviewLinks(reviewLink);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient]);

  /**
   * Fetch Settins and assign it to context
   */
  const { setReviewLinkSettings } = useReviewLinkSettings();
  const { setReviewLinkPositive } = useReviewLinkPositive();
  const { setReviewLinkNegative } = useReviewLinkNegative();
  const { setReviewLinkThankyou } = useReviewLinkThankyou();

  const handleEdit: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    const reviewLinkId = event.currentTarget.getAttribute(
      "data-review-link-id"
    );
    setIsLoading(true);
    if (reviewLinkId) {
      await fetchReviewLinkDataForEdit(parseInt(reviewLinkId));

      if (reviewLinkId) {
        router.push(
          `/admin/clients/${slug}/review-link/manage?review-link=${reviewLinkId}`
        );
      }
    }
  };

  const fetchReviewLinkDataForEdit = async (reviewLinkId: number) => {
    const response = await getReviewLinkSettings(reviewLinkId);
    const { error, data: reviewLink } = JSON.parse(response);
    if (error) {
      toast({
        description: `Error in fetching settings, please try again later`,
      });
    }

    const {
      positive_review_link_details,
      negative_review_link_details,
      thankyou_review_link_details,
    } = reviewLink;

    delete reviewLink.positive_review_link_details;
    delete reviewLink.negative_review_link_details;
    delete reviewLink.thankyou_review_link_details;

    setReviewLinkSettings(mapSettingsUIFormat(reviewLink));

    setReviewLinkPositive({
      title: reviewLink?.review_link_positive_title,
      selectedChannels: mapPositivePageUIFormat(positive_review_link_details),
    });

    const negativePageReviewLink: any = mapNegativeLinkDefault(
      negative_review_link_details
    );

    if (negativePageReviewLink) {
      setReviewLinkNegative(negativePageReviewLink);
    }

    const thankyouPageReviewLink = mapThankyouUIFormat(
      thankyou_review_link_details
    );

    setReviewLinkThankyou(thankyouPageReviewLink);
  };

  const handleDelete: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    const reviewLinkId = event.currentTarget.getAttribute(
      "data-review-link-id"
    );

    toast({ description: "This action cannot be undone." });

    toast({
      title: "Are you sure you want to delete?",
      description: "This action cannot be undone.",
      variant: "destructive",
      action: (
        <ToastAction
          altText="Delete"
          onClick={() => confirmDelete(Number(reviewLinkId))}
        >
          Delete
        </ToastAction>
      ),
      duration: 5000, // 5 seconds
    });
  };

  const confirmDelete = async (reviewLinkId: number) => {
    const response = await deleteReviewLink(reviewLinkId);
    const { error } = JSON.parse(response);

    if (!error) {
      toast({
        description: `Review Link deleted successfully.`,
      });

      setReviewLinks((prevChannels) =>
        prevChannels.filter(
          (reviewLink: any) => reviewLink?.id !== reviewLinkId
        )
      );
    } else {
      toast({
        description: `Error in deleting Review Link.`,
      });
    }
  };

  const handleCreateLink = async () => {
    setIsLoading(true);
    // Navigate immediately to provide a responsive user experience
    router.push(`/admin/clients/${slug}/review-link/manage`);

    // Perform the asynchronous operation in the background
    generateUniqueSlug(slug as string).then((uniqueSlug) => {
      setReviewLinkSettings({
        ...reviewLinkSettingsDefaultValue,
        reviewLinkSlug: uniqueSlug,
        title: `${DEFAULT_TEXTS.homeReviewTitle} ${slug}`,
      });
    });

    // Update other state values immediately
    setReviewLinkPositive(reviewLinkPositiveDefaultValue);
    setReviewLinkNegative(reviewLinkNegativeDefaultValue);
    setReviewLinkThankyou(reviewLinkThankyouDefaultValue);
  };
  console.log(`url from reviewlink...${process.env.NEXT_PUBLIC_BASE_URL}`)
  const siteUrl = 'https://reviewbooster.vercel.app/'

  // if (!hasData) {
  //   return (
  //     <div className="flex items-center justify-center p-10">
  //       <p className="text-gray-500 text-xl">No Review links</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <Button
        onClick={handleCreateLink}
        // href={`/admin/clients/${slug}/review-link/manage`}
        className="bg-[#00AB55] text-white text-sm px-4 rounded-lg hover:bg-gray-800 py-2 ml-auto block font-bold mb-8 -mt-12 max-sm:mt-0"
      >
        Create Link
      </Button>
      <div className="space-y-5">
        {reviewLinks.length > 0 ? (
          reviewLinks.map((reviewLink: any) => (
            <div
              key={reviewLink.id}
              className="flex flex-col lg:flex-row items-center justify-between border border-gray-50 p-6 rounded-lg shadow-md"
            >
              <div className="flex space-x-4 mb-4 lg:mb-0 max-sm:w-full">
                {reviewLink?.positive_review_link_details.map(
                  (item: any, index: number) => (
                    <Image
                      key={index}
                      src={item?.channels?.channel_logo_url}
                      alt={`${item?.channels.channel_name} image`}
                      width={32}
                      height={32}
                      className="rounded-md"
                    />
                  )
                )}
                <p className="text-ftClor text-sm font-semibold mt-2 lg:mt-0 max-sm:flex-grow">
                  {reviewLink?.review_link_name}
                </p>
              </div>

              <div className="flex lg:flex-row items-center space-x-0 lg:space-x-6 gap-3 lg:gap-0 mt-2 lg:mt-0 max-sm:w-full max-sm:flex-row">
                <Link
                  href={
                    siteUrl +
                    reviewLink?.review_link_slug
                  }
                  target="_blank"
                  className="bg-[#dde6ff] text-[#1939b7] hover:bg-gray-200 flex gap-1 items-center text-sm font-semibold px-3 py-1 rounded-md "
                >
                  <BiLinkExternal /> Link
                </Link>
                <Badge
                  className={`${getStatusColor(
                    reviewLink.is_active ? "Active" : "Inactive"
                  )} !bottom-0 !shadow-none pointer-events-none px-4 h-7`}
                >
                  {reviewLink?.is_active === true ? "Active" : "Inactive"}
                </Badge>
                <Button
                  data-review-link-id={reviewLink?.id}
                  onClick={handleEdit}
                  variant="ghost"
                  size="sm"
                  className="bg-[#9edcc0] text-[#027b55] px-4 h-7 font-bold !shadow-none"
                >
                  Edit
                </Button>
                <Button
                  data-review-link-id={reviewLink?.id}
                  onClick={handleDelete}
                  variant="ghost"
                  size="sm"
                  className="bg-[#ff5631] text-white px-4 h-7 font-bold !shadow-none"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center border border-gray-200 p-6 rounded-lg shadow-md text-gray-500 mt-44">
            <p className="text-lg font-semibold">No review links available</p>
            <p className="text-sm">Create a review link to get started.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewLink;
