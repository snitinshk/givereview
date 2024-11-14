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
import placeholder from "./placeholder.svg";
import { useToast } from "@/hooks/use-toast";

export default function AddNewChannel({
  setIsAdding,
  setChannels,
  channels,
}: AddChannelProps) {

  const { toast } = useToast();
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelLogo, setNewChannelLogo] = useState(placeholder);
  const [newChannelLogoId, setNewChannelLogoId] = useState("");
  const [channelFile, setChannelFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewChannelLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
      setChannelFile(file);
    }
  };

  const handleCreateChannel = async () => {
    if (newChannelName && channelFile) {
      const uploadPath = `channels/${getFileName(channelFile)}`;
      const { data: uploadData, error: uploadError } = await uploadFile(
        channelFile,
        uploadPath
      );

      if (!uploadError && uploadData?.fullPath && uploadData?.id) {
        const fullPath = mediaUrl(uploadData?.fullPath);
        const logoId = uploadData?.id;
        setNewChannelLogoId(logoId);
        setNewChannelLogo(fullPath);
      }

      const newChannelData = {
        channel_name: newChannelName,
        channel_logo_url: newChannelLogo,
        channel_logo_id: newChannelLogoId,
        channel_type: CHANNEL_TYPE.WIDGET,
      };

      const { data: addedChannel, error: addChannelError } = await addChannel(
        newChannelData
      );

      if (!addChannelError && !uploadError && addedChannel) {
        const [newMappedChannel]: Channel[] = mapChannels(addedChannel);
        setChannels([...channels, newMappedChannel]);
        toast({
          title: "Success!",
          description: `Channel ${newMappedChannel?.name} added successfully`,
        });
      } else {
        toast({
          title: "Error!",
          description: `Something went wrong, please try again later`,
        });
      }

      setNewChannelName("");
      setNewChannelLogo(placeholder);
      setIsAdding(false);
    }
  };

  return (
    <div className="flex w-[calc(50%-10px)] max-w-full items-center space-x-4">
      <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded-md p-1">
        <Image
          src={newChannelLogo}
          alt="New channel logo"
          width={40}
          height={40}
          className="rounded-sm"
        />
      </div>
      <Button
        variant="outline"
        className="bg-gray-100 w-14 h-14 border border-dashed border-gray-300"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon className="h-4 w-4" />
        <span className="sr-only">Upload logo</span>
      </Button>
      <div className="flex-grow flex items-center space-x-2">
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
      <div className="flex space-x-2">
        <Button
          disabled={!newChannelName || !channelFile}
          variant="ghost"
          className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold"
          onClick={handleCreateChannel}
        >
          <CheckIcon className="h-4 w-4" /> Save
          <span className="sr-only">Save new channel</span>
        </Button>
        <Button
          variant="ghost"
          className="text-[#FF5630] hover:bg-[#FF5630] hover:text-white font-bold"
          onClick={() => setIsAdding(false)}
        >
          <XIcon className="h-4 w-4" /> Cancel
          <span className="sr-only">Cancel adding new channel</span>
        </Button>
      </div>
    </div>
  );
}
