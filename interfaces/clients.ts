import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface ClientDB {
    id?: number;
    client_name: string;
    client_logo: string;
    client_type: string;
    client_slug: string;
    created_at?: number;
    client_status?: string;
    setting_review_link_details?: any
}

export interface Client {
    id: number;
    logo: string | StaticImport;
    name: string;
    type: string;
    slug: string;
    createdAt: number;
    nrOfLinks: number;
    status: string;
  }