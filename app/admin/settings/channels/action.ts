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

export async function deleteChannel(channelId: number) {
    const supabase = await createClient()
    return await supabase
        .from('channels')
        .delete()
        .eq('id', channelId)

}

export async function updateChannel(updateData: ChannelDB, channelId: number) {

    const supabase = await createClient()
    return await supabase
        .from('channels')
        .update(updateData)
        .eq('id', channelId)

}