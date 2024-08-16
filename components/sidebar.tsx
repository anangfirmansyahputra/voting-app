"use client";

import { cn } from "@/lib/utils";
import { CalendarRange, Globe, JoystickIcon, Vote } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "./footer";

const MENUS = [
  {
    label: "Browse",
    href: "/",
    icon: <Globe className="mr-2" />,
  },
  {
    label: "Event",
    href: "/event",
    icon: <CalendarRange className="mr-2" />,
  },
  {
    label: "Join",
    href: "/join",
    icon: <Vote className="mr-2" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="pt-[80px] h-full w-72 hidden lg:flex flex-col fixed inset-y-0 z-[48p]">
      <div className="h-full border-r bg-white flex flex-col">
        <div className="p-3 space-y-1.5 flex-1">
          {MENUS.map((menu) => (
            <Link
              key={menu.label}
              href={menu.href}
              className={cn(
                "flex w-full text-sm text-muted-foreground items-center py-3.5 px-3 hover:text-primary-foreground hover:bg-primary/80 rounded-lg transition-all group hover:font-medium",
                // Kondisi untuk path '/'
                pathname === "/" &&
                  menu.href === "/" &&
                  "bg-primary/80 text-primary-foreground",
                // Kondisi untuk path selain '/'
                pathname !== "/" &&
                  pathname.startsWith(menu.href) &&
                  menu.href !== "/" &&
                  "bg-primary/80 text-primary-foreground"
              )}
            >
              {menu.icon}
              {menu.label}
            </Link>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
}
