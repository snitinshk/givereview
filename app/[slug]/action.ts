'use server'

import { createClient } from "@/lib/supabase/supabase-server";
import { headers } from "next/headers";

export const saveNegativeReview = async (negativeReviewDetails: any) => {

    const supabase = await createClient();

    return await supabase
        .from('negative_review_details')
        .insert([
            negativeReviewDetails,
        ])

}

export const getBaseUrl = async () => {
    const headersList = headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";
    return `${protocol}://${host}`;
};