"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";
import { LogIn, Menu } from "lucide-react";
import Image from "next/image";
import SidebarMobile from "./sidebar-mobile";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Navbar({ userId }: { userId: string | null }) {
  const router = useRouter();

  return (
    <div className="h-[80px] inset-y-0 w-full z-[49] fixed">
      <div className="p-4 gap-x h-full bg-white border-b flex items-center justify-between">
        <Image
          src={"/assets/logo.svg"}
          alt="Voting App"
          width={160}
          height={150}
          className="aspect-video md:block hidden"
        />
        <Image
          src={"/assets/LOGO VOTING APP.png"}
          alt="Voting App"
          width={50}
          height={60}
          className="aspect-video object-cover block md:hidden ml-2"
        />
        <div className="border flex items-center rounded overflow-hidden"></div>
        <div className="hidden lg:block">
          {userId ? (
            <UserButton />
          ) : (
            <Button
              variant={"outline"}
              className="flex items-center space-x-1"
              onClick={() => router.push("/sign-in")}
            >
              <span>Login</span>
              <LogIn className="w-5 h-5 text-[#222]" />
            </Button>
          )}
        </div>
        <div className="block lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Menu />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetDescription className="mt-5">
                  <>
                    <div className="mx-3 border border-dashed rounded-lg py-2 flex items-center justify-center bg-gray-50 shadow">
                      <UserButton />
                    </div>
                    <SidebarMobile />
                  </>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
