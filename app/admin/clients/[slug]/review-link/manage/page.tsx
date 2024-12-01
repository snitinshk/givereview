"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiSettings } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa";
import Image from "next/image";
import PPIMG from "@/app/images/image_1.png";
import SettingTabs from "./settingtabs";
import PositiveTabs from "./positivetabs";
import NegativeTabs from "./negativetabs";
import ThankYouTabs from "./thankyoutabs";
import { fetcher, getFileName, mediaUrl, uploadFile } from "@/lib/utils";
import useSWR from "swr";
import { useToast } from "@/hooks/use-toast";
import {
  saveReviewLinkNegativePage,
  saveReviewLinkPositivePage,
  saveReviewLinkSettings,
  saveReviewLinkThankyouPage,
} from "../action";
import { useSelectedClient } from "@/app/context/selected-client-context";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useReviewLinkSettings } from "@/app/context/review-link-settings.context";
import {
  mapChannels,
  mapNegativePageDataToDbFormat,
  mapSettingsDbFormat,
} from "@/mappers";
import { useReviewLinkPositive } from "@/app/context/review-link-positive.context";
import { useReviewLinkNegative } from "@/app/context/review-link-negative.context";
import { useReviewLinkThankyou } from "@/app/context/review-link-thankyou.context";

const CreateReviewLink: React.FC = () => {
  const { data: channelList, error } = useSWR("/api/admin/channel", fetcher);
  const { reviewLinkSettings } = useReviewLinkSettings();
  const { reviewLinkPositive } = useReviewLinkPositive();
  const { reviewLinkNegative } = useReviewLinkNegative();
  const { reviewLinkThankyou } = useReviewLinkThankyou();

  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const reviewLinkId = searchParams.get("review-link");
  
  const { slug } = useParams();

  const [isMainDivVisible, setIsMainDivVisible] = useState(true); // Add this state

  const { selectedClient } = useSelectedClient();

  const handleSaveReviewLink = async () => {

    // Validate selected channels 
    if (!reviewLinkPositive?.selectedChannels?.length) {
      toast({ description: "Please select at least one channel!" });
      return;
    }

    try {
      // Upload desktop background image
      const desktopBgImage = await uploadBgImage(
        reviewLinkSettings?.uploadedFile
      );

      // Prepare and save settings data
      const settingsData = mapSettingsDbFormat({
        ...reviewLinkSettings,
        clientId: selectedClient?.id,
        title: reviewLinkPositive?.title,
        desktopBgImage,
      });

      const { data: settings, error: settingsError } =
        await saveReviewLinkSettings(settingsData);
      if (settingsError) {
        handleSaveError(
          settingsError,
          "Error in creating review link, please try again later"
        );
        return;
      }

      // Prepare positive and negative review link data
      const positivePageData = reviewLinkPositive.selectedChannels.map(
        (channel: any) => ({
          channel_id: channel.id,
          channel_review_link: channel.link,
          review_link_id: settings.id,
        })
      );

      const negativePageData = mapNegativePageDataToDbFormat({
        ...reviewLinkNegative,
        reviewLinkId: settings.id,
      });
      
      let thankyouBgImage;
      if(reviewLinkThankyou?.uploadedFile){
        thankyouBgImage = await uploadBgImage(reviewLinkThankyou?.uploadedFile);
      }
      
      const thankyouPageData = {
        review_thankyou_title:reviewLinkThankyou?.title,
        review_thankyou_bg_image: thankyouBgImage ?? '',
        review_link_id: settings.id,
      }
  

      // Trigger both saves concurrently
      const [positiveReviewLinkResult, negativeReviewLinkResult, thankyouReviewLinkResult] =
        await Promise.all([
          saveReviewLinkPositivePage(positivePageData),
          saveReviewLinkNegativePage(negativePageData),
          saveReviewLinkThankyouPage(thankyouPageData),
        ]);
        
      const { error: positiveReviewLinkError } = JSON.parse(positiveReviewLinkResult);
      const { error: negativeReviewLinkError } = JSON.parse(negativeReviewLinkResult);
      const { error: thankyouReviewLinkError } = JSON.parse(thankyouReviewLinkResult);

      // Handle errors for either save
      if (positiveReviewLinkError) {
        toast({
          description:
            "Error in saving positive review links, please try again later",
        });
        return;
      }

      if (negativeReviewLinkError) {
        toast({
          description:
            "Error in saving negative review links, please try again later",
        });
        return;
      }

      if (thankyouReviewLinkError) {
        toast({
          description:
            "Error in saving thankyou review links, please try again later",
        });
        return;
      }
      // Success toast and redirection
      toast({ description: "Review link created successfully!" });
      router.push(`/admin/clients/${slug}/review-link/`);

    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        description: "An unexpected error occurred, please try again later",
      });
    }
  };

  // Helper function to handle errors
  const handleSaveError = (error: any, fallbackMessage: string) => {
    const errorMessage =
      error?.code === "23505" ? "Duplicate slug" : fallbackMessage;
    toast({ description: errorMessage });
  };

  const uploadBgImage = async (file: File) => {
    const uploadPath = `reviewlinks/${getFileName(file)}`;
    const { data: uploadData, error: uploadError } = await uploadFile(
      file,
      uploadPath
    );

    if (uploadError) {
      toast({
        description: `Error in uploading image, please try again later`,
      });
    }

    return mediaUrl(uploadData?.fullPath as string);
  };

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const reviewLinkName = reviewLinkSettings?.reviewLinkName == "";
    const reviewLinkBgImage =
      typeof reviewLinkSettings?.uploadedFile === "object";
    setIsDisabled(reviewLinkName || !reviewLinkBgImage);
  }, [reviewLinkSettings?.uploadedFile, reviewLinkSettings?.reviewLinkName]);

  return (
    <>
      {!reviewLinkSettings?.reviewLinkId && (
        <div className="mb-8 -mt-12 ml-auto flex justify-end gap-5">
          <Button
            onClick={() => router.back()}
            className="bg-[#ffe4de] text-[#b71e17] hover:text-white font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveReviewLink}
            disabled={isDisabled}
            className="bg-[#d6f2e4] text-[#027b55] hover:text-white font-bold"
          >
            Save
          </Button>
        </div>
      )}
      <div className="flex flex-wrap gap-8">
        <Tabs defaultValue="settings" className="flex-grow">
          <TabsList className="bg-transparent p-0 mb-4 gap-10 [&>button]:px-0 [&>button]:pb-2 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none">
            <TabsTrigger value="settings">
              <CiSettings className="text-2xl mr-1" />
              1-Settings
            </TabsTrigger>
            <TabsTrigger value="positivepg">2-Positive page</TabsTrigger>
            <TabsTrigger value="negativepg">3-Negative page</TabsTrigger>
            <TabsTrigger value="thanksyoupg">4-Thank you</TabsTrigger>
          </TabsList>
          <TabsContent value="settings">
            <SettingTabs />
          </TabsContent>
          <TabsContent value="positivepg">
            <PositiveTabs
              channels={mapChannels(channelList)}
              setIsMainDivVisible={setIsMainDivVisible}
            />
          </TabsContent>
          <TabsContent value="negativepg">
            <NegativeTabs />
          </TabsContent>
          <TabsContent value="thanksyoupg">
            <ThankYouTabs />
          </TabsContent>
        </Tabs>
        {isMainDivVisible && ( // Conditional rendering
          <div className="mt-14 w-1/2 min-h-[450px] max-h-[750px] bg-[#FFFAFA] border border-[#F2DDDD] rounded-3xl flex items-center justify-center p-11 flex-col gap-10">
            <Image src={PPIMG} alt={`Priview Image`} width={145} height={145} />
            <p>How was your experience with Silvis?</p>
            <div className="flex gap-3">
              <FaRegStar className="text-3xl" />
              <FaRegStar className="text-3xl" />
              <FaRegStar className="text-3xl" />
              <FaRegStar className="text-3xl" />
              <FaRegStar className="text-3xl" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateReviewLink;