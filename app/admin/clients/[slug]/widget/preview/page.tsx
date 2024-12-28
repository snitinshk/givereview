"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { testimonials } from "@/components/data/testimonialsData";
import Slider from "@/components/slider";
import Image from "next/image";
import useSWR from "swr";
import { ExternalReview, ExternalReviewDB } from "@/interfaces/reviews";
import { fetcher } from "@/lib/utils";
import { WidgetReview, WidgetSettings } from "@/interfaces/widget";
import { useWidget } from "@/app/context/widget-context";
import { useClients } from "@/app/context/clients-context";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

const TestimonialCompo: React.FC = () => {
  const { widget } = useWidget();
  const { selectedClient } = useClients();
  const { toast } = useToast();

  const fetchConditions = widget?.channels
    ?.filter((channel) => channel?.isActive)
    ?.map((channel) => ({
      channelId: channel.id,
      ratingThreshold: channel.ratingThreshold,
      totalReviewsToDisplay: widget?.settings?.totalReviewsToDisplay,
    }));

  let widgetsQueryStr;

  if (fetchConditions?.length && selectedClient?.id) {
    const params = {} as any;
    params["conditions"] = JSON.stringify(fetchConditions);
    params["clientId"] = selectedClient?.id;
    widgetsQueryStr = new URLSearchParams(params).toString();
  }

  const [externalReviews, setExternalReviews] = useState<WidgetReview[]>([]);

  const { data: externalReviewsList, error: fetchingExternalReviewsErr } =
    useSWR<ExternalReviewDB[]>(
      widgetsQueryStr ? `/api/web/external-reviews?${widgetsQueryStr}` : null, // Key is null until `activeChannelIds` is ready
      fetcher
    );

  if (fetchingExternalReviewsErr) {
    console.log(fetchingExternalReviewsErr);
    toast({ title: "Error in fetching preview information" });
    return;
  }

  useEffect(() => {
    if (externalReviewsList?.length) {
      const mappedExternalReviews = externalReviewsList?.map(
        (externalReview) => {
          return {
            id: externalReview.id,
            clientId: externalReview.client_id,
            reviewersName: externalReview?.reviewers_name,
            reviewersAvtar: externalReview?.reviewers_avtar,
            channelId: externalReview?.channels?.id,
            channelLogo: externalReview?.channels?.channel_logo_url,
            channelName: externalReview?.channels?.channel_name,
            client: externalReview?.clients?.client_name,
            reviewCount: externalReview?.review_count,
            reviewDescription: externalReview?.review_description,
            reviewDate: externalReview?.review_date,
          };
        }
      );
      setExternalReviews(mappedExternalReviews as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalReviewsList]);

  const [channels, setChannels] = useState<any>([]);

  useEffect(() => {
    if (externalReviews) {
      const channels = Array.from(
        new Map(
          externalReviews.map((externalReview) => [
            externalReview?.channelId, // Key
            {
              channelName: externalReview?.channelName,
              channelLogo: externalReview?.channelLogo,
            }, // Value as an object
          ])
        )
      );
      setChannels(channels);
    }
  }, [externalReviews]);

  const [tabs, setTabs] = useState<any>([]);

  useEffect(() => {
    if (channels) {
      const tabs = [
        {
          value: "all",
          label: "All",
          platformImage: null, // No specific image for 'All'
          testimonials: getRandomResults(externalReviews),
        },
        ...channels.map(([channelId, channelInfo]: any) => ({
          value: channelId,
          label: channelInfo?.channelName,
          channelLogo: channelInfo?.channelLogo,
          testimonials: externalReviews.filter(
            (testimonial) => testimonial?.channelId === channelId
          ),
        })),
      ];
      setTabs(tabs);
    }
  }, [channels]);

  function getRandomResults(reviewsArr: WidgetReview[]) {
    // Shuffle the array
    const shuffledArray = [...reviewsArr].sort(() => Math.random() - 0.5);
    // Slice the first 'count' elements
    return shuffledArray.slice(0, widget?.settings?.totalReviewsToDisplay);
  }

  return (
    <section className="w-full px-4 py-8">
      <h2 className="text-3xl font-bold text-left mt-4 mb-12">
        {widget?.settings?.widgetTitle}
      </h2>
      <Tabs defaultValue="all">
        {widget?.settings?.showTabs && (
          <TabsList className="w-full flex-wrap rounded-b-none gap-4 justify-start p-0 pt-3 border-b h-auto border-gray-200 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none max-sm:px-3 max-sm:overflow-x-scroll max-sm:flex-nowrap">
            {tabs?.map((tab: any) => (
              <TabsTrigger
                key={tab?.value}
                value={tab?.value}
                className="px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 hover:bg-gray-100"
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
          <TabsContent
            key={tab?.value}
            value={tab?.value}
            className="flex flex-col w-full"
          >
            <Slider testimonials={tab?.testimonials ?? []} />

            {widget?.settings?.showPoweredBy && (
              <div className="font-MOSTR text-sm text-gray-600 flex items-center gap-1 relative left-1/2 top-10 -translate-x-1/2 w-full justify-center">
                <span className="font-medium">Powered</span> with{" "}
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
