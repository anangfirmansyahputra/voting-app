"use client";

import { CalendarRange, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "./footer";
import { cn } from "@/lib/utils";

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
];

export default function SidebarMobile() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-full">
      <div className=" bg-white flex flex-col justify-between">
        <div className="p-3 space-y-1.5 flex-1">
          {MENUS.map((menu) => (
            <Link
              key={menu.label}
              href={menu.href}
              className={cn(
                "flex w-full text-sm text-muted-foreground items-center py-3.5 px-3 hover:text-primary-foreground hover:bg-primary/80 rounded-lg transition-all group hover:font-medium",
                pathname === menu.href &&
                  "bg-primary/80 text-primary-foreground"
              )}
            >
              {menu.icon}
              {menu.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
