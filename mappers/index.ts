import { ChannelDB, Channel } from "@/interfaces/channels"
import { ClientDB } from "@/interfaces/clients"


export const mapChannels = (channels: ChannelDB[]): Channel[] => {
    return channels?.map((channel) => {
        return {
            id: channel.id as number,
            name: channel?.channel_name ?? '',
            logo: channel?.channel_logo_url ?? '',
            logoId: channel?.channel_logo_id ?? ''
        }
    })
}

export const mapClients = (clients: ClientDB[]) => {
    return clients?.map((client) => {
        return {
            id: client.id as number,
            name: client?.client_name ?? '',
            logo: client?.client_logo ?? '',
            type: client?.client_type ?? '',
            slug: client?.client_slug ?? '',
            nrOfLinks: client?.setting_review_link_details?.length,
            createdAt: client?.created_at as number,
            status: client?.client_status as string

        }
    })
}

export const mapSettingsDbFormat = (reviewLinkSettings: any) => {
    return {
        client_id: reviewLinkSettings?.clientId,
        review_link_name: reviewLinkSettings?.reviewLinkName,
        review_link_slug: reviewLinkSettings?.reviewLinkSlug,
        rating_threshold_count: reviewLinkSettings?.ratingThresholdCount,
        review_link_home_title: reviewLinkSettings?.reviewLinkHomeTitle,
        skip_first_page_enabled: reviewLinkSettings?.isSkipFirstPageEnabled,
        powered_by_enabled: reviewLinkSettings?.isPoweredByEnabled,
        desktop_bg_image: reviewLinkSettings?.desktopBgImage,
        review_link_positive_title: reviewLinkSettings?.reviewLinkPositiveTitle
    };
}

export const mapNegativePageDataToDbFormat = (reviewLinkNegative: any) => {

    const getCategoryEnabled = (dbField: string) =>
        reviewLinkNegative?.ratingCategories?.find((cat: any) => cat.dbField === dbField)?.enabled;

    const getInputEnabled = (dbField: string) =>
        reviewLinkNegative?.inputCategories?.find((cat: any) => cat.dbField === dbField)?.enabled;

    const getTextareaEnabled = (dbField: string) =>
        reviewLinkNegative?.textareaCategories?.find((cat: any) => cat.dbField === dbField)?.enabled;

    return {
        review_link_id: reviewLinkNegative?.reviewLinkId,
        channel_logo: reviewLinkNegative?.defaultChannel,
        negative_page_title: reviewLinkNegative?.negativePageTitle,
        negative_page_description: reviewLinkNegative?.negativePageDescription,

        is_food_review_enabled: getCategoryEnabled('is_food_review_enabled'),
        is_service_review_enabled: getCategoryEnabled('is_service_review_enabled'),
        is_atmosphere_review_enabled: getCategoryEnabled('is_atmosphere_review_enabled'),
        is_noise_review_enabled: getCategoryEnabled('is_noise_review_enabled'),
        is_price_review_enabled: getCategoryEnabled('is_price_review_enabled'),
        is_cleanliness_review_enabled: getCategoryEnabled('is_cleanliness_review_enabled'),
        is_wait_time_review_enabled: getCategoryEnabled('is_wait_time_review_enabled'),

        is_input_name_enabled: getInputEnabled('is_input_name_enabled'),
        is_input_phone_enabled: getInputEnabled('is_input_phone_enabled'),
        is_input_email_enabled: getInputEnabled('is_input_email_enabled'),

        is_input_place_experience_enabled: getTextareaEnabled('is_input_place_experience_enabled'),
        is_input_visit_highlights_enabled: getTextareaEnabled('is_input_visit_highlights_enabled'),
        is_input_visit_drawbacks_enabled: getTextareaEnabled('is_input_visit_drawbacks_enabled'),
        is_input_other_comments_enabled: getTextareaEnabled('is_input_other_comments_enabled'),
    };
};


export const mapSettingsUIFormat = (reviewLinkSettings: any) => {
    return {
        reviewLinkId: reviewLinkSettings?.id,
        reviewLinkName: reviewLinkSettings?.review_link_name,
        reviewLinkSlug: reviewLinkSettings?.review_link_slug,
        ratingThresholdCount: reviewLinkSettings?.rating_threshold_count,
        reviewLinkHomeTitle: reviewLinkSettings?.review_link_home_title,
        isSkipFirstPageEnabled: reviewLinkSettings?.skip_first_page_enabled,
        isPoweredByEnabled: reviewLinkSettings?.powered_by_enabled,
        desktopBgImage: reviewLinkSettings?.desktop_bg_image,
    };
}

export const mapPositivePageUIFormat = (positivePageData: any) => {

    return positivePageData?.map((client: any) => {
        return {
            positivePageId: client?.id,
            id: client?.channel_id,
            name: client?.channels?.channel_name,
            logo: client?.channels?.channel_logo_url,
            link: client?.channel_review_link
        }
    })
}