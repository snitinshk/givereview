// Breadcrumb component
interface BreadcrumbItem {
    label: string
    path: string
}


export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
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
