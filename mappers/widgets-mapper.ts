import { WidgetSettings } from "@/interfaces/widget";


type WidgetSettingsSnakeCase = {
    [key in keyof WidgetSettings as `${Uncapitalize<string & key>}`]: WidgetSettings[key];
};

const toSnakeCase = (str: string): string => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const mapWidgetForDb = (input: WidgetSettings): WidgetSettingsSnakeCase => {
    return Object.entries(input).reduce((acc, [key, value]) => {
        const snakeKey = toSnakeCase(key) as keyof WidgetSettingsSnakeCase;
        return { ...acc, [snakeKey]: value };
    }, {} as WidgetSettingsSnakeCase);
};

export const mapDbSettingsToWidgetSettings = (dbWidget: any): Partial<WidgetSettings> => ({
    isActive: dbWidget?.is_active,
    showTitle: dbWidget?.show_title,
    widgetTitle: dbWidget?.widget_title,
    showTabs: dbWidget?.show_tabs,
    showCustomerName: dbWidget?.show_customer_name,
    showCustomerAvatar: dbWidget?.show_customer_avatar,
    showChannelLogo: dbWidget?.show_channel_logo,
    showReviewDate: dbWidget?.show_review_date,
    totalReviewsToDisplay: dbWidget?.total_reviews_to_display,
    showRating: dbWidget?.show_rating,
    showPoweredBy: dbWidget?.show_powered_by,
    poweredByText: dbWidget?.powered_by_text,
    isLightTheme: dbWidget?.is_light_theme,
});
