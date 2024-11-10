'use client'
import { useEffect, useState } from 'react'
// import Image from 'next/image'
import { PlusIcon } from 'lucide-react'

import { Button } from "@/components/ui/button"
import ChannelCard from './channel-card'
import AddNewChannel from './add-new-channel'
import { fetchChannels, updateChannels } from './action'
import { mapChannels } from '@/mappers'
import { Channel, EditChannelData } from '@/interfaces/channels'
import { useAlert } from '@/app/context/alert-context'
import { getFileName, mediaUrl, uploadFile } from '@/lib/utils'

export default function ChannelsPage() {
  const { setAlert } = useAlert();
  useEffect(() => {
    fetchChannelsData();
  }, [])

  const fetchChannelsData = async () => {

    const { data, error } = await fetchChannels()

    if (!error && data) {
      const channels = mapChannels(data)
      setChannels(channels);
    }

  }

  const [channels, setChannels] = useState<Channel[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const midpoint = Math.ceil(channels.length / 2);
  const leftColumnChannels = channels.slice(0, midpoint);
  const rightColumnChannels = channels.slice(midpoint);

  const handleEdit = async (editChannelData: EditChannelData) => {

    const { channelId, newName, newLogoFile, newLogo } = editChannelData;

    let updatedLogoUrl;

    const channelToUpdate = channels?.find(channel => channel.id === channelId)

    setChannels(channels.map(channel =>
      channel.id === channelId ? {
        ...channel,
        name: newName ?? channelToUpdate?.name,
        logo: newLogo ?? channelToUpdate?.logo
      } : channel
    ))

    if (newLogoFile) {
      const uploadPath = `channels/${getFileName(newLogoFile)}`;
      const { data: uploadData, error: uploadError } = await uploadFile(newLogoFile, uploadPath);
      if (!uploadError && uploadData?.fullPath) {
        updatedLogoUrl = mediaUrl(uploadData?.fullPath);
      } else {
        setAlert({
          type: 'error',
          title: 'Error!',
          message: 'Error in uploading file, please try again later.',
          visible: true
        })
      }

    }

    const updatedChannelData = {
      channel_name: newName ?? channelToUpdate?.name,
      channel_logo_url: updatedLogoUrl ?? channelToUpdate?.logo,
    }

    const {error: updateError} = await updateChannels(updatedChannelData, channelId)

    if (!updateError) {
      setAlert({
        type: 'success',
        title: 'Success!',
        message: 'Channel updated successfully.',
        visible: true
      })
    } else {
      setAlert({
        type: 'error',
        title: 'Error!',
        message: 'Error in updating channel information.',
        visible: true
      })
    }

  }



  return (
    <div className="container mx-auto py-8 pr-8 md:pr-16 lg:pr-24">
      <h1 className="text-3xl font-bold mb-6">Channels</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {leftColumnChannels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} onEdit={handleEdit} />
          ))}
        </div>
        <div className="space-y-4">
          {rightColumnChannels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} onEdit={handleEdit} />
          ))}
        </div>
      </div>
      <div className="mt-8">
        {isAdding ? (
          <AddNewChannel channels={channels} setChannels={setChannels} setIsAdding={setIsAdding} />
        ) : (
          <Button variant="outline" onClick={() => setIsAdding(true)} className="flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>Add new channel</span>
          </Button>
        )}
      </div>
    </div>
  )
}