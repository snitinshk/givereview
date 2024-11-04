import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadIcon } from "@radix-ui/react-icons";
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ChannelCard({ channel, onEdit }: { 
    channel: { id: number; name: string; logo: string };
    onEdit: (id: number, newName: string, newLogo: string) => void;
  }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedName, setEditedName] = useState(channel.name)
    const [editedLogo, setEditedLogo] = useState(channel.logo)
    const fileInputRef = useRef<HTMLInputElement>(null)
  
    const handleSave = () => {
      onEdit(channel.id, editedName, editedLogo)
      setIsEditing(false)
    }
  
    const handleCancel = () => {
      setEditedName(channel.name)
      setEditedLogo(channel.logo)
      setIsEditing(false)
    }
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setEditedLogo(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  
    return (
      <div className="flex items-center space-x-4">
        <div className="border-2 border-primary rounded-sm p-1">
          <Image
            src={isEditing ? editedLogo : channel.logo}
            alt={`${channel.name} logo`}
            width={40}
            height={40}
            className="rounded-sm"
          />
        </div>
        <div className="flex-grow">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-grow"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon className="h-4 w-4" />
                <span className="sr-only">Upload new logo</span>
              </Button>
            </div>
          ) : (
            <span className="font-medium border-2 border-primary rounded-full px-4 py-2 inline-block">
              {channel.name}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={handleSave}>
                <CheckIcon className="h-4 w-4" />
                <span className="sr-only">Save changes for {channel.name}</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Cancel editing {channel.name}</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Edit {channel.name}</span>
              </Button>
              <Button variant="ghost" size="icon">
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete {channel.name}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }