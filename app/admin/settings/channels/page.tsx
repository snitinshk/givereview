"use client";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import ChannelCard from "./channel-card";
import AddNewChannel from "./add-new-channel";
import { updateChannel } from "./action";
import { mapChannels } from "@/mappers/index-mapper";
import { Channel, EditChannelData } from "@/interfaces/channels";
import {
  getFileName,
  mediaUrl,
  uploadFile,
  uploadFileToSupabase,
} from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useChannels } from "@/app/context/channels-context";
import { channel } from "diagnostics_channel";
import { CHANNEL_TYPE } from "@/constant";
import { useLoader } from "@/app/context/loader.context";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ChannelsPage() {
  const { toast } = useToast();

  const { channels, setChannels } = useChannels();
  const { setIsLoading } = useLoader();
  // const [leftColumnChannels, setLeftColumnChannels] = useState<Channel[]>([]);
  // const [rightColumnChannels, setRightColumnChannels] = useState<Channel[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const { leftColumnChannels, rightColumnChannels } = useMemo(() => {
    if (!channels) return { leftColumnChannels: [], rightColumnChannels: [] };

    const reviewChannels = channels.filter(
      (channel) => channel?.channelType === CHANNEL_TYPE.REVIEW
    );
    // setReviewChannels(reviewChannels);

    const midpoint = Math.ceil(reviewChannels.length / 2);
    return {
      leftColumnChannels: reviewChannels.slice(0, midpoint),
      rightColumnChannels: reviewChannels.slice(midpoint),
    };
  }, [channels]);

  // useEffect(()=>{
  //   if(channels){
  //     const filteredChannels = channels?.filter(
  //       (channel) => channel?.channelType === CHANNEL_TYPE.REVIEW
  //     );
  //     setReviewChannels(filteredChannels)
  //   }
  // },[channels])

  // console.log(reviewChannels);

  // useEffect(() => {
  //   if(reviewChannels?.length){
  //     const midpoint = Math.ceil(reviewChannels.length / 2);
  //     setLeftColumnChannels(reviewChannels.slice(0, midpoint));
  //     setRightColumnChannels(reviewChannels.slice(midpoint));
  //   }
  // }, [reviewChannels]);

  const handleEdit = async (editChannelData: EditChannelData) => {
    const { channelId, newName, newLogoFile, newLogo } = editChannelData;
  
    // Find the channel to update
    const channelToUpdate = channels.find((channel) => channel.id === channelId);
    if (!channelToUpdate) {
      toast({ title: "Channel not found." });
      return;
    }
  
    setIsLoading(true);
  
    // Helper function for error toasts
    const showErrorToast = (message: string) => {
      toast({ title: message });
      setIsLoading(false);
    };
  
    try {
      // Determine the updated logo URL
      let updatedLogoUrl = newLogo || channelToUpdate.logo;
  
      if (newLogoFile) {
        const { fileUrl, error } = await uploadFileToSupabase(
          "channels",
          newLogoFile
        );
        if (error) {
          showErrorToast("Error uploading file, please try again later.");
          return;
        }
        updatedLogoUrl = fileUrl;
      }
  
      // Prepare updated channel data
      const updatedChannelData = {
        channel_name: newName || channelToUpdate.name,
        channel_logo_url: updatedLogoUrl,
      };
  
      // Update the channel
      const { error: updateError } = await updateChannel(
        updatedChannelData,
        channelId
      );
  
      if (updateError) {
        showErrorToast("Error updating channel information.");
        return;
      }
  
      // Update state and show success toast
      setChannels((prevChannels) =>
        prevChannels.map((channel) =>
          channel.id === channelId
            ? {
                ...channel,
                name: updatedChannelData.channel_name,
                logo: updatedChannelData.channel_logo_url,
              }
            : channel
        )
      );
  
      toast({ title: "Channel updated successfully." });
    } catch (error) {
      showErrorToast("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto py-8 pr-8 md:pr-16 lg:pr-24 max-sm:pr-0">
      {/* <h1 className="text-3xl font-bold mb-6">Channels</h1> */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {leftColumnChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onEdit={handleEdit}
            />
          ))}
        </div>
        <div className="space-y-4">
          {rightColumnChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>
      <div className="mt-8">
        {isAdding ? (
          <AddNewChannel setIsAdding={setIsAdding} />
        ) : (
          <Button
            variant="ghost"
            onClick={() => setIsAdding(true)}
            className="flex items-center font-bold hover:bg-[#36B37E] hover:text-white py-6"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add new channel</span>
          </Button>
        )}
      </div>
    </div>
  );
}
