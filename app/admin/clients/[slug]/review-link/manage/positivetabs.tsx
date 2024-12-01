import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import EditableField from "./editable";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Channel } from "@/interfaces/channels";
import { useReviewLinkPositive } from "@/app/context/review-link-positive.context";
import { isValidUrl } from "@/lib/utils";
import {
  deletePositiveReviewLink,
  deletePositiveReviewLinkByRLId,
  saveReviewLinkPositivePage,
  updateReviewLink,
} from "../action";
import { useToast } from "@/hooks/use-toast";
import { useReviewLinkSettings } from "@/app/context/review-link-settings.context";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { mapPositivePageDBFormat, mapPositivePageUIFormat } from "@/mappers";

export interface SelectedChannel {
  id: number;
  logo: string;
  name: string;
  link?: string;
}

interface PositiveTabsProps {
  setIsMainDivVisible: React.Dispatch<React.SetStateAction<boolean>>;
  channels: Channel[];
}

const PositiveTabs: React.FC<PositiveTabsProps> = ({
  setIsMainDivVisible,
  channels,
}) => {
  const { reviewLinkPositive, setReviewLinkPositive } = useReviewLinkPositive();

  const { reviewLinkSettings } = useReviewLinkSettings();
  const { toast } = useToast();

  const [title, settitle] = useState(reviewLinkPositive?.title);
  const [selectedChannels, setSelectedChannels] = useState<SelectedChannel[]>(
    reviewLinkPositive?.selectedChannels || []
  );
  const [channelLinks, setChannelLinks] = useState<{ [key: number]: string }>(
    {}
  );
  const [newChannels, setNewChannels] = useState<SelectedChannel[]>(
    channels.filter((ch) => !selectedChannels.some((sel) => sel.id === ch.id))
  );
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingPositiveTitle, setEditingPositiveTitle] = useState(false);
  const [showMainContent, setShowMainContent] = useState(true);

  // Update review link positive data in context
  useEffect(() => {
    setReviewLinkPositive({
      title,
      selectedChannels,
    });
  }, [title, selectedChannels]);

  const handleEdit = (id: number, currentLink: string) => {
    setEditingItemId(id);
    setChannelLinks({ [id]: currentLink });
  };

  const handleSave = async (id: number) => {
    const updatedLink = channelLinks[id];
    const updatedChannels = selectedChannels.map((ch) =>
      ch.id === id ? { ...ch, link: updatedLink } : ch
    );

    setSelectedChannels(updatedChannels);
    setEditingItemId(null);
    setChannelLinks({});

    const itemToUpdate: any = selectedChannels.find((ch) => ch.id === id);

    if (itemToUpdate?.positiveRLId) {
      const response = await updateReviewLink(
        "positive_review_link_details",
        { channel_review_link: updatedLink },
        { col: "id", val: itemToUpdate.positiveRLId }
      );
      const { error } = JSON.parse(response);
      if (!error) {
        toast({ description: "Field updated" });
      }
    }
  };

  const handleDelete = async (id: number) => {
    // Find the channel to delete
    const itemToDelete: any = selectedChannels.find((ch) => ch.id === id);

    // Remove the channel from the selected list
    const remainingChannels = selectedChannels.filter((ch) => ch.id !== id);
    setSelectedChannels(remainingChannels);

    // Add the channel back to the new channels list
    setNewChannels((prev) => [...prev, itemToDelete]);

    if (itemToDelete?.positiveRLId) {
      // Perform backend deletion
      const response = await deletePositiveReviewLink(
        itemToDelete.positiveRLId
      );
      const { error } = JSON.parse(response);
      if (!error) {
        toast({ description: "Deleted successfully" });
      }
    }
  };

  const handleAddNewChannel = async (channel: SelectedChannel) => {
    const newLink = channelLinks[channel.id];
    if (!isValidUrl(newLink)) return;

    const updatedChannels = [
      ...selectedChannels,
      { ...channel, link: newLink },
    ];

    setSelectedChannels(updatedChannels);
    setNewChannels((prev) => prev.filter((ch) => ch.id !== channel.id));
    setShowMainContent(true);
    setIsMainDivVisible(true);
    setChannelLinks({});

    //If Edit case, delete existing channels and add
    if (reviewLinkSettings?.reviewLinkId) {
      const response = await deletePositiveReviewLinkByRLId(
        reviewLinkSettings?.reviewLinkId
      );
      const { error: deletePositiveRlErr } = JSON.parse(response);
      if (!deletePositiveRlErr) {
        const channelsWithReviewId = updatedChannels.map((channel) => {
          return {
            ...channel,
            reviewLinkId: reviewLinkSettings?.reviewLinkId,
          };
        });
        const response = await saveReviewLinkPositivePage(
          mapPositivePageDBFormat(channelsWithReviewId)
        );
        const { error: addPositiveRlErr, data: positiveRLdata } = JSON.parse(response);
        if (!addPositiveRlErr) {
          
          setSelectedChannels(mapPositivePageUIFormat(positiveRLdata));
          toast({ description: "Channels updated" });
          return;
        }
      }
    }
  };

  const handleUpdateReviewLinkSettings = async (updateInfo: any) => {
    if (!reviewLinkSettings?.reviewLinkId) return;

    const response = await updateReviewLink(
      "setting_review_link_details",
      updateInfo,
      { col: "id", val: reviewLinkSettings.reviewLinkId }
    );
    const { error } = JSON.parse(response);

    if (!error) {
      toast({ description: "Field updated" });
    }
  };


  const handleLinkChange = (id: number, value: string) => {
    setChannelLinks((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <>
      {showMainContent ? (
        <div className="flex flex-col gap-5 items-start">
          <div className="max-w-xl">
            <EditableField
              isEditing={editingPositiveTitle}
              value={title}
              onEdit={() => setEditingPositiveTitle(true)}
              onSave={(newValue) => {
                handleUpdateReviewLinkSettings({
                  review_link_positive_title: newValue,
                });
                settitle(newValue);
                setEditingPositiveTitle(false);
              }}
              onCancel={() => setEditingPositiveTitle(false)}
              renderValue={<p className="text-black">{title}</p>}
            />
          </div>

          <div className="w-full flex flex-col gap-8 max-w-xl">
            {selectedChannels.map((channel) => (
              <div
                key={channel.id}
                className="flex gap-5 items-center flex-wrap rounded-md"
              >
                <div className="bg-gray-100 w-80 h-14 rounded-lg p-3 flex items-center">
                  <Image
                    src={channel.logo}
                    alt={`${channel.name} logo`}
                    width={40}
                    height={40}
                    className="rounded-sm"
                  />
                  <span className="flex-grow text-center font-semibold">
                    {channel.name}
                  </span>
                </div>
                {editingItemId === channel.id ? (
                  <div className="w-full">
                    <Input
                      value={channelLinks[channel.id] || ""}
                      onChange={(e) =>
                        handleLinkChange(channel.id, e.target.value)
                      }
                      className="h-12 w-full"
                      autoFocus
                    />
                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="ghost"
                        className="text-red-600 font-bold"
                        onClick={() => {
                          setEditingItemId(null);
                          setChannelLinks({});
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={!isValidUrl(channelLinks[channel.id])}
                        variant="ghost"
                        className="text-black font-bold"
                        onClick={() => handleSave(channel.id)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      className="text-green-600 font-bold"
                      onClick={() => handleEdit(channel.id, channel.link || "")}
                    >
                      <PencilIcon className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-600 font-bold"
                      onClick={() => handleDelete(channel.id)}
                    >
                      <TrashIcon className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {newChannels?.length > 0 && <Button
            variant="ghost"
            className="flex items-center font-bold text-green-600 mt-5"
            onClick={() => {
              setShowMainContent(false);
              setIsMainDivVisible(false);
            }}
          >
            <PlusIcon className="h-4 w-4" />
            Add new channel
          </Button>
          }
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {newChannels.map((channel) => (
            <div key={channel.id} className="flex flex-col gap-4 items-start">
              <div className="bg-gray-100 w-full h-14 rounded-lg p-3 flex items-center">
                <Image
                  src={channel.logo}
                  alt={`${channel.name} logo`}
                  width={40}
                  height={40}
                  className="rounded-sm"
                />
                <span className="flex-grow text-center font-semibold">
                  {channel.name}
                </span>
              </div>
              <Input
                value={channelLinks[channel.id] || ""}
                onChange={(e) => handleLinkChange(channel.id, e.target.value)}
                className="h-12 w-full"
                placeholder="Enter URL"
              />
              <Button
                disabled={!isValidUrl(channelLinks[channel.id])}
                variant="ghost"
                className="text-black font-bold"
                onClick={() => handleAddNewChannel(channel)}
              >
                Add Channel
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PositiveTabs;