import { ChannelDB, Channel } from "@/interfaces/channels"
import { ClientDB } from "@/interfaces/clients"
import {
    NegativeLinkDefault, NegativeReviewLinkDB,
    PositivePageDB, PositivePageUI, ReviewLinkNegativeDB,
    ReviewLinkNegativeUI, ReviewLinkSettingsDB, ReviewLinkSettingsUI,
    ReviewLinkThankYouUI, ReviewLinkThankYouDB
} from "@/interfaces/reviewlink"


export const mapChannels = (channels: ChannelDB[]): Channel[] => {
    return channels?.map((channel) => {
        return {
            id: channel.id as number,
            name: channel?.channel_name ?? '',
            logo: channel?.channel_logo_url ?? '',
            channelType: channel?.channel_type ?? '',
            orderPriority: channel?.order_priority ?? 0
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

export const mapSettingsDbFormat = (reviewLinkSettings: ReviewLinkSettingsUI): ReviewLinkSettingsDB => {
    return {
        client_id: reviewLinkSettings?.clientId,
        review_link_name: reviewLinkSettings?.reviewLinkName,
        review_link_slug: reviewLinkSettings?.reviewLinkSlug,
        rating_threshold_count: reviewLinkSettings?.ratingThresholdCount,
        review_link_home_title: reviewLinkSettings?.title,
        skip_first_page_enabled: reviewLinkSettings?.isSkipFirstPageEnabled,
        powered_by_enabled: reviewLinkSettings?.isPoweredByEnabled,
        desktop_bg_image: reviewLinkSettings?.desktopBgImage,
        review_link_positive_title: reviewLinkSettings?.positivePageTitle
    };
}

export const mapNegativePageDataToDbFormat = (reviewLinkNegative: ReviewLinkNegativeUI): ReviewLinkNegativeDB => {
    const getCategoryEnabled = (dbField: string) =>
        reviewLinkNegative?.ratingCategories?.find((cat: any) => cat.dbField === dbField)?.enabled;

    const getInputEnabled = (dbField: string) =>
        reviewLinkNegative?.inputCategories?.find((cat: any) => cat.dbField === dbField)?.enabled;

    const getTextareaEnabled = (dbField: string) =>
        reviewLinkNegative?.textareaCategories?.find((cat: any) => cat.dbField === dbField)?.enabled;

    return {
        review_link_id: reviewLinkNegative?.reviewLinkId,
        channel_logo: reviewLinkNegative?.defaultChannel,
        negative_page_title: reviewLinkNegative?.title,
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


export const mapSettingsUIFormat = (reviewLinkSettings: ReviewLinkSettingsDB): ReviewLinkSettingsUI => {
    return {
        reviewLinkId: reviewLinkSettings?.id,
        isActive: (reviewLinkSettings?.is_active),
        reviewLinkName: reviewLinkSettings?.review_link_name,
        reviewLinkSlug: reviewLinkSettings?.review_link_slug,
        ratingThresholdCount: reviewLinkSettings?.rating_threshold_count,
        title: reviewLinkSettings?.review_link_home_title,
        isSkipFirstPageEnabled: reviewLinkSettings?.skip_first_page_enabled,
        isPoweredByEnabled: reviewLinkSettings?.powered_by_enabled,
        desktopBgImage: reviewLinkSettings?.desktop_bg_image,
    };
}

export const mapPositivePageUIFormat = (positivePageData: PositivePageDB[]): any => {

    return positivePageData?.map((client: any) => {
        return {
            positiveRLId: client?.id,
            id: client?.channel_id,
            name: client?.channels?.channel_name,
            logo: client?.channels?.channel_logo_url,
            link: client?.channel_review_link
        }
    })
}

export const mapNegativeLinkDefault = (negativeReviewLink: NegativeReviewLinkDB): NegativeLinkDefault => {

    return {
        negativeRLId: negativeReviewLink.id,
        defaultChannel: negativeReviewLink.channel_logo,
        title: negativeReviewLink.negative_page_title,
        negativePageDescription: negativeReviewLink.negative_page_description,
        ratingCategories: [
            {
                name: "Food",
                dbField: "is_food_review_enabled",
                enabled: negativeReviewLink.is_food_review_enabled,
            },
            {
                name: "Service",
                dbField: "is_service_review_enabled",
                enabled: negativeReviewLink.is_service_review_enabled,
            },
            {
                name: "Atmosphere",
                dbField: "is_atmosphere_review_enabled",
                enabled: negativeReviewLink.is_atmosphere_review_enabled,
            },
            {
                name: "Noise",
                dbField: "is_noise_review_enabled",
                enabled: negativeReviewLink.is_noise_review_enabled,
            },
            {
                name: "Price",
                dbField: "is_price_review_enabled",
                enabled: negativeReviewLink.is_price_review_enabled,
            },
            {
                name: "Cleanliness",
                dbField: "is_cleanliness_review_enabled",
                enabled: negativeReviewLink.is_cleanliness_review_enabled,
            },
            {
                name: "WaitTime",
                dbField: "is_wait_time_review_enabled",
                enabled: negativeReviewLink.is_wait_time_review_enabled,
            },
        ],
        inputCategories: [
            {
                placeholder: "Name",
                dbField: "is_input_name_enabled",
                type: "text",
                enabled: negativeReviewLink.is_input_name_enabled,
            },
            {
                placeholder: "Phone number",
                dbField: "is_input_phone_enabled",
                type: "tel",
                enabled: negativeReviewLink.is_input_phone_enabled,
            },
            {
                placeholder: "Email",
                dbField: "is_input_email_enabled",
                type: "email",
                enabled: negativeReviewLink.is_input_email_enabled,
            },
        ],
        textareaCategories: [
            {
                placeholder: "Share information about how you experienced the place",
                dbField: "is_input_place_experience_enabled",
                enabled: negativeReviewLink.is_input_place_experience_enabled,
            },
            {
                placeholder: "What was good about your visit?",
                dbField: "is_input_visit_highlights_enabled",
                enabled: negativeReviewLink.is_input_visit_highlights_enabled,
            },
            {
                placeholder: "What was bad about your visit?",
                dbField: "is_input_visit_drawbacks_enabled",
                enabled: negativeReviewLink.is_input_visit_drawbacks_enabled,
            },
            {
                placeholder: "Other comments",
                dbField: "is_input_other_comments_enabled",
                enabled: negativeReviewLink.is_input_other_comments_enabled,
            },
        ],
        reviewLinkId: negativeReviewLink.review_link_id,
    };
};

export const mapPositivePageDBFormat = (reviewLinkPositive: any) => {

    return reviewLinkPositive.map(
        (channel: any) => ({
            channel_id: channel.id,
            channel_review_link: channel.link,
            review_link_id: channel.reviewLinkId,
        }))

}

export const mapThankyouUIFormat = (reviewLinkThankyou: ReviewLinkThankYouDB): ReviewLinkThankYouUI => {
    return {
        thankyouRLId: reviewLinkThankyou.id,
        bgImage: reviewLinkThankyou?.review_thankyou_bg_image,
        title: reviewLinkThankyou?.review_thankyou_title
    }
}