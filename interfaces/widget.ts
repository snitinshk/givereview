export interface WidgetSettings {
    isActive: boolean;
    showTitle: boolean;
    widgetTitle: string;
    showTabs: boolean;
    showCustomerName: boolean;
    showCustomerAvatar: boolean;
    showChannelLogo: boolean;
    showReviewDate: boolean;
    showRating: boolean;
    showPoweredBy: boolean;
    poweredByText: string;
    isLightTheme: boolean;
}

export type SectionElement =
    | {
        type: "switch";
        id: string;
        label: string;
    }
    | {
        type: "editable";
        id: string;
        defaultValue: string;
    }
    | {
        type: "select";
        id: string;
        label: string;
        options: { label: string; value: string }[];
    };

export type Section = {
    title: string;
    elements: SectionElement[];
};