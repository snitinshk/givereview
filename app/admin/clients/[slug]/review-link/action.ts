'use server'

import { createClient } from "@/lib/supabase/supabase-server"

export const getReviewLinks = async (clientId: number) => {

    const supabase = await createClient();

    const response = await supabase
        .from('setting_review_link_details').select(`*,
      positive_review_link_details!left(
        review_link_id,
        channel_id,
        channels!inner(
          channel_name,
          channel_logo_url
        )
      )
    `).order('created_at', { ascending: false }).eq('client_id', clientId)

    return JSON.stringify(response)

}

export const getReviewLinkSettings = async (reviewLinkId: number) => {

    const supabase = await createClient();
    const response = await supabase
        .from('setting_review_link_details')
        .select(`
      *,
      positive_review_link_details!left(*,channels!inner(
          channel_name,
          channel_logo_url
        )
    ),
      negative_review_link_details!left(*),
      thankyou_review_link_details!left(*)
    `).eq('id', reviewLinkId).single();

    return JSON.stringify(response)
}

export const getChannels = async () => {

    const supabase = await createClient();
    const response = await supabase
        .from('channels')
        .select(`*`)

    return JSON.stringify(response)
}

export const deleteReviewLink = async (reviewLinkId: number) => {
    const supabase = await createClient()
    const response = await supabase
        .from('setting_review_link_details')
        .delete()
        .eq('id', reviewLinkId)

    return JSON.stringify(response);
}

export const updateReviewLink = async (table: string, update: any, condition: any) => {
    
    const supabase = await createClient()
    const response = await supabase
        .from(table)
        .update(update)
        .eq(condition?.col, condition?.val)

    return JSON.stringify(response);
}

export const deletePositiveReviewLink = async (positiveReviewLinkId: number) => {
    const supabase = await createClient()
    const response = await supabase
        .from('positive_review_link_details')
        .delete()
        .eq('id', positiveReviewLinkId)

    return JSON.stringify(response);
}

export const saveReviewLinkSettings = async (settingsData: any) => {

  const supabase = await createClient();

  return await supabase
      .from('setting_review_link_details')
      .insert([
          settingsData,
      ])
      .select('id').single();

}

export const saveReviewLinkPositivePage = async (positivePageData: any) => {

const supabase = await createClient();

return await supabase
    .from('positive_review_link_details')
    .insert(positivePageData)
    .select('id')

}

export const saveReviewLinkNegativePage = async (negativePageData: any) => {

    const supabase = await createClient();

    const response = supabase
        .from('negative_review_link_details')
        .insert(negativePageData)
        .select('id')

    return JSON.stringify(response);

}

export const saveReviewLinkThankyouPage = async (thankyouPageData: any) => {

  console.log(thankyouPageData);

  const supabase = await createClient();

  const response = await supabase
      .from('thankyou_review_link_details')
      .insert(thankyouPageData)
      .select('id')

  return JSON.stringify(response);

}


/**
 * Checks if a slug exists in the Supabase database.
 * @param slug - The slug to check for existence.
 * @param tableName - The table where slugs are stored.
 * @returns A boolean indicating if the slug exists.
 */
const doesSlugExist = async (slug: string): Promise<boolean> => {
    
    const supabase = await createClient();
    const { data, error } = await supabase
    .from('setting_review_link_details')
    .select("id") // Adjust the column name if needed
    .eq("review_link_slug", slug)
    .single(); // Fetch a single matching record
    console.log(error);
  if (error && error.code !== "PGRST116") {
    console.error("Error checking slug existence:", error.message);
    throw new Error("Error checking slug existence");
  }

  return !!data;
};

/**
 * Generates a unique slug by appending a numeric suffix if the base slug exists.
 * @param baseSlug - The initial slug to check for uniqueness.
 * @param tableName - The table where slugs are stored.
 * @returns A unique slug.
 */
export const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
    if(!baseSlug){
        return '';
    }
  let uniqueSlug = baseSlug;
  let suffix = 1;

  // Check for the slug's existence in the database
  while (await doesSlugExist(uniqueSlug)) {
    uniqueSlug = `${baseSlug}${suffix}`;
    suffix++;
  }

  return uniqueSlug;
};
