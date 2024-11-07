'use server'

import { createClient } from '@/lib/supabase/supabase-server'


export async function addChannel(channelData: any) {

    const supabase = await createClient()
    return await supabase
        .from('channels')
        .insert([
            channelData,
        ])
        .select()
        
}