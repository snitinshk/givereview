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

export const getSlug = (name: string) => {
  return name
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-'); // Remove multiple dashes
}

export function capitalizeFirstLetter(string: string) {
  if (!string) return string; // Handle empty or null strings
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const isValidUrl = (url: string) => {
  try {
    // Use the URL constructor to validate the URL
    new URL(url);
    return true;
  } catch (e) {
    // If the URL constructor throws an error, it's invalid
    return false;
  }
}