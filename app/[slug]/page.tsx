import { headers } from "next/headers";

import IndexPage from ".";
import { getBaseUrl } from "./action";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  
  const slug = (await params).slug;
  const baseUrl = await getBaseUrl();
  const data = await fetch(`${baseUrl}/api/web/client?slug=${slug}`);
  const reviewLink = await data.json();
  const { clients: client } = reviewLink;
  if(!reviewLink?.is_active || (client.client_status === 'INACTIVE')){
    redirect(`${slug}/offline`)
  }

  return <IndexPage reviewLink={reviewLink} />;
}
