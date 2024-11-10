'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { PlusIcon } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChannelCard from './channel-card'
import AddNewChannel from './add-new'

// Dummy data for channels
const initialChannels = [
  { id: 1, name: 'Google', logo: '/placeholder.svg?height=40&width=40' },
  { id: 2, name: 'TripAdvisor', logo: '/placeholder.svg?height=40&width=40' },
  { id: 3, name: 'Facebook', logo: '/placeholder.svg?height=40&width=40' },
  { id: 4, name: 'Instagram', logo: '/placeholder.svg?height=40&width=40' },
  { id: 5, name: 'Twitter', logo: '/placeholder.svg?height=40&width=40' },
  { id: 6, name: 'LinkedIn', logo: '/placeholder.svg?height=40&width=40' },
  { id: 7, name: 'YouTube', logo: '/placeholder.svg?height=40&width=40' },
  { id: 8, name: 'Pinterest', logo: '/placeholder.svg?height=40&width=40' },
]

export default function ChannelsPage() {
  const [channels, setChannels] = useState(initialChannels)
  const [isAdding, setIsAdding] = useState(false)
  const [newChannelLogo, setNewChannelLogo] = useState('/placeholder.svg?height=40&width=40')


  // Split channels into two arrays for two columns
  const midpoint = Math.ceil(channels.length / 2);
  const leftColumnChannels = channels.slice(0, midpoint);
  const rightColumnChannels = channels.slice(midpoint);

  const handleEdit = (id: number, newName: string, newLogo: string) => {
    setChannels(channels.map(channel =>
      channel.id === id ? { ...channel, name: newName, logo: newLogo } : channel
    ))
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
          <AddNewChannel setIsAdding={setIsAdding} />
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