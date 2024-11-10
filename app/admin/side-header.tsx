'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ReactNode } from 'react'
import { LogOut, ChevronDown, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MenuItem } from '@/interfaces/layout'
import Image, { StaticImageData } from "next/image"
import Logo from "@/app/images/logo.svg"
import CLIMG from "@/app/images/clients-ico.svg"
import RVIMG from "@/app/images/reviews-ico.svg"
import STIMG from "@/app/images/settings-icon.svg"
import CustomAlert from '@/components/alert/custom-alert'
import { createClient } from '@/lib/supabase/supabase-client'
import { useAlert } from '../context/alert-context'
// import { ShowAlert } from '../context/alert-context'



const IconWrapper = ({ src, alt }: { src: StaticImageData; alt: string }) => (
    <Image src={src} alt={alt} priority />
);

interface BreadcrumbItem {
    label: string
    path: string
}

const menuItems: MenuItem[] = [
    {
        name: 'Clients',
        path: '/admin/clients',
        clientNumber: 2,
        icon: () => <IconWrapper src={CLIMG} alt="Clients Icon" />,
        submenu: [
            { name: 'Client List', path: '/admin/clients/list' },
            { name: 'Add Client', path: '/admin/clients/add' },
        ],
    },
    { name: 'Reviews', path: '/admin/analytics', icon: () => <IconWrapper src={RVIMG} alt="Reviews Icon" /> },
    {
        name: 'Settings', path: '/admin/settings/channels', icon: () => <IconWrapper src={STIMG} alt="Settings Icon" />,
        submenu: [
            { name: 'Link Channels', path: '/admin/settings/channels' },
        ],
    },
];


const breadcrumItem = [
    {
        path: '/admin/settings',
        label: 'Settings'
    },
    {
        path: '/admin/settings/channels',
        label: 'channels'
    }
]

interface AdminLayoutProps {
    children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { alert } = useAlert()

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

    const handleLogout = async () => {

        const supabase = createClient()

        const { error } = await supabase.auth.signOut()
        if (!error) {
            router.replace('/auth/login')
        }
        //TODO: Handle else case
    }

    return (
        <div className="flex h-screen bg-white">
            {/* Left Menu */}
            <aside className="w-64 bg-white pt-8 flex flex-col border-dashed border-r border-gray-300 px-2">
                <div className="flex justify-center mb-10">
                    <Image src={Logo} alt="Logo" priority />
                </div>
                <nav>
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.path} className="relative mb-2">
                                <Button
                                    variant="ghost"
                                    // variant={selectedPath === item.path ? "secondary" : "ghost"}
                                    className={`w-full justify-between text-left px-4 py-3 font-normal h-auto flex items-center ${selectedPath === item.path ? '!bg-[#00AB55]/[.08] !text-[#00AB55] !font-semibold' : ''}`}
                                    onClick={() => item.submenu ? toggleSubmenu(item.path) : handleNavigation(item.path)}
                                >
                                    <div className='flex items-center gap-4'>
                                        <item.icon />
                                        {item.name}
                                    </div>
                                    <div className='flex items-center gap-4'>

                                        {item.clientNumber && <span className='ml-auto w-6 h-6 bg-[#FF5630]/[0.16] text-[#B71D18] flex justify-center items-center rounded-md'>{item.clientNumber}</span>}
                                        {item.submenu && (
                                            openSubmenu === item.path ? (
                                                <ChevronDown />
                                            ) : (
                                                <ChevronRight />
                                            )
                                        )}
                                    </div>
                                </Button>
                                {item.submenu && openSubmenu === item.path && (
                                    <ul className="mt-2 ml-2">
                                        {item.submenu.map((subItem) => (
                                            <li key={subItem.path}>
                                                <Button
                                                    variant="ghost"
                                                    //variant={selectedPath === subItem.path ? "secondary" : "ghost"}
                                                    className={`w-full flex gap-6 justify-start text-left px-4 py-2 text-gray-500 ${selectedPath === subItem.path ? "[&>span]:w-2 [&>span]:h-2 [&>span]:bg-[#00AB55] text-ftClor" : ""}`}
                                                    onClick={() => handleNavigation(subItem.path)}
                                                >

                                                    <span className='w-1 h-1 bg-gray-500 rounded'></span> {subItem.name}
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
                    onClick={handleLogout}
                    variant="ghost"
                    className="mx-auto mt-36 justify-start text-left px-5 font-semibold py-3 h-auto text-white bg-[#36B37E] "
                >
                    <LogOut className="mr-1 h-4 w-4" />
                    Logout
                </Button>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8">
                <Breadcrumb items={breadcrumItem} />
                {alert?.visible && <CustomAlert type={alert?.type} title={alert?.title} message={alert?.message} />}
                {children}
            </main>
        </div>
    )
}

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav aria-label="breadcrumb">
            <ol className="flex space-x-2 text-gray-500">
                {items.map((item, index) => (
                    <li key={index}>
                        <a href={item.path} className="hover:underline">
                            {item.label}
                        </a>
                        {index < items.length - 1 && <span className="mx-2">/</span>}
                    </li>
                ))}
            </ol>
        </nav>
    )
}