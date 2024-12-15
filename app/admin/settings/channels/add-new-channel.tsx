"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHANNEL_TYPE } from "@/constant";
import { CheckIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { addChannel } from "./action";
import { handleImageUpload, uploadFileToSupabase } from "@/lib/utils";
import { mapChannels } from "@/mappers/index-mapper";
import { AddChannelProps, Channel } from "@/interfaces/channels";
import Image from "next/image";
import placeholder from "../../../images/placeholder.svg";
import { useToast } from "@/hooks/use-toast";
import { useChannels } from "@/app/context/channels-context";
import { useLoader } from "@/app/context/loader.context";

export default function AddNewChannel({ setIsAdding }: AddChannelProps) {
  const { toast } = useToast();
  const { channels, setChannels } = useChannels();
  const { setIsLoading } = useLoader();
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelLogo, setNewChannelLogo] = useState<string>(placeholder);
  const [channelFile, setChannelFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { base64, file, error } = await handleImageUpload(event);
    if (error) {
      toast({
        title: "Invalid file. Please select a valid image file.",
      });
      return;
    }
    setChannelFile(file);
    setNewChannelLogo(base64 as string);
  };

  const handleCreateChannel = async () => {
    // Validate input
    if (!newChannelName || !channelFile) {
      toast({
        title: "Error!",
        description: "Please provide a channel name and logo.",
      });
      return;
    }

    setIsLoading(true);

    // Centralized error handling
    const handleError = (message: string) => {
      toast({ title: "Error!", description: message });
    };

    try {
      // Upload the file
      const { fileUrl, error: uploadError } = await uploadFileToSupabase(
        "channels",
        channelFile
      );

      console.log(uploadError);

      if (uploadError) {
        throw new Error("Error uploading the logo. Please try again.");
      }

      // Create new channel data
      const newChannelData = {
        channel_name: newChannelName,
        channel_logo_url: fileUrl,
        channel_type: CHANNEL_TYPE.REVIEW,
      };

      // Add the new channel
      const { data: addedChannel, error: addChannelError } = await addChannel(
        newChannelData
      );

      if (addChannelError || !addedChannel) {
        throw new Error("Error creating the channel. Please try again.");
      }

      // Update channel list with the new channel
      const [newMappedChannel]: Channel[] = mapChannels(addedChannel);
      setChannels((prevChannels) => [...prevChannels, newMappedChannel]);

      // Show success toast
      toast({
        title: `Channel "${newMappedChannel?.name}" added successfully!`,
      });

      // Reset form
      setNewChannelName("");
      setNewChannelLogo(placeholder);
      setChannelFile(null);
      setIsAdding(false);
    } catch (error: any) {
      handleError(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
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
          <CheckIcon className="h-4 w-4" />{" "}
          <span className="max-sm:hidden">Save</span>
          <span className="sr-only">Save new channel</span>
        </Button>
        <Button
          variant="ghost"
          className="text-[#FF5630] hover:bg-[#FF5630] hover:text-white font-bold"
          onClick={() => setIsAdding(false)}
        >
          <XIcon className="h-4 w-4" />{" "}
          <span className="max-sm:hidden">Cancel</span>
          <span className="sr-only">Cancel adding new channel</span>
        </Button>
      </div>
    </div>
  );
}
