import { ReactNode } from "react"
import AdminLayout from "./side-header"

interface AdminLayoutProps {
  children: ReactNode
}

export default async function Layout({ children }: AdminLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>
}