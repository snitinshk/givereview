'use server'

import { SignInData } from '@/interfaces/user';
import { createClient } from '@/lib/supabase/supabase-server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'


export async function addChannel(channelData: any) {

    const supabase = await createClient()

    const { data, error } = await supabase
    .from('channels')
    .insert([
        channelData,
    ])
    .select()

    if (error) {
        return error;
    }
}