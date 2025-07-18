"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewTable from "./review-table";
import useSWR from "swr";
import { capitalizeFirstLetter, fetcher } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  ExternalReviewDB,
  ReviewDetailDB,
  TransformedReview,
} from "@/interfaces/reviews";
import { mapReviews } from "@/mappers/reviews-mapper";
import { useClients } from "@/app/context/clients-context";
import { useLoader } from "@/app/context/loader.context";
import { getReviewLinkSettings } from "./action";
import { useSearchParams } from "next/navigation";

type SelectItem = {
  id: string | number; // Replace with the actual type of your IDs
  name: string;
};

const ReviewPage: React.FC = () => {
  const [reviews, setReviews] = useState<TransformedReview[]>([]);
  const [externalReviews, setExternalReviews] = useState([]);
  const [reviewLinks, setReviewLinks] = useState([]);

  const searchParams = useSearchParams();
  const filteredClientQuery = searchParams.get("client");
  const filteredReviewLinkQuery = searchParams.get("filteredrl");

  const [filteredExternalReview, setFilteredExternalReview] =
    useState<string>("All");

  const [filteredClient, setFilteredClient] = useState<number | string>(
    filteredClientQuery || "All"
  );

  const [filteredReviewsByRL, setFilteredReviewsByRL] = useState<
    number | string
  >(filteredReviewLinkQuery || "All");

  const { setIsLoading } = useLoader();
  const { toast } = useToast();
  const { clients } = useClients();

  const { data: negativeReviewsList, error: fetchingNegativeReviewsErr } =
    useSWR<ReviewDetailDB[]>("/api/admin/reviews", fetcher);

  const { data: externalReviewsList, error: fetchingExternalReviewsErr } =
    useSWR<ExternalReviewDB[]>("/api/web/external-reviews", fetcher);

  useEffect(() => {
    if (externalReviewsList) {
      const mappedExternalReviews = externalReviewsList?.map(
        (externalReview) => {
          return {
            id: externalReview.id,
            clientId: externalReview.client_id,
            name: externalReview?.reviewers_name,
            image: externalReview?.channels?.channel_logo_url,
            client: externalReview?.clients?.client_name,
            stars: externalReview?.review_count,
            review: externalReview?.review_description,
            date: externalReview?.review_date,
          };
        }
      );

      setExternalReviews(mappedExternalReviews as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalReviewsList]);

  // Map and set reviews once data is fetched
  useEffect(() => {
    if (negativeReviewsList && reviews.length === 0) {
      const mappedReviews = mapReviews(negativeReviewsList);
      setReviews(mappedReviews);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [negativeReviewsList]);

  // Handle errors
  useEffect(() => {
    if (fetchingNegativeReviewsErr || fetchingExternalReviewsErr) {
      toast({ title: "Error in fetching reviews" });
    }
  }, [fetchingNegativeReviewsErr, fetchingExternalReviewsErr, toast]);

  const fetchReviewLinks = useCallback(async () => {
    if (filteredClient !== "All") {
      try {
        setIsLoading(true);
        const response = await getReviewLinkSettings(Number(filteredClient));
        setIsLoading(false);
        const { data: reviewLinks, error } = JSON.parse(response);
        if (error) {
          toast({ title: "Error in fetching review links" });
        } else {
          setReviewLinks(
            reviewLinks?.map((reviewLink: any) => ({
              ...reviewLink,
              name: reviewLink.review_link_name,
            }))
          );
        }
      } catch (err) {
        toast({ title: "Unexpected error occurred" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredClient, getReviewLinkSettings]);

  useEffect(() => {
    fetchReviewLinks();
  }, [fetchReviewLinks]);

  let filteredExternalReviews: any = [];
  let filteredReviews: any = [];

  if (externalReviews?.length) {
    
    filteredExternalReviews = externalReviews?.filter((review: any) => {
      return (
        filteredExternalReview === "All" ||
        filteredExternalReview === review?.clientId.toString()
      );
    });
  }

  if (reviews?.length) {
    filteredReviews = reviews?.filter((review) => {
      const matchesClient =
        filteredClient === "All" || Number(filteredClient) === review?.clientId;

      const matchesReviewsByRL =
        filteredReviewsByRL === "All" ||
        Number(filteredReviewsByRL) === review?.reviewLinkId;

      return matchesClient && matchesReviewsByRL;
    });
  }

  const handleSelectChange = useCallback(
    (newValue: string, placeholder: string) => {
      if (placeholder === "Client") {
        setFilteredClient(newValue);
      } else if (placeholder === "Review link") {
        setFilteredReviewsByRL(newValue);
      } else if (placeholder === "Stream") {
        setFilteredExternalReview(newValue);
      }
    },
    []
  );

  const renderSelect = useCallback(
    (placeholder: string, items: SelectItem[]) => {
      const getValue = () => {
        switch (placeholder) {
          case "Client":
            return filteredClient?.toString();
          case "Review link":
            return filteredReviewsByRL?.toString();
          case "Stream":
            return filteredExternalReview?.toString();
          default:
            return "All";
        }
      };

      const onValueChange = (newValue: string) => {
        handleSelectChange(newValue, placeholder);
      };

      return (
        <div className="w-1/5 max-sm:w-full">
          <Select onValueChange={onValueChange} value={getValue()}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id.toString() ?? "All"}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },
    [
      filteredClient,
      filteredReviewsByRL,
      filteredExternalReview,
      handleSelectChange,
    ]
  );

  // const renderSelect = useCallback(
  //   (placeholder: string, items: SelectItem[]) => {
  //     const onValueChange = (newValue: string) => {
  //       handleSelectChange(newValue, placeholder);
  //     };

  //     return (
  //       <div className="w-1/5 max-sm:w-full">
  //         <Select
  //           onValueChange={onValueChange}
  //           value={filteredClient?.toString()}
  //         >
  //           <SelectTrigger className="h-12">
  //             <SelectValue placeholder={placeholder} />
  //           </SelectTrigger>
  //           <SelectContent>
  //             {items.map((item) => (
  //               <SelectItem key={item.id} value={item.id.toString() ?? "All"}>
  //                 {item.name}
  //               </SelectItem>
  //             ))}
  //           </SelectContent>
  //         </Select>
  //       </div>
  //     );
  //   },
  //   [handleSelectChange]
  // );

  return (
    <div className="bg-white rounded-2xl drop-shadow-cl-box-shadow mb-5">
      <Tabs defaultValue="NegativeTbs" className="flex-grow">
        {/* Tabs List */}
        <TabsList className="w-full flex-wrap rounded-2xl rounded-b-none gap-4 justify-start p-0 pt-3 border-b h-auto border-gray-200 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none">
          <TabsTrigger value="NegativeTbs">Negative (internal)</TabsTrigger>
          <TabsTrigger value="StreamTbs">Stream</TabsTrigger>
        </TabsList>

        {/* NegativeTbs Content */}
        <TabsContent value="NegativeTbs">
          <div className="px-6 pt-6 flex items-center mb-4 gap-4">
            {renderSelect("Client", [{ id: "All", name: "All" }, ...clients])}
            {filteredClient !== "All" &&
              renderSelect("Review link", [
                { id: "All", name: "All" },
                ...reviewLinks,
              ])}
          </div>
          <ReviewTable
            filteredClient={filteredClient.toString()}
            filteredReviewLink={filteredReviewsByRL.toString()}
            reviewType="internal"
            reviews={filteredReviews}
          />
        </TabsContent>

        {/* StreamTbs Content */}
        <TabsContent value="StreamTbs">
          <div className="px-6 pt-6 flex items-center mb-4 gap-4">
            {renderSelect("Stream", [{ id: "All", name: "All" }, ...clients])}
          </div>
          <ReviewTable
            reviewType="external"
            reviews={filteredExternalReviews}
            showImage
            showAction
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewPage;