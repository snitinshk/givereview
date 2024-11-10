'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Channel, EditChannelData } from "@/interfaces/channels";
// import { getFileName, mediaUrl, uploadFile } from "@/lib/utils";
import { UploadIcon } from "@radix-ui/react-icons";
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";


export default function ChannelCard({ channel, onEdit }: {
  channel: Channel;
  onEdit: (editChannelData: EditChannelData) => void;
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(channel.name)
  const [editedLogo, setEditedLogo] = useState(channel.logo)
  const [channelFile, setChannelFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {

    const editChannelData = {
      channelId: channel.id,
      newName: editedName,
      newLogoFile: channelFile as File,
      newLogo: editedLogo, // base64logo
    }

    onEdit(editChannelData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedName(channel.name)
    setEditedLogo(channel.logo)
    setIsEditing(false)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
      setChannelFile(file)

    }
  }

  const handleDelete = () => {

  }

  return (
    <div className="flex items-center space-x-4">
      <div className="bg-gray-100 w-14 h-14 rounded-sm p-3">
        <Image
          src={isEditing ? editedLogo : channel.logo}
          alt={`${channel.name} logo`}
          width={40}
          height={40}
          className="rounded-sm"
        />
      </div>
      {isEditing && <Button
        variant="outline"
        className="bg-gray-100 w-14 h-14 border border-dashed border-gray-300"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon className="h-4 w-4" />
        <span className="sr-only">Upload new logo</span>
      </Button>
      }
      <div className="flex-grow">
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
            {channel.name}
          </span>
        )}
      </div>
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <Button variant="ghost" className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold" onClick={handleSave}>
              <CheckIcon className="h-4 w-4" /> Save
              <span className="sr-only">Save changes for {channel.name}</span>
            </Button>
            <Button variant="ghost" className="text-[#FF5630] hover:bg-[#FF5630] hover:text-white font-bold"  onClick={handleCancel}>
              <XIcon className="h-4 w-4" />  Cancel
              <span className="sr-only">Cancel editing {channel.name}</span>
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold" onClick={() => setIsEditing(true)}>
              <PencilIcon className="h-4 w-4" /> Edit
              <span className="sr-only">Edit {channel.name}</span>
            </Button>
            <Button variant="ghost" className="text-[#FF5630] hover:bg-[#FF5630] hover:text-white font-bold" onClick={handleDelete}>
              <TrashIcon className="h-4 w-4" /> Delete
              <span className="sr-only">Delete {channel.name}</span>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}