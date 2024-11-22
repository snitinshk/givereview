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
    reviewSiteBaseUrl: 'https://placereview.se/',
    homeReviewTitle: 'How was your experience with ',
    positiveReviewTitle: 'Leave us a review, it will help us grow and better serve our customers like you.',
    negativePageTitle: 'Appears publicly on Google',
    negativePageDescription: 'We want our customers to be 100% satisfied. Please let us know why you had a bad experience, so we can improve our service. Leave your email to be contacted.',
    thankyouPageTitle: 'Thank you for your review'
}