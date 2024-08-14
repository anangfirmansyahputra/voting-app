"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";
import SidebarMobile from "./sidebar-mobile";

export default function Navbar() {
  return (
    <div className="h-[80px] inset-y-0 w-full z-[49] fixed">
      <div className="p-4 gap-x h-full bg-white border-b flex items-center justify-between">
        <Image
          src={"/assets/logo.svg"}
          alt="Voting App"
          width={160}
          height={150}
          className="aspect-video"
        />
        <div className="border flex items-center rounded overflow-hidden">
          {/* <input />
          <Button
            size={"icon"}
            className="w-8 h-8 rounded-none"
            variant={"secondary"}
          >
            <X />
          </Button>
          <Button size={"icon"} className="w-8 h-8 rounded-none">
            <Search />
          </Button> */}
        </div>
        <div className="hidden md:block">
          <UserButton />
        </div>
        <div className="block md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Menu />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetDescription>
                  <UserButton />
                  <SidebarMobile />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
