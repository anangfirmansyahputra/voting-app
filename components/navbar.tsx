import { UserButton } from "@clerk/nextjs";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="h-[80px] inset-y-0 w-full z-[49] fixed">
      <div className="p-4 gap-x h-full bg-white border-b flex items-center justify-between">
        {/* <h1 className="text-primary-foreground font-bold text-xl">
          Voting App
        </h1> */}
        <Image
          src={"/assets/logo.svg"}
          alt="Voting App"
          width={160}
          height={100}
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
        <UserButton />
      </div>
    </div>
  );
}
