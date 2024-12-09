"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import ChannelCard from "./channel-card";
import AddNewChannel from "./add-new-channel";
import { updateChannel } from "./action";
import { mapChannels } from "@/mappers/index-mapper";
import { Channel, EditChannelData } from "@/interfaces/channels";
import { getFileName, mediaUrl, uploadFile } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ChannelsPage() {

  const { toast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [leftColumnChannels, setLeftColumnChannels] = useState<Channel[]>([]);
  const [rightColumnChannels, setRightColumnChannels] = useState<Channel[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const { data: channelList, error } = useSWR("/api/admin/channel", fetcher);

  if (error) {
    toast({
      title: "Error!",
      description: `Error in fetching channels list, please try again later`,
    });
  }

  useEffect(() => {
    if (channelList) {
      const mappedChannels = mapChannels(channelList);
      setChannels(mappedChannels);
    }
  }, [channelList]);

  useEffect(() => {
    const midpoint = Math.ceil(channels.length / 2);
    setLeftColumnChannels(channels.slice(0, midpoint));
    setRightColumnChannels(channels.slice(midpoint));
  }, [channels]);

  const handleEdit = async (editChannelData: EditChannelData) => {
    
    const { channelId, newName, newLogoFile, newLogo } = editChannelData;
    const channelToUpdate = channels.find(
      (channel) => channel.id === channelId
    );
    let updatedLogoUrl = newLogo ?? channelToUpdate?.logo;

    if (newLogoFile) {
      const uploadPath = `channels/${getFileName(newLogoFile)}`;
      const { data: uploadData, error: uploadError } = await uploadFile(
        newLogoFile,
        uploadPath
      );
      if (!uploadError && uploadData?.fullPath) {
        updatedLogoUrl = mediaUrl(uploadData.fullPath);
      } else {
        toast({
          title: "Error!",
          description: `Error in uploading file, please try again later.`,
        });
        return;
      }
    }

    const updatedChannelData = {
      channel_name: newName ?? channelToUpdate?.name,
      channel_logo_url: updatedLogoUrl,
    };
    
    const { error: updateError } = await updateChannel(
      updatedChannelData,
      channelId
    );
    
    if (!updateError) {
      
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
      toast({
        title: "Success!",
        description: `Channel updated successfully.`,
      });

    } else {
      toast({
        title: "Error!",
        description: `Error in updating channel information.`,
      });
    }
  };

  return (
    <div className="container mx-auto py-8 pr-8 md:pr-16 lg:pr-24">
      <h1 className="text-3xl font-bold mb-6">Channels</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {leftColumnChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              setChannels={setChannels}
              channel={channel}
              onEdit={handleEdit}
            />
          ))}
        </div>
        <div className="space-y-4">
          {rightColumnChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              setChannels={setChannels}
              channel={channel}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>
      <div className="mt-8">
        {isAdding ? (
          <AddNewChannel
            channels={channels}
            setChannels={setChannels}
            setIsAdding={setIsAdding}
          />
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
