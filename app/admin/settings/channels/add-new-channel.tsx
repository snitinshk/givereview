'use client'
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
import placeholder from "./placeholder.svg"
import { useAlert } from "@/app/context/alert-context";

export default function AddNewChannel({ setIsAdding, setChannels, channels }: AddChannelProps) {

    const { setAlert } = useAlert();
    const [newChannelName, setNewChannelName] = useState('')
    const [newChannelLogo, setNewChannelLogo] = useState(placeholder)
    const [newChannelLogoId, setNewChannelLogoId] = useState('')
    const [channelFile, setChannelFile] = useState<File>();
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleNewLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setNewChannelLogo(reader.result as string)
            }
            reader.readAsDataURL(file)
            setChannelFile(file)
        }
    }


    const handleCreateChannel = async () => {

        if (newChannelName && channelFile) {

            const uploadPath = `channels/${getFileName(channelFile)}`;
            const { data: uploadData, error: uploadError } = await uploadFile(channelFile, uploadPath);

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
                channel_type: CHANNEL_TYPE.WIDGET
            }

            const { data: addedChannel, error: addChannelError } = await addChannel(newChannelData)

            if (!addChannelError && !uploadError && addedChannel) {
                const [newMappedChannel]: Channel[] = mapChannels(addedChannel)
                setChannels([...channels, newMappedChannel])
                setAlert({
                    type: 'success',
                    title: 'Success!',
                    message: 'Channel added successfully',
                    visible: true
                })
            }else {
                setAlert({
                    type: 'error',
                    title: 'Error!',
                    message: 'Something went wrong, please try again later',
                    visible: true
                })
            }

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
        <Button
            variant="outline"
            size="icon"
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
                className="w-1/3"
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
            <Button disabled={!newChannelName || !channelFile} variant="ghost" size="icon" onClick={handleCreateChannel}>
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