import { ReactNode } from "react";
import AdminLayout from "./side-header";
import { ContextProvider } from "../context/contex-provider";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: AdminLayoutProps) {
  return (
    <ContextProvider>
      <AdminLayout>{children}</AdminLayout>
    </ContextProvider>
  );
}
