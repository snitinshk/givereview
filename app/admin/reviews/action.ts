'use server'

import { createClient } from "@/lib/supabase/supabase-server";

export const getReviewLinkSettings = async (clientId: number) => {

    const supabase = await createClient();
    const response = await supabase
        .from('setting_review_link_details')
        .select(`id, review_link_name`)
        .eq('client_id', clientId)

    return JSON.stringify(response)
}