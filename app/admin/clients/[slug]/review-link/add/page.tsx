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
import { useReviewLink } from "@/app/context/review-link-context";
import { createReviewLink } from "../action";
import { useSelectedClient } from "@/app/context/selected-client-context";

const CreateReviewLink: React.FC = () => {
  const { toast } = useToast();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isMainDivVisible, setIsMainDivVisible] = useState(true); // Add this state
  const { reviewLinkDetail } = useReviewLink();
  const { selectedClient } = useSelectedClient();

  const handleSaveReviewLink = async () => {
    const desktopBgImage = await uploadBgImage(reviewLinkDetail?.imageFile);

    const settingsData = {
      client_id: selectedClient?.id,
      review_link_name: reviewLinkDetail?.reviewLinkName,
      review_link_slug: reviewLinkDetail?.reviewLinkSlug,
      rating_threshold_count: reviewLinkDetail?.starsThreshold,
      review_link_home_title: reviewLinkDetail?.reviewLinkHomeTitle,
      skip_first_page_enabled: reviewLinkDetail?.isSkipFirstPageEnabled,
      desktop_bg_image: desktopBgImage,
    };

    const { data, error } = await createReviewLink({ settingsData });

    if (error) {
      console.log(error);
      toast({
        description: `Error in creating review link, please try again later`,
      });
    }
  };

  const uploadBgImage = async (file: File) => {
    const uploadPath = `reviewlinks/${getFileName(file)}`;
    const { data: uploadData, error: uploadError } = await uploadFile(
      file,
      uploadPath
    );

    if (uploadError) {
      toast({
        description: `Error in uploading client logo, please try again later`,
      });
    }

    return mediaUrl(uploadData?.fullPath as string);
  };

  return (
    <>
      <div className="mb-8 -mt-12 ml-auto flex justify-end gap-5">
        <Button className="bg-[#ffe4de] text-[#b71e17] hover:text-white font-bold">
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
            <SettingTabs disableSaveBtn={setIsDisabled} />
          </TabsContent>
          <TabsContent value="positivepg">
            <PositiveTabs setIsMainDivVisible={setIsMainDivVisible} /> {/* Pass setter */}
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

