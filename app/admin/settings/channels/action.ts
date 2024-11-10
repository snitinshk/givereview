'use server'

import { ChannelDB } from '@/interfaces/channels'
import { createClient } from '@/lib/supabase/supabase-server'

export async function addChannel(channelData: ChannelDB) {

    const supabase = await createClient()
    return await supabase
        .from('channels')
        .insert([
            channelData,
        ])
        .select()

}

export async function fetchChannels() {

    const supabase = await createClient()

    return await supabase
        .from('channels')
        .select('*')

}

export async function updateChannels(updateData: ChannelDB, channelId: number) {

    const supabase = await createClient()
    return await supabase
        .from('channels')
        .update(updateData)
        .eq('id', channelId)

}