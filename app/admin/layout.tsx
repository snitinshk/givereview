import AdminLayout from "@/components/admin/admin-layout"
import { ReactNode } from "react"

interface AdminLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: AdminLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>
}