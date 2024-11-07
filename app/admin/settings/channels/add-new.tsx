'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHANNEL_TYPE } from "@/constant";
import { CheckIcon, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { addChannel } from "./action";
import { mediaUrl, uploadFile } from "@/lib/utils";
import placeholder from "./placeholder.svg"

export default function AddNewChannel({ setIsAdding }) {

    const [channels, setChannels] = useState()
    const [newChannelName, setNewChannelName] = useState('')
    const [newChannelLogo, setNewChannelLogo] = useState(placeholder)
    const [newChannelLogoId, setNewChannelLogoId] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleNewLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setNewChannelLogo(reader.result as string)
            }
            reader.readAsDataURL(file)

            const { data, error } = await uploadFile(file, 'channels');

            if (!error && data?.fullPath && data?.id) {
                const fullPath = mediaUrl(data?.fullPath);
                const logoId = data?.id;
                setNewChannelLogoId(logoId);
                setNewChannelLogo(fullPath);
            }
        }
    }

    const handleCreateChannel = async () => {

        if (newChannelName) {

            const newChannelData = {
                channel_name: newChannelName,
                channel_logo_url: newChannelLogo,
                channel_logo_id: newChannelLogoId,
                channel_type: CHANNEL_TYPE.WIDGET
            }

            const {data, error} = await addChannel(newChannelData)
            if(error){

            }
            console.log(data)

            // setChannels([...channels, newChannel])
            setNewChannelName('')
            setNewChannelLogo(placeholder)
            setIsAdding(false)
        }
    }

    return <div className="flex items-center space-x-4">
        <div className="border-2 border-primary rounded-md p-1">
            <Image
                src={newChannelLogo}
                alt="New channel logo"
                width={40}
                height={40}
                className="rounded-sm"
            />
        </div>
        <div className="flex-grow flex items-center space-x-2">
            <Input
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="Channel name"
                className="w-1/3"
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleNewLogoUpload}
                className="hidden"
                accept="image/*"
            />
            <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
            >
                <UploadIcon className="h-4 w-4" />
                <span className="sr-only">Upload logo</span>
            </Button>
        </div>
        <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleCreateChannel}>
                <CheckIcon className="h-4 w-4" />
                <span className="sr-only">Save new channel</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Cancel adding new channel</span>
            </Button>
        </div>
    </div>
}