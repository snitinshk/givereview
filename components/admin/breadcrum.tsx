interface BreadcrumbItem {
    label: string
    path: string
}


export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav aria-label="breadcrumb">
            <ol className="flex space-x-2 text-gray-500">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 mr-1">
                        <a href={item.path} className="text-black last:text-gray-500 hover:underline">
                            {item.label}
                        </a>
                        {index < items.length - 1 && <span className="w-1 h-1 bg-gray-500 rounded block mt-1"></span>}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
