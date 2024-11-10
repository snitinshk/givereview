import { ReactNode } from "react"
import AdminLayout from "./side-header"

interface AdminLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: AdminLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>
}