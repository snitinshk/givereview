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