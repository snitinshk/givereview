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

export const DEFAULT_REVIEW_LINK_TEXTS = {
    SETTINGS:{
        homeReviewTitle: ''
    }
}