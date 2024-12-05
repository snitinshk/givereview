import { headers } from "next/headers";

import IndexPage from ".";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const baseUrl = getBaseUrl();
  const data = await fetch(`${baseUrl}/api/web/client?slug=${slug}`);
  const reviewLink = await data.json();

  return <IndexPage reviewLink={reviewLink} />;
}

const getBaseUrl = () => {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
};
