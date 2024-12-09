"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHANNEL_TYPE } from "@/constant";
import { CheckIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { addChannel } from "./action";
import { getFileName, mediaUrl, uploadFile } from "@/lib/utils";
import { mapChannels } from "@/mappers";
import { AddChannelProps, Channel } from "@/interfaces/channels";
import Image from "next/image";
import placeholder from "../../../images/placeholder.svg";
import { useToast } from "@/hooks/use-toast";

export default function AddNewChannel({
  setIsAdding,
  setChannels,
  channels,
}: AddChannelProps) {

  const { toast } = useToast();
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelLogo, setNewChannelLogo] = useState<string>(placeholder);
  const [channelFile, setChannelFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewChannelLogo(reader.result as string);
      reader.readAsDataURL(file);
      setChannelFile(file);
    } else {
      toast({
        title: "Error!",
        description: "Invalid file. Please select a valid image file.",
      });
    }
  };

  const handleCreateChannel = async () => {
    if (!newChannelName || !channelFile) {
      toast({
        title: "Error!",
        description: "Please provide a channel name and logo.",
      });
      return;
    }

    try {
      // Upload the file
      const uploadPath = `channels/${getFileName(channelFile)}`;
      const { data: uploadData, error: uploadError } = await uploadFile(
        channelFile,
        uploadPath
      );

      if (uploadError || !uploadData?.fullPath || !uploadData?.id) {
        throw new Error("Error uploading the logo. Please try again.");
      }

      const newChannelData = {
        channel_name: newChannelName,
        channel_logo_url: mediaUrl(uploadData.fullPath),
        channel_logo_id: uploadData.id,
        channel_type: CHANNEL_TYPE.REVIEW,
      };

      // Add the new channel
      const { data: addedChannel, error: addChannelError } = await addChannel(
        newChannelData
      );

      if (addChannelError || !addedChannel) {
        throw new Error("Error creating the channel. Please try again.");
      }

      // Update the channels list
      const [newMappedChannel]: Channel[] = mapChannels(addedChannel);
      setChannels([...channels, newMappedChannel]);

      toast({
        title: "Success!",
        description: `Channel "${newMappedChannel?.name}" added successfully!`,
      });

      // Reset form
      setNewChannelName("");
      setNewChannelLogo(placeholder);
      setChannelFile(null);
      setIsAdding(false);
      
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className="flex w-[calc(50%-10px)] max-w-full items-center space-x-4 max-sm:space-x-0 max-sm:flex-wrap max-sm:gap-2 max-sm:w-full">
      {/* Logo Preview */}
      <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded-md p-1">
        <Image
          src={newChannelLogo}
          alt="New channel logo"
          width={40}
          height={40}
          className="rounded-sm"
        />
      </div>

      {/* Upload Button */}
      <Button
        variant="outline"
        className="bg-gray-100 w-14 h-14 border border-dashed border-gray-300"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon className="h-4 w-4" />
        <span className="sr-only">Upload logo</span>
      </Button>

      {/* Input Fields */}
      <div className="flex-grow flex items-center space-x-2 max-sm:w-full max-sm:space-x-0 max-sm:!ml-0 max-sm:order-3">
        <Input
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          placeholder="Channel name"
          className="flex-grow px-5 h-14"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleNewLogoUpload}
          className="hidden"
          accept="image/*"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 max-sm:order-2 max-sm:!ml-auto">
        <Button
          disabled={!newChannelName || !channelFile}
          variant="ghost"
          className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold"
          onClick={handleCreateChannel}
        >
          <CheckIcon className="h-4 w-4" /> <span className="max-sm:hidden">Save</span>
          <span className="sr-only">Save new channel</span>
        </Button>
        <Button
          variant="ghost"
          className="text-[#FF5630] hover:bg-[#FF5630] hover:text-white font-bold"
          onClick={() => setIsAdding(false)}
        >
          <XIcon className="h-4 w-4" /> <span className="max-sm:hidden">Cancel</span>
          <span className="sr-only">Cancel adding new channel</span>
        </Button>
      </div>
    </div>
  );
}
