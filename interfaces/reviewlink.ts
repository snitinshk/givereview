import { Channel, ChannelDB } from "./channels"
import { ClientDB } from "./clients";

export interface ReviewLinkThankYouUI {
    thankyouRLId?: number
    title: string,
    bgImage: string
}

export interface ReviewLinkThankYouDB {
    id?: number
    review_thankyou_title: string,
    review_thankyou_bg_image: string
}

export interface ReviewLinkPositive {
    title: string,
    selectedChannels: Channel[]
}

// Input and Output Interfaces
export interface ReviewLinkSettingsUI {
    reviewLinkId ?: number | undefined;
    id?: number | undefined;
    isActive?: boolean | undefined;
    clientId?: number | undefined;
    reviewLinkName?: string | undefined;
    reviewLinkSlug?: string | undefined;
    ratingThresholdCount?: number | undefined;
    title?: string | undefined;
    isSkipFirstPageEnabled?: boolean | undefined;
    isPoweredByEnabled?: boolean | undefined;
    desktopBgImage?: string | undefined;
    positivePageTitle?: string | undefined;
}

export interface ReviewLinkSettingsDB {
    id?: number | undefined; 
    is_active?: boolean | undefined;
    review_link_id?: number | undefined; 
    client_id: number | undefined;
    review_link_name: string | undefined;
    review_link_slug: string | undefined;
    rating_threshold_count: number | undefined;
    review_link_home_title: string | undefined;
    skip_first_page_enabled: boolean | undefined;
    powered_by_enabled: boolean | undefined;
    desktop_bg_image: string | undefined;
    review_link_positive_title: string | undefined;
}

export interface ReviewLinkNegativeUI {
    reviewLinkId?: number;
    defaultChannel?: string;
    title?: string;
    negativePageDescription?: string;
    ratingCategories?: Array<{ name: string; dbField: string; enabled?: boolean }>;
    inputCategories?: Array<{ placeholder: string; dbField: string; type: string; enabled?: boolean }>;
    textareaCategories?: Array<{ placeholder: string; dbField: string; enabled?: boolean }>;
}

export interface ReviewLinkNegativeDB {
    review_link_id: number | undefined;
    channel_logo: string | undefined;
    negative_page_title: string | undefined;
    negative_page_description: string | undefined;
    is_food_review_enabled?: boolean;
    is_service_review_enabled?: boolean;
    is_atmosphere_review_enabled?: boolean;
    is_noise_review_enabled?: boolean;
    is_price_review_enabled?: boolean;
    is_cleanliness_review_enabled?: boolean;
    is_wait_time_review_enabled?: boolean;
    is_input_name_enabled?: boolean;
    is_input_phone_enabled?: boolean;
    is_input_email_enabled?: boolean;
    is_input_place_experience_enabled?: boolean;
    is_input_visit_highlights_enabled?: boolean;
    is_input_visit_drawbacks_enabled?: boolean;
    is_input_other_comments_enabled?: boolean;
}

export interface PositivePageUI {
    positiveRLId?: number;
    id: number;
    name?: string;
    logo?: string;
    link?: string;
}

export interface PositivePageDB {
    channel_id: number;
    channel_review_link: string;
    review_link_id: number;
    client: ClientDB
}

export interface ThankyouPageUI {
    thankyouRLId?: number;
    bgImage?: string;
    title?: string;
}

// Helper Types
export type ChannelMapperInput = ChannelDB[];
export type ChannelMapperOutput = Channel[];

export type ClientMapperInput = ClientDB[];
export type ClientMapperOutput = Array<{
    id: number;
    name: string;
    logo: string;
    type: string;
    slug: string;
    nrOfLinks: number;
    createdAt: number;
    status: string;
}>;


export interface RatingCategory {
    name: string;
    dbField: string;
    enabled: boolean | undefined;
}

export interface InputCategory {
    placeholder: string;
    dbField: string;
    type: string;
    enabled: boolean | undefined;
}

export interface TextareaCategory {
    placeholder: string;
    dbField: string;
    enabled: boolean | undefined;
}

export interface NegativeLinkDefault {
    negativeRLId: number;
    defaultChannel: string | undefined;
    title: string | undefined;
    negativePageDescription: string | undefined;
    ratingCategories: RatingCategory[];
    inputCategories: InputCategory[];
    textareaCategories: TextareaCategory[];
    reviewLinkId: number | undefined;
}


export interface NegativeReviewLinkDB {
    id: number;
    channel_logo?: string;
    negative_page_title?: string;
    negative_page_description?: string;

    is_food_review_enabled?: boolean;
    is_service_review_enabled?: boolean;
    is_atmosphere_review_enabled?: boolean;
    is_noise_review_enabled?: boolean;
    is_price_review_enabled?: boolean;
    is_cleanliness_review_enabled?: boolean;
    is_wait_time_review_enabled?: boolean;

    is_input_name_enabled?: boolean;
    is_input_phone_enabled?: boolean;
    is_input_email_enabled?: boolean;

    is_input_place_experience_enabled?: boolean;
    is_input_visit_highlights_enabled?: boolean;
    is_input_visit_drawbacks_enabled?: boolean;
    is_input_other_comments_enabled?: boolean;

    review_link_id?: number;
}
