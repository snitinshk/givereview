export const API_ROUTES = {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    channel: '/api/admin/channel',
}

export enum STATUS_TYPE {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export enum CHANNEL_TYPE {
    WIDGET = 'WIDGET',
    REVIEW = 'REVIEW'
}

export enum CLIENT_TYPE {
    RESTAURANT = 'RESTAURANT',
    NIGHTCLUB = 'NIGHTCLUB',
    SPA = 'SPA',
    SALON = 'SALON',
    MASSAGE = 'MASSAGE',
    CLINIC = 'CLINIC'

}

export const BUCKET_NAME = 'media'

export const DEFAULT_TEXTS = {
    reviewSiteBaseUrl: 'http://localhost:3000/',
    homeReviewTitle: 'How was your experience with ',
    positiveReviewTitle: 'Leave us a review, it will help us grow and better serve our customers like you.',
    title: 'Appears publicly on Google',
    negativePageDescription: 'We want our customers to be 100% satisfied. Please let us know why you had a bad experience, so we can improve our service. Leave your email to be contacted.',
    thankyouPageTitle: 'Thank you for your review'
}

export const reviewLinkPositiveDefaultValue = {
    title: DEFAULT_TEXTS?.positiveReviewTitle,
    selectedChannels: [],
}

export const reviewLinkSettingsDefaultValue = {
    reviewLinkName: "",
    isSkipFirstPageEnabled: false,
    ratingThresholdCount: 4,
    isPoweredByEnabled: true,
    imageFile: "",
}

export const reviewLinkThankyouDefaultValue = {
    title: DEFAULT_TEXTS?.thankyouPageTitle,
    bgImage: ""
}

export const reviewLinkNegativeDefaultValue = {
    defaultChannel: {
        logo: "https://hwqcsflrmhlffnqlprib.supabase.co/storage/v1/object/public/media/static/google.svg",
        enabled: true,
    },
    title: {
        title: "Appears publicly on Google",
        enabled: true,
    },
    negativePageDescription:
        "We want our customers to be 100% satisfied. Please let us know why you had a bad experience, so we can improve our service. Leave your email to be contacted.",
    ratingCategories: [
        { name: "Food", dbField: "is_food_review_enabled", enabled: true },
        { name: "Service", dbField: "is_service_review_enabled", enabled: true },
        {
            name: "Atmosphere",
            dbField: "is_atmosphere_review_enabled",
            enabled: true,
        },
        { name: "Noise", dbField: "is_noise_review_enabled", enabled: true },
        { name: "Price", dbField: "is_price_review_enabled", enabled: true },
        {
            name: "Cleanliness",
            dbField: "is_cleanliness_review_enabled",
            enabled: true,
        },
        {
            name: "WaitTime",
            dbField: "is_wait_time_review_enabled",
            enabled: true,
        },
    ],
    inputCategories: [
        {
            placeholder: "Name",
            dbField: "is_input_name_enabled",
            type: "text",
            enabled: true,
        },
        {
            placeholder: "Phone number",
            dbField: "is_input_phone_enabled",
            type: "tel",
            enabled: false,
        },
        {
            placeholder: "Email",
            dbField: "is_input_email_enabled",
            type: "email",
            enabled: true,
        },
    ],
    textareaCategories: [
        {
            placeholder: "Share information about how you experienced the place",
            enabled: false,
            dbField: "is_input_place_experience_enabled",
        },
        {
            placeholder: "What was good about your visit?",
            dbField: "is_input_visit_highlights_enabled",
            enabled: true,
        },
        {
            placeholder: "What was bad about your visit?",
            dbField: "is_input_visit_drawbacks_enabled",
            enabled: true,
        },
        {
            placeholder: "Other comments",
            dbField: "is_input_other_comments_enabled",
            enabled: true,
        },
    ],

    reviewLinkId: null,
}