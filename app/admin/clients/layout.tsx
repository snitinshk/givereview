import { ReactNode } from "react"

interface ClientLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: ClientLayoutProps) {
  return <>{children}</>
}