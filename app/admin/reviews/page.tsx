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
import { fetcher } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ReviewDetailDB, TransformedReview } from "@/interfaces/i-reviews";
import { mapReviews } from "@/mappers/reviews-mapper";
import { useClients } from "@/app/context/clients-context";
import { useLoader } from "@/app/context/loader.context";
import { getReviewLinkSettings } from "./action";

type SelectItem = {
  id: string | number; // Replace with the actual type of your IDs
  name: string;
};

const ReviewPage: React.FC = () => {
  const [reviews, setReviews] = useState<TransformedReview[]>([]);
  const [reviewLinks, setReviewLinks] = useState([]);
  const { setIsLoading } = useLoader();
  const { toast } = useToast();
  const { clients } = useClients();

  const { data: negativeReviewsList, error } = useSWR<ReviewDetailDB[]>(
    "/api/admin/reviews",
    fetcher
  );

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
    if (error) {
      toast({ title: "Error in fetching reviews" });
    }
  }, [error, toast]);

  const [filteredClient, setFilteredClient] = useState<number | string>("All");
  const [filteredReviewsByRL, setFilteredReviewsByRL] = useState<
    number | string
  >("All");

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
        console.error("Error fetching review links:", err);
        toast({ title: "Unexpected error occurred" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredClient, getReviewLinkSettings]);

  useEffect(() => {
    fetchReviewLinks();
  }, [fetchReviewLinks]);

  const filteredReviews = reviews?.filter((review) => {

    const matchesClient =
      filteredClient === "All" || Number(filteredClient) === review?.clientId;

    const matchesReviewsByRL =
      filteredReviewsByRL === "All" ||
      Number(filteredReviewsByRL) === review?.reviewLinkId;

    return matchesClient && matchesReviewsByRL;
  });

  const handleSelectChange = useCallback(
    (newValue: string, placeholder: string) => {
      if (placeholder === "Client") {
        setFilteredClient(newValue);
      } else if (placeholder === "Review link") {
        setFilteredReviewsByRL(newValue);
      }
    },
    []
  );

  const renderSelect = useCallback(
    (placeholder: string, items: SelectItem[]) => {
      const onValueChange = (newValue: string) => {
        handleSelectChange(newValue, placeholder);
      };

      return (
        <div className="w-1/5 max-sm:w-full">
          <Select onValueChange={onValueChange}>
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
    [handleSelectChange]
  );

  return (
    <div className="bg-white rounded-lg shadow-lg mb-5">
      <Tabs defaultValue="NegativeTbs" className="flex-grow">
        {/* Tabs List */}
        <TabsList className="w-full flex-wrap rounded-b-none gap-4 justify-start p-0 pt-3 border-b h-auto border-gray-200 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none">
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
          <ReviewTable reviews={filteredReviews} />
        </TabsContent>

        {/* StreamTbs Content */}
        <TabsContent value="StreamTbs">
          <div className="px-6 pt-6 flex items-center mb-4 gap-4">
            {/* {renderSelect("Stream", ["All", "RESTAURANT", "NIGHTCLUB"])} */}
          </div>
          <ReviewTable reviews={reviews} showImage showAction />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewPage;
