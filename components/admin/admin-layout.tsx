'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ReactNode } from 'react'
import { Settings, Users, MessageSquareMore, LogOut, Folder, ChevronDown, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Breadcrumb from './breadcrum'
import { postData } from '@/lib/api-helper'
import { API_ROUTES } from '@/constant'
import { MenuItem } from '@/interfaces/layout'

interface SubMenuItem {
    name: string
    path: string
}

const menuItems: MenuItem[] = [
    {
        name: 'Clients',
        path: '/admin/clients',
        icon: Users,
        submenu: [
            { name: 'Client List', path: '/admin/clients/list' },
            { name: 'Add Client', path: '/admin/clients/add' },
        ],
    },
    { name: 'Reviews', path: '/admin/analytics', icon: MessageSquareMore },
    { name: 'Settings', path: '/admin/settings/channels', icon: Settings },
]

const breadcrumItem = [
    {
        path: 'abc',
        label: 'adfd'
    },
    {
        path: 'abc',
        label: 'adfd1'
    }
]

interface AdminLayoutProps {
    children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter()
    const [selectedPath, setSelectedPath] = useState('/admin/clients')
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

    const handleNavigation = (path: string) => {
        setSelectedPath(path)
        router.push(path)
    }

    const toggleSubmenu = (path: string) => {
        setOpenSubmenu(openSubmenu === path ? null : path)
    }

    const logout = async () => {
        const postObject = {
            path: API_ROUTES.logout,
        }
        const responseData = await postData(postObject)
        console.log('Response from API:', responseData);
        router.replace('/auth/login')
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left Menu */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 text-2xl font-bold text-primary">Admin Panel</div>
                <nav className="flex-grow">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.path} className="relative">
                                <Button
                                    variant={selectedPath === item.path ? "secondary" : "ghost"}
                                    className="w-full justify-start text-left px-4 py-2 flex items-center"
                                    onClick={() => item.submenu ? toggleSubmenu(item.path) : handleNavigation(item.path)}
                                >
                                    <item.icon />
                                    {item.name}
                                    {item.submenu && (
                                        openSubmenu === item.path ? (
                                            <ChevronDown className="ml-auto" />
                                        ) : (
                                            <ChevronRight className="ml-auto" />
                                        )
                                    )}
                                </Button>
                                {item.submenu && openSubmenu === item.path && (
                                    <ul className="pl-8">
                                        {item.submenu.map((subItem) => (
                                            <li key={subItem.path}>
                                                <Button
                                                    variant={selectedPath === subItem.path ? "secondary" : "ghost"}
                                                    className="w-full justify-start text-left px-4 py-2"
                                                    onClick={() => handleNavigation(subItem.path)}
                                                >
                                                    <Folder className="mr-2 h-4 w-4" />
                                                    {subItem.name}
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
                <Button
                    onClick={logout}
                    variant="ghost"
                    className="w-full justify-start text-left px-4 py-2 text-red-500 hover:text-red-700"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8">
                <Breadcrumb items={breadcrumItem} />
                {children}
            </main>
        </div>
    )
}