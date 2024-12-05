import { ReactNode } from "react";
import Page from "./page";
import HomeLayout from "./_home-layout";
import { headers } from "next/headers";

interface HomeLayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: HomeLayoutProps) {
  const slug = (await params).slug;
  const baseUrl = getBaseUrl();
  const data = await fetch(`${baseUrl}/api/web/client?slug=${slug}`);
  const reviewLink = await data.json();

  const { clients: client } = reviewLink;
  return (
    <HomeLayout reviewLink={reviewLink}>{children}</HomeLayout>
  );
}

const getBaseUrl = () => {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
};
