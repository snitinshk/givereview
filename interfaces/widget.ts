export interface WidgetSettings {
  isActive: boolean;
  showTitle: boolean;
  widgetTitle: string;
  showTabs: boolean;
  showCustomerName: boolean;
  showCustomerAvatar: boolean;
  showChannelLogo: boolean;
  showReviewDate: boolean;
  totalReviewsToDisplay: number;
  showRating: boolean;
  showPoweredBy: boolean;
  poweredByText: string;
  isLightTheme: boolean;
}

interface WidgetSettingsDb {
  is_active: boolean;
  show_title: boolean;
  widget_title: string;
  show_tabs: boolean;
  show_customer_name: boolean;
  show_customer_avatar: boolean;
  show_channel_logo: boolean;
  show_review_date: boolean;
  review_count: number;
  show_rating: boolean;
  show_powered_by: boolean;
  powered_by_text: string;
  is_light_theme: boolean;
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
  }
  | {
    type: "label";
    id: string;
    label: string;
  }

export type Section = {
  title: string;
  elements: SectionElement[];
};

export interface WidgetChannel {
  id: number;
  logo: string;
  name: string;
  isActive: boolean;
  disabled: boolean;
  ratingThreshold: string;
}

export interface Widget {
  id?: number;
  uuid?: string;
  channels: WidgetChannel[];
  settings: WidgetSettings;
}
export interface WidgetReview {
  id: number;
  clientId?: number;
  reviewersName?: string;
  reviewersAvtar?: string;
  channelId?: number;
  channelLogo?: string;
  channelName?: string;
  client?: string;
  reviewCount?: number;
  reviewDescription?: string;
  reviewDate?: Date;
}
