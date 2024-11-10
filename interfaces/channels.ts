import { Dispatch, SetStateAction } from "react";

export interface StorageObject {
    id: string;
    fullPath: string;
}

interface SupabaseUploadData {
    id: string | null;
    path: string | null;
    fullPath: string | null;
};

type SupabaseError = {
    message: string;
    status?: number;
    code?: string;
};

export interface SupabaseUploadResponse {
    data: SupabaseUploadData | null;
    error: SupabaseError | null;
};


export interface AddChannel {
    data: unknown | null;
    error: SupabaseError | null;
};

export interface Channel {
    id: number,
    name: string,
    logo: string,
    logoId: string
}

export interface ChannelDB {
    id?: number,
    channel_name?: string,
    channel_logo?: string,
    channel_logo_id?: string
    channel_logo_url?: string
}

// Define the props type for your component
export interface AddChannelProps {
    channels: Channel[];
    setChannels: Dispatch<SetStateAction<Channel[]>>;
    setIsAdding: Dispatch<SetStateAction<boolean>>;
}

export interface EditChannelData {
    channelId: number,
    newName: string,
    newLogo: string,
    newLogoFile: File
}