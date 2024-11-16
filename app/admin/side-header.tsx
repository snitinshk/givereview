"use client";

import { useState, ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import Breadcrumb from "@/components/admin/breadcrum";
import { createClient } from "@/lib/supabase/supabase-client";
import Logo from "@/app/images/logo.svg";
import CLIMG from "@/app/images/clients-ico.svg";
import RVIMG from "@/app/images/reviews-ico.svg";
import STIMG from "@/app/images/settings-icon.svg";
import USERICON from "@/app/images/user-ico.svg";
import { MenuItem } from "@/interfaces/layout";
import { Toaster } from "@/components/ui/toaster";
import { capitalizeFirstLetter } from "@/lib/utils";

const IconWrapper = ({ src, alt }: { src: StaticImageData; alt: string }) => (
  <Image src={src} alt={alt} priority />
);

const menuItems: MenuItem[] = [
  {
    name: "Clients",
    path: "/admin/clients",
    clientNumber: 2,
    icon: () => <IconWrapper src={CLIMG} alt="Clients Icon" />,
  },
  {
    name: "Reviews",
    path: "/admin/analytics",
    icon: () => <IconWrapper src={RVIMG} alt="Reviews Icon" />,
  },
  {
    name: "Settings",
    path: "/admin/settings/channels",
    icon: () => <IconWrapper src={STIMG} alt="Settings Icon" />,
    submenu: [{ name: "Link Channels", path: "/admin/settings/channels" }],
  },
];

interface AdminLayoutProps {
  children: ReactNode;
  pageHeading?: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const [selectedPath, setSelectedPath] = useState("/admin/clients");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { slug } = useParams();

  if (slug) {
    const dynamicMenu = {
      name: capitalizeFirstLetter(slug as string),
      path: `/admin/clients/${slug}/review-link`,
      icon: () => <IconWrapper src={USERICON} alt="Clients Icon" />,
      submenu: [
        { name: "Review Link", path: `/admin/clients/${slug}/review-link` },
        { name: "Widget", path: `/admin/clients/${slug}/widget` },
        { name: "Settings", path: `/admin/clients/${slug}/settings` },
      ],
    };
    if (menuItems[1]?.name !== dynamicMenu?.name) {
      menuItems.splice(1, 0, dynamicMenu);
    }
  } else if (menuItems?.length === 4) {
    menuItems.splice(1, 1);
  }

  const handleNavigation = (path: string) => {
    setSelectedPath(path);
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

  return (
    <div className="flex min-h-screen bg-white">
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
                    <item.icon />
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

      <main className="flex-grow p-8">
        <Breadcrumb />
        <Toaster />
        {/* { alert?.visible && <CustomAlert uniqueIdenifier={Math.random()} type={alert?.type} title={alert?.title} message={alert?.message} />} */}
        {children}
      </main>
    </div>
  );
}
