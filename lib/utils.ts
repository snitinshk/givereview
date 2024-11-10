import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "./supabase/supabase-client";
import { SupabaseUploadResponse } from "@/interfaces/channels";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function uploadFile(file: File, uploadPath: string, upsert = false): Promise<SupabaseUploadResponse> {

  const supabase = createClient()
  return await supabase
    .storage
    .from('media')
    .upload(uploadPath, file, {
      cacheControl: '3600',
      upsert: upsert
    })
}



export const mediaUrl = (path: string) => `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL + path}`
export const extractMediaPath = (url: string) => url.split('/media/')[1];
export const getFileName = (file: File): string => {
  const fileExt = file.name.split('.').pop();
  return `${Date.now()}.${fileExt}`;
}