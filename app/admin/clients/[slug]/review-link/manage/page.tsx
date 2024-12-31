"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiSettings } from "react-icons/ci";
import SettingTabs from "./settingtabs";
import PositiveTabs from "./positivetabs";
import NegativeTabs from "./negativetabs";
import ThankYouTabs from "./thankyoutabs";
import { getFileName, mediaUrl, uploadFile } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  saveReviewLinkNegativePage,
  saveReviewLinkPositivePage,
  saveReviewLinkSettings,
  saveReviewLinkThankyouPage,
} from "../action";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useReviewLinkSettings } from "@/app/context/review-link-settings.context";
import {
  mapNegativePageDataToDbFormat,
  mapSettingsDbFormat,
} from "@/mappers/index-mapper";
import { useReviewLinkPositive } from "@/app/context/review-link-positive.context";
import { useReviewLinkNegative } from "@/app/context/review-link-negative.context";
import { useReviewLinkThankyou } from "@/app/context/review-link-thankyou.context";
import { useLoader } from "@/app/context/loader.context";
import { useChannels } from "@/app/context/channels-context";
import { CHANNEL_TYPE } from "@/constant";
import { useClients } from "@/app/context/clients-context";

const CreateReviewLink: React.FC = () => {
  const { channels } = useChannels();
  const { reviewLinkSettings } = useReviewLinkSettings();
  const { reviewLinkPositive } = useReviewLinkPositive();
  const { reviewLinkNegative } = useReviewLinkNegative();
  const { reviewLinkThankyou } = useReviewLinkThankyou();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { setIsLoading } = useLoader();

  const reviewLinkId = searchParams.get("review-link");

  const { slug } = useParams();

  const { selectedClient } = useClients();

  const handleSaveReviewLink = async () => {
    if (!reviewLinkPositive?.selectedChannels?.length) {
      toast({ description: "Please select at least one channel!" });
      return;
    }

    setIsLoading(true);

    try {
      // Upload images concurrently
      const [desktopBgImage, thankyouBgImage] = await Promise.all([
        uploadBgImage(reviewLinkSettings?.uploadedFile),
        reviewLinkThankyou?.uploadedFile
          ? uploadBgImage(reviewLinkThankyou.uploadedFile)
          : Promise.resolve(""),
      ]);

      // Prepare data
      const settingsData = mapSettingsDbFormat({
        ...reviewLinkSettings,
        clientId: selectedClient?.id,
        positivePageTitle: reviewLinkPositive?.title,
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

      const thankyouPageData = {
        review_thankyou_title: reviewLinkThankyou?.title,
        review_thankyou_bg_image: thankyouBgImage,
        review_link_id: settings.id,
      };

      // Save all data concurrently
      const results = await Promise.all([
        saveReviewLinkPositivePage(positivePageData),
        saveReviewLinkNegativePage(negativePageData),
        saveReviewLinkThankyouPage(thankyouPageData),
      ]);

      const errors = results.map((result) => JSON.parse(result).error);

      const errorMessages = [
        "Error in saving positive review links, please try again later",
        "Error in saving negative review links, please try again later",
        "Error in saving thankyou review links, please try again later",
      ];

      for (let i = 0; i < errors.length; i++) {
        if (errors[i]) {
          handleSaveError(errors[i], errorMessages[i]);
          return;
        }
      }

      // Success
      toast({ description: "Review link created successfully!" });
      router.push(`/admin/clients/${slug}/review-link/`);
    } catch (err) {
      handleSaveError(err, "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to handle errors
  const handleSaveError = (error: any, fallbackMessage: string) => {
    const errorMessage =
      error?.code === "23505" ? "Duplicate slug" : fallbackMessage;
    toast({ title: errorMessage });
  };

  const uploadBgImage = async (file: File) => {
    const uploadPath = `reviewlinks/${getFileName(file)}`;
    const { data: uploadData, error: uploadError } = await uploadFile(
      file,
      uploadPath
    );

    if (uploadError) {
      toast({
        title: `Error in uploading image, please try again later`,
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
        <div className="mb-8 -mt-12 ml-auto flex justify-end gap-5 max-sm:mt-0">
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
      <div className="flex flex-wrap gap-8 w-full">
        <Tabs defaultValue="settings" className="flex-grow max-w-full">
          <TabsList className="bg-transparent p-0 mb-4 gap-10 [&>button]:px-0 [&>button]:pb-2 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none max-md:px-3 max-md:overflow-x-scroll max-md:flex-nowrap max-md:w-full max-md:gap-4 max-md:justify-start">
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
              channels={channels.filter(
                (channel) => channel?.channelType === CHANNEL_TYPE.REVIEW
              )}
            />
          </TabsContent>
          <TabsContent value="negativepg">
            <NegativeTabs />
          </TabsContent>
          <TabsContent value="thanksyoupg">
            <ThankYouTabs />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CreateReviewLink;
