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