'use server'

import { createClient } from "@/lib/supabase/supabase-server"

export const getReviewLinks = async (clientId: number) => {

    const supabase = await createClient();
    const response = await supabase
        .from('setting_review_link_details')
        .select(`
            *,
            positive_review_link_details!left(*) 
        `)
        .eq('client_id', clientId);

    return JSON.stringify(response)

}

export const createReviewLink = async (reviewLinkData: any) => {
    
    const { settingsData } = reviewLinkData
    console.log(settingsData);
    
    const supabase = await createClient();
    
    return await supabase
    .from('setting_review_link_details')
    .insert([
        settingsData,
    ])
    .select()

}