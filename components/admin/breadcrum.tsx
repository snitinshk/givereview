import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
    label: string
    path: string
}

function capitalize(str: string) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

export default function Breadcrumb() {
    const pathname = usePathname()
    const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([])

    useEffect(() => {
        if (pathname) {
            const pathSegments = pathname.split('/').filter(Boolean)
            const items = pathSegments.map((segment, index) => {
                const path = `/${pathSegments.slice(0, index + 1).join('/')}`
                const label = index === 0 ? "Dashboard" : capitalize(segment.replace(/-/g, ' '))
                return { label, path }
            })
            setBreadcrumbItems(items)
        }
    }, [pathname])

    // Set page heading to the label of the last breadcrumb item
    const currentPageHeading = breadcrumbItems.length > 0 
        ? breadcrumbItems[breadcrumbItems.length - 1].label 
        : 'Home'

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">{currentPageHeading}</h1>
            <nav aria-label="breadcrumb" className='mb-5'>
                <ol className="flex space-x-2 text-gray-500">
                    {breadcrumbItems.map((item, index) => (
                        <li key={index} className="flex items-center gap-3 mr-1">
                            {index === breadcrumbItems.length - 1 ? (
                                <span className="text-gray-500">{item.label}</span>
                            ) : (
                                <Link href={item.path} className="text-black hover:underline">
                                    {item.label}
                                </Link>
                            )}
                            {index < breadcrumbItems.length - 1 && <span className="w-1 h-1 bg-gray-500 rounded block mt-1"></span>}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    )
}
