"use client";

import { useState, ReactNode, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import Breadcrumb from "../../components/admin/breadcrum";
import { createClient } from "@/lib/supabase/supabase-client";
import Logo from "@/app/images/logo.svg";
import USERICON from "@/app/images/user-ico.svg";
import { useClients } from "../context/clients-context";
import { capitalizeFirstLetter } from "@/lib/utils";
import Loading from "@/components/loader/loading";
import { useLoader } from "../context/loader.context";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
    icon: (
      <svg
        width="20"
        height="19"
        viewBox="0 0 20 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 8.9436C9.20914 8.9436 11 7.15274 11 4.9436C11 2.73446 9.20914 0.943604 7 0.943604C4.79086 0.943604 3 2.73446 3 4.9436C3 7.15274 4.79086 8.9436 7 8.9436Z" />
        <path d="M15 10.9436C16.6569 10.9436 18 9.60046 18 7.9436C18 6.28675 16.6569 4.9436 15 4.9436C13.3431 4.9436 12 6.28675 12 7.9436C12 9.60046 13.3431 10.9436 15 10.9436Z" />
        <path d="M19 17.9436C19.5523 17.9436 20 17.4959 20 16.9436C19.9984 15.0369 18.9125 13.2971 17.2003 12.4581C15.4882 11.619 13.4479 11.8267 11.94 12.9936C9.93708 10.9985 6.93071 10.4041 4.31923 11.4867C1.70774 12.5694 0.0038243 15.1166 0 17.9436C0 18.4959 0.447715 18.9436 1 18.9436H13C13.5523 18.9436 14 18.4959 14 17.9436" />
      </svg>
    ),
  },
  {
    name: "Reviews",
    path: "/admin/reviews",
    icon: (
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.08824 0.443604H17.5C19.2056 0.443604 20.5882 1.82625 20.5882 3.53184V13.826C20.5882 15.5315 19.2056 16.9142 17.5 16.9142H6.74265C6.54396 16.9065 6.34732 16.9566 6.17647 17.0583L1.55441 19.8583C1.39552 19.9526 1.21417 20.0024 1.02941 20.0024C0.852571 20.0019 0.678851 19.9558 0.525 19.8686C0.201263 19.6866 0.000639979 19.3444 0 18.973V3.53184C0 1.82625 1.38265 0.443604 3.08824 0.443604ZM5.14706 8.6789C5.14706 9.24743 5.60794 9.70831 6.17647 9.70831C6.745 9.70831 7.20588 9.24743 7.20588 8.6789C7.20588 8.11037 6.745 7.64949 6.17647 7.64949C5.60794 7.64949 5.14706 8.11037 5.14706 8.6789ZM10.2941 9.70831C9.72559 9.70831 9.26471 9.24743 9.26471 8.6789C9.26471 8.11037 9.72559 7.64949 10.2941 7.64949C10.8626 7.64949 11.3235 8.11037 11.3235 8.6789C11.3235 9.24743 10.8626 9.70831 10.2941 9.70831ZM13.3824 8.6789C13.3824 9.24743 13.8432 9.70831 14.4118 9.70831C14.9803 9.70831 15.4412 9.24743 15.4412 8.6789C15.4412 8.11037 14.9803 7.64949 14.4118 7.64949C13.8432 7.64949 13.3824 8.11037 13.3824 8.6789Z"
        />
      </svg>
    ),
  },
  {
    name: "Settings",
    path: "/admin/settings/channels",
    icon: (
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.438 0.943604C14.6242 0.943609 14.8056 1.00121 14.9561 1.10811C15.1066 1.21501 15.2184 1.36569 15.2753 1.53846L16.2428 4.46817C16.6492 4.66189 17.0379 4.8796 17.4091 5.12475L20.4979 4.47675C20.6801 4.43885 20.8698 4.45827 21.0399 4.53221C21.21 4.60615 21.3516 4.73079 21.4443 4.88818L23.8823 9.00075C23.9754 9.15804 24.0149 9.34009 23.995 9.52064C23.975 9.70118 23.8968 9.8709 23.7715 10.0053L21.6519 12.2853C21.6827 12.7225 21.6827 13.1613 21.6519 13.5985L23.7715 15.8819C23.8968 16.0163 23.975 16.186 23.995 16.3666C24.0149 16.5471 23.9754 16.7292 23.8823 16.8865L21.4443 21.0007C21.3513 21.1578 21.2096 21.2821 21.0396 21.3557C20.8695 21.4293 20.6799 21.4485 20.4979 21.4105L17.4091 20.7625C17.0397 21.0059 16.6492 21.2253 16.2446 21.419L15.2753 24.3487C15.2184 24.5215 15.1066 24.6722 14.9561 24.7791C14.8056 24.886 14.6242 24.9436 14.438 24.9436H9.56196C9.37576 24.9436 9.19435 24.886 9.04388 24.7791C8.89341 24.6722 8.78164 24.5215 8.72466 24.3487L7.75894 21.4207C7.3537 21.2276 6.96282 21.0071 6.58918 20.7607L3.50206 21.4105C3.31993 21.4484 3.13017 21.4289 2.9601 21.355C2.79003 21.2811 2.64842 21.1564 2.55569 20.999L0.117655 16.8865C0.0245565 16.7292 -0.014877 16.5471 0.00504009 16.3666C0.0249572 16.186 0.103196 16.0163 0.228475 15.8819L2.34812 13.5985C2.31742 13.1624 2.31742 12.7248 2.34812 12.2887L0.228475 10.0053C0.103196 9.8709 0.0249572 9.70118 0.00504009 9.52064C-0.014877 9.34009 0.0245565 9.15804 0.117655 9.00075L2.55569 4.88646C2.64868 4.72939 2.79039 4.6051 2.96044 4.53148C3.13049 4.45786 3.32012 4.4387 3.50206 4.47675L6.58918 5.12646C6.9621 4.88132 7.35261 4.66018 7.75894 4.46646L8.72642 1.53846C8.78321 1.36625 8.89445 1.21597 9.04422 1.10912C9.19399 1.00227 9.3746 0.944333 9.56021 0.943604H14.4363H14.438ZM13.7942 2.65789H10.2058L9.20664 5.68703L8.53292 6.0076C8.20173 6.16555 7.88201 6.3454 7.576 6.54589L6.9533 6.95732L3.75888 6.28532L1.96465 9.31617L4.15466 11.6785L4.10189 12.4053C4.07662 12.7638 4.07662 13.1235 4.10189 13.4819L4.15466 14.2087L1.96113 16.571L3.75712 19.6019L6.95154 18.9316L7.57424 19.3413C7.88025 19.5418 8.19997 19.7217 8.53116 19.8796L9.20488 20.2002L10.2058 23.2293H13.7977L14.8004 20.1985L15.4724 19.8796C15.8032 19.722 16.1224 19.5422 16.4275 19.3413L17.0485 18.9316L20.2446 19.6019L22.0389 16.571L19.8471 14.2087L19.8999 13.4819C19.9252 13.1229 19.9252 12.7626 19.8999 12.4036L19.8471 11.6767L22.0406 9.31617L20.2446 6.28532L17.0485 6.95389L16.4275 6.54589C16.1224 6.345 15.8032 6.16513 15.4724 6.0076L14.8004 5.68875L13.796 2.65789H13.7942ZM12 7.80075C13.3996 7.80075 14.7418 8.34258 15.7315 9.30705C16.7212 10.2715 17.2771 11.5796 17.2771 12.9436C17.2771 14.3076 16.7212 15.6157 15.7315 16.5802C14.7418 17.5446 13.3996 18.0865 12 18.0865C10.6004 18.0865 9.25816 17.5446 8.2685 16.5802C7.27885 15.6157 6.72287 14.3076 6.72287 12.9436C6.72287 11.5796 7.27885 10.2715 8.2685 9.30705C9.25816 8.34258 10.6004 7.80075 12 7.80075ZM12 9.51503C11.0669 9.51503 10.1721 9.87626 9.51234 10.5192C8.85257 11.1622 8.48191 12.0343 8.48191 12.9436C8.48191 13.8529 8.85257 14.725 9.51234 15.368C10.1721 16.011 11.0669 16.3722 12 16.3722C12.9331 16.3722 13.8279 16.011 14.4877 15.368C15.1474 14.725 15.5181 13.8529 15.5181 12.9436C15.5181 12.0343 15.1474 11.1622 14.4877 10.5192C13.8279 9.87626 12.9331 9.51503 12 9.51503Z" />
      </svg>
    ),
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
  const pathname = usePathname();

  useEffect(() => {
    setSelectedPath(pathname);
    setOpenSubmenu(pathname);
    // setSidebarOpen(true);
  }, [pathname]);

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const dynamicMenu = slug
    ? {
        name: capitalizeFirstLetter(slug as string),
        path: `/admin/clients/${slug}/review-link`,
        icon: (
          <svg
            width="14"
            height="19"
            viewBox="0 0 14 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 8.94336C9.20914 8.94336 11 7.1525 11 4.94336C11 2.73422 9.20914 0.943359 7 0.943359C4.79086 0.943359 3 2.73422 3 4.94336C3 7.1525 4.79086 8.94336 7 8.94336Z" />
            <path d="M13 18.9434C13.5523 18.9434 14 18.4956 14 17.9434C14 14.0774 10.866 10.9434 7 10.9434C3.13401 10.9434 5.76078e-08 14.0774 0 17.9434C0 18.4956 0.447715 18.9434 1 18.9434H13Z" />
          </svg>
        ),
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
        <Link href={"/admin/clients"}>
          <Image src={Logo} alt="Logo" priority />
        </Link>
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
          <Link href={"/admin/clients"}>
            <Image src={Logo} alt="Logo" priority />
          </Link>
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
                    <span
                      className={`[&>svg]:fill-[#637381] ${
                        selectedPath === item.path
                          ? "[&>svg]:!fill-[#00AB55]"
                          : ""
                      }`}
                    >
                      {item.icon}
                    </span>
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
      <main className="lg:w-[calc(100vw-280px)] p-4 lg:p-8 w-screen relative">
        <Breadcrumb />
        {isLoading && <Loading />}
        <div className="mt-5">{children}</div>
      </main>
    </div>
  );
}