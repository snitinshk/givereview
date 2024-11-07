export interface MenuItem {
    name: string
    path: string
    clientNumber?: number
    icon: React.ComponentType
    submenu?: SubMenuItem[]
}

interface SubMenuItem {
    name: string
    path: string
}