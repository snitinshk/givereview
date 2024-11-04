export interface MenuItem {
    name: string
    path: string
    icon: React.ComponentType
    submenu?: SubMenuItem[]
}

interface SubMenuItem {
    name: string
    path: string
}