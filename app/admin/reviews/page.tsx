"use client";

import React, { useEffect, useState } from "react";
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

const ReviewPage: React.FC = () => {
  const [reviews, setReviews] = useState<TransformedReview[]>([]);
  const { toast } = useToast();
  const { clients } = useClients();

  // Fetch reviews using SWR
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
  }, [negativeReviewsList]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({ title: "Error in fetching reviews" });
    }
  }, [error, toast]);

  const [filteredClient, setFilteredClient] = useState<string>("All");

  const filteredReviews = reviews?.filter((review) => {
    const matchesClient =
      filteredClient === "All" || review?.client === filteredClient;
    return matchesClient;
  });

  // Reusable Select Component
  const renderSelect = (placeholder: string, items: string[]) => (
    <div className="w-1/5">
      <Select
        onValueChange={(newValue) => {
          setFilteredClient(newValue);
        }}
      >
        <SelectTrigger className="h-12">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
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
            {renderSelect("Client", [
              "All",
              ...clients?.map((client) => client?.name),
            ])}
            {filteredClient !== "All" &&
              renderSelect("Review link", ["All", "ACTIVE", "INACTIVE"])}
          </div>
          <ReviewTable reviews={filteredReviews} />
        </TabsContent>

        {/* StreamTbs Content */}
        <TabsContent value="StreamTbs">
          <div className="px-6 pt-6 flex items-center mb-4 gap-4">
            {renderSelect("Stream", ["All", "RESTAURANT", "NIGHTCLUB"])}
          </div>
          <ReviewTable reviews={reviews} showImage showAction />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewPage;