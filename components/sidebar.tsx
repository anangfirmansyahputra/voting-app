"use client";

import { cn } from "@/lib/utils";
import { CalendarRange, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="pt-[80px] h-full w-72 flex flex-col fixed inset-y-0 z-[48p]">
      <div className="h-full border-r bg-white flex flex-col">
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
        <footer className="p-4 w-full bg-white border-t flex items-center justify-between">
          <div className="text-xs text-muted-foreground py-2 px-4 lg:flex-1">
            © 2024 Voting App
          </div>
        </footer>
      </div>
    </div>
  );
}
