"use client";

import { useState, ReactNode, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import Breadcrumb from "../../components/admin/breadcrum";
import { createClient } from "@/lib/supabase/supabase-client";
import Logo from "@/app/images/logo.svg";
import CLIMG from "@/app/images/clients-ico.svg";
import RVIMG from "@/app/images/reviews-ico.svg";
import STIMG from "@/app/images/settings-icon.svg";
import USERICON from "@/app/images/user-ico.svg";
import { useClients } from "../context/clients-context";
import { capitalizeFirstLetter } from "@/lib/utils";
import Loading from "@/components/loader/loading";
import { useLoader } from "../context/loader.context";

const IconWrapper = ({ src, alt }: { src: StaticImageData; alt: string }) => (
  <Image src={src} alt={alt} priority />
);

export interface MenuItem {
  name: string;
  path: string;
  icon?: ReactNode;
  clientNumber?: number;
  submenu?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  {
    name: "Clients",
    path: "/admin/clients",
    clientNumber: 0,
    icon: <IconWrapper src={CLIMG} alt="Clients Icon" />,
  },
  {
    name: "Reviews",
    path: "/admin/reviews",
    icon: <IconWrapper src={RVIMG} alt="Reviews Icon" />,
  },
  {
    name: "Settings",
    path: "/admin/settings/channels",
    icon: <IconWrapper src={STIMG} alt="Settings Icon" />,
    submenu: [{ name: "Link Channels", path: "/admin/settings/channels" }],
  },
];

interface AdminLayoutProps {
  children: ReactNode;
  pageHeading?: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { clients } = useClients();
  const { slug } = useParams();
  const { isLoading } = useLoader();

  const [selectedPath, setSelectedPath] = useState("/admin/clients");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const dynamicMenu = slug
    ? {
        name: capitalizeFirstLetter(slug as string),
        path: `/admin/clients/${slug}/review-link`,
        icon: <IconWrapper src={USERICON} alt="Clients Icon" />,
        submenu: [
          { name: "Review Link", path: `/admin/clients/${slug}/review-link` },
          { name: "Widget", path: `/admin/clients/${slug}/widget` },
          { name: "Settings", path: `/admin/clients/${slug}/settings` },
        ],
      }
    : null;

  const finalMenuItems: MenuItem[] = (() => {
    const updatedMenuItems = [...defaultMenuItems];
    if (dynamicMenu) {
      updatedMenuItems.splice(1, 0, dynamicMenu);
    }
    if (clients) {
      updatedMenuItems[0].clientNumber = clients.length;
    }
    return updatedMenuItems;
  })();

  const handleNavigation = (path: string) => {
    setSelectedPath(path);
    setSidebarOpen(false);
    router.push(path);
  };

  const toggleSubmenu = (path: string) => {
    setOpenSubmenu(openSubmenu === path ? null : path);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (!error) router.replace("/auth/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white flex-wrap">
      {/* Mobile Hamburger Menu */}
      <div className="flex lg:hidden justify-between items-center p-4 bg-white shadow-md">
        <Image src={Logo} alt="Logo" priority />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`w-[256px] bg-white pt-8 flex flex-col border-dashed border-r border-gray-300 px-2 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static h-full lg:h-auto transition-transform duration-300 z-50`}
      >
        <div className="flex justify-center mb-10">
          <Image src={Logo} alt="Logo" priority />
        </div>
        <nav>
          <ul>
            {finalMenuItems.map((item) => (
              <li key={item.path} className="relative mb-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-between text-left px-4 py-3 font-normal h-auto flex items-center ${
                    selectedPath === item.path
                      ? "!bg-[#00AB55]/[.08] !text-[#00AB55] !font-semibold"
                      : ""
                  }`}
                  onClick={() =>
                    item.submenu
                      ? toggleSubmenu(item.path)
                      : handleNavigation(item.path)
                  }
                >
                  <div className="flex items-center gap-4">
                    {item.icon}
                    {item.name}
                  </div>
                  <div className="flex items-center gap-4">
                    {item.clientNumber && (
                      <span className="ml-auto w-6 h-6 bg-[#FF5630]/[0.16] text-[#B71D18] flex justify-center items-center rounded-md">
                        {item.clientNumber}
                      </span>
                    )}
                    {item.submenu &&
                      (openSubmenu === item.path ? (
                        <ChevronDown />
                      ) : (
                        <ChevronRight />
                      ))}
                  </div>
                </Button>
                {item.submenu && openSubmenu === item.path && (
                  <ul className="mt-2 ml-2">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.path}>
                        <Button
                          variant="ghost"
                          className={`w-full flex gap-6 justify-start text-left px-4 py-2 text-gray-500 ${
                            selectedPath === subItem.path
                              ? "[&>span]:w-2 [&>span]:h-2 [&>span]:bg-[#00AB55] text-ftClor"
                              : ""
                          }`}
                          onClick={() => handleNavigation(subItem.path)}
                        >
                          <span className="w-1 h-1 bg-gray-500 rounded"></span>
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
          onClick={handleLogout}
          variant="ghost"
          className="mx-auto mt-36 justify-start text-left px-5 font-semibold py-3 h-auto text-white bg-[#36B37E]"
        >
          <LogOut className="mr-1 h-4 w-4" />
          Logout
        </Button>
      </aside>
      {sidebarOpen && (
        <div
          className="fixed left-0 top-0 w-full h-full backdrop-blur-sm z-30 bg-black bg-opacity-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      {/* Main Content */}
      <main className="lg:w-[calc(100vw-256px)] p-4 lg:p-8 w-screen relative">
        <Breadcrumb />
        {isLoading && <Loading />}
        <div className="mt-5">{children}</div>
      </main>
    </div>
  );
}
