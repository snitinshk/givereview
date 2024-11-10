import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "./supabase/supabase-client";
import { SupabaseUploadResponse } from "@/interfaces/channels";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function uploadFile(file: File, uploadFolder: string): Promise<SupabaseUploadResponse> {

  const supabase = createClient()
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;

  return await supabase
    .storage
    .from('media')
    .upload(`${uploadFolder}/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    })
}

export const mediaUrl = (path: string) => `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL + path}`