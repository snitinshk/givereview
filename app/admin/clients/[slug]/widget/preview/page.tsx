"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Slider from "@/components/slider";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useWidget } from "@/app/context/widget-context";
import { useClients } from "@/app/context/clients-context";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import { ExternalReviewDB } from "@/interfaces/reviews";
import { WidgetChannel, WidgetReview } from "@/interfaces/widget";
import { useLoader } from "@/app/context/loader.context";

const TestimonialCompo: React.FC = () => {
  const { widget } = useWidget();
  
  const { selectedClient } = useClients();
  const { toast } = useToast();

  const [externalReviews, setExternalReviews] = useState<WidgetReview[]>([]);
  const [channels, setChannels] = useState<any>([]);
  const [tabs, setTabs] = useState<any>([]);

  // Construct query string for the SWR fetch
  const fetchConditions = widget?.channels
    ?.filter((channel: WidgetChannel) => channel?.isActive)
    ?.map((channel) => ({
      channelId: channel.id,
      ratingThreshold: channel.ratingThreshold,
      totalReviewsToDisplay: widget?.settings?.totalReviewsToDisplay,
    }));

  const widgetsQueryStr =
    fetchConditions?.length && selectedClient?.id
      ? new URLSearchParams({
          conditions: JSON.stringify(fetchConditions),
          clientId: String(selectedClient?.id),
        }).toString()
      : null;

  // Fetch external reviews
  const { data: externalReviewsList, error: fetchingExternalReviewsErr } =
    useSWR<ExternalReviewDB[]>(
      widgetsQueryStr ? `/api/web/external-reviews?${widgetsQueryStr}` : null,
      fetcher
    );

  // Error handling for fetching reviews
  useEffect(() => {
    if (fetchingExternalReviewsErr) {
      console.error(fetchingExternalReviewsErr);
      toast({ title: "Error in fetching preview information" });
    }
  }, [fetchingExternalReviewsErr, toast]);

  // Map external reviews data
  useEffect(() => {
    if (externalReviewsList?.length) {
      const mappedExternalReviews = externalReviewsList.map(
        (externalReview) => ({
          id: externalReview.id,
          clientId: externalReview.client_id,
          reviewersName: externalReview.reviewers_name,
          reviewersAvtar: externalReview.reviewers_avtar,
          channelId: externalReview.channels?.id,
          channelLogo: externalReview.channels?.channel_logo_url,
          channelName: externalReview.channels?.channel_name,
          client: externalReview.clients?.client_name,
          reviewCount: externalReview.review_count,
          reviewDescription: externalReview.review_description,
          reviewDate: externalReview.review_date,
        })
      );

      setExternalReviews(mappedExternalReviews as WidgetReview[]);
    }
  }, [externalReviewsList]);

  // Extract unique channels from external reviews
  useEffect(() => {
    if (externalReviews.length) {
      const channelsMap = new Map(
        externalReviews.map((review) => [
          review.channelId,
          {
            channelName: review.channelName,
            channelLogo: review.channelLogo,
          },
        ])
      );
      setChannels(Array.from(channelsMap));
    }
  }, [externalReviews]);

  // Create tabs for channels
  useEffect(() => {
    if (channels.length) {
      const tabsData = [
        {
          value: "all",
          label: "All",
          platformImage: null,
          testimonials: getFilteredReviews(externalReviews),
        },
        ...channels.map(([channelId, channelInfo]: any) => ({
          value: channelId,
          label: channelInfo.channelName,
          channelLogo: channelInfo.channelLogo,
          testimonials: externalReviews.filter(
            (testimonial) => testimonial.channelId === channelId
          ),
        })),
      ];
      setTabs(tabsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels, externalReviews]);

  // Helper function: Get random reviews
  function getFilteredReviews(reviewsArr: WidgetReview[]) {
    return reviewsArr.slice(0, widget?.settings?.totalReviewsToDisplay || 9);
  }

  if (widget && externalReviewsList && !widget?.settings?.isActive) {
    return (
      <div className="text-center mt-28 text-gray-500 py-8">
        Wiget is Inactive.
      </div>
    );
  } else if (!externalReviewsList?.length) {
    return (
      <div className="text-center mt-28 text-gray-500 py-8">
        No data to display.
      </div>
    );
  }

  return (
    <section className="w-full px-4 py-8">
      <h2 className="text-3xl font-bold text-left mt-4 mb-12">
        {widget?.settings?.widgetTitle}
      </h2>
      <Tabs defaultValue="all">
        {widget?.settings?.showTabs && (
          <TabsList className="flex-wrap gap-4 justify-start border-b border-gray-200 w-full rounded-b-none pt-3 h-auto pb-0">
            {tabs?.map((tab: any) => (
              <TabsTrigger
                key={tab?.value}
                value={tab?.value}
                className="gap-2 pb-2 border-b-2 border-b-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#28a745] data-[state=active]:font-semibold data-[state=active]:border-b-green-600 data-[state=active]:rounded-none"
              >
                {tab.channelLogo && (
                  <Image
                    src={tab?.channelLogo}
                    alt={`${tab?.label} Logo`}
                    width={16}
                    height={16}
                  />
                )}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        {tabs.map((tab: any) => (
          <TabsContent key={tab?.value} value={tab?.value}>
            <Slider testimonials={tab?.testimonials ?? []} />
            {widget?.settings?.showPoweredBy && (
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1 mt-12">
                <span>Powered</span> with{" "}
                <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by place
                booster
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default TestimonialCompo;
