"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Channel, EditChannelData } from "@/interfaces/channels";
// import { getFileName, mediaUrl, uploadFile } from "@/lib/utils";
import { UploadIcon } from "@radix-ui/react-icons";
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { deleteChannel } from "./action";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useChannels } from "@/app/context/channels-context";

export default function ChannelCard({
  channel,
  onEdit,
}: {
  channel: Channel;
  onEdit: (editChannelData: EditChannelData) => void;
}) {
  const { toast } = useToast();
  const { setChannels } = useChannels();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(channel.name);
  const [editedLogo, setEditedLogo] = useState(channel.logo);
  const [channelFile, setChannelFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    
    const editChannelData = {
      channelId: channel.id,
      newName: editedName,
      newLogoFile: channelFile as File,
      newLogo: editedLogo, // base64logo
    };

    onEdit(editChannelData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(channel.name);
    setEditedLogo(channel.logo);
    setIsEditing(false);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
      setChannelFile(file);
    }
  };

  const handleDelete = () => {
    const channelId = channel?.id;

    toast({
      title: "Are you sure you want to delete?",
      description: "This action cannot be undone.",
      variant: "destructive",
      action: (
        <ToastAction
          altText="Delete"
          onClick={() => confirmDelete(Number(channelId))}
        >
          Delete
        </ToastAction>
      ),
      duration: 5000, // 5 seconds
    });
  };

  const confirmDelete = async (channelId: number) => {
    const response = await deleteChannel(channelId);
    const { error } = JSON.parse(response);

    if (!error) {
      toast({
        description: `Channel deleted successfully`,
      });

      setChannels((prevChannels) =>
        prevChannels.filter((channel) => channel.id !== channelId)
      );
    } else {
      toast({
        description: `Error in deleting channel.`,
      });
    }
  };

  return (
    <div className="flex items-center space-x-4 max-sm:space-x-0 max-sm:flex-wrap">
      <div className="bg-gray-100 w-14 h-14 rounded-sm p-3">
        <Image
          src={isEditing ? editedLogo : channel.logo}
          alt={`${channel.name} logo`}
          width={40}
          height={40}
          className="rounded-sm"
        />
      </div>
      {isEditing && (
        <Button
          variant="outline"
          className="bg-gray-100 w-14 h-14 border border-dashed border-gray-300 max-sm:!ml-2 max-sm:!mr-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon className="h-4 w-4" />
          <span className="sr-only">Upload new logo</span>
        </Button>
      )}
      <div className="flex-grow max-sm:w-full max-sm:order-4 max-sm:mt-3">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="flex-grow px-5 h-14"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        ) : (
          <span className="font-medium bg-gray-100 rounded-sm px-4 py-4 text-gray-400 w-full inline-block">
            {editedName || channel.name}
          </span>
        )}
      </div>
      <div className="flex space-x-2 max-sm:space-x-1 max-sm:!ml-auto">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold px-4"
              onClick={handleSave}
            >
              <CheckIcon className="h-4 w-4" /> <span className="max-sm:hidden">Save</span>
              <span className="sr-only">Save changes for {channel.name}</span>
            </Button>
            <Button
              variant="ghost"
              className="text-[#FF5630] hover:bg-[#FF5630] hover:text-white font-bold px-4"
              onClick={handleCancel}
            >
              <XIcon className="h-4 w-4" />  <span className="max-sm:hidden">Cancel</span>
              <span className="sr-only">Cancel editing {channel.name}</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold max-sm:order-2 px-4"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="h-4 w-4" /> <span className="max-sm:hidden">Edit</span>
              <span className="sr-only">Edit {channel.name}</span>
            </Button>
            <Button
              variant="ghost"
              className="text-[#FF5630] hover:bg-[#FF5630] hover:text-white font-bold max-sm:order-3 px-4"
              onClick={handleDelete}
            >
              <TrashIcon className="h-4 w-4" /> <span className="max-sm:hidden">Delete</span>
              <span className="sr-only">Delete {channel.name}</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
