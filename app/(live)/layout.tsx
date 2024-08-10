import Navbar from "@/components/navbar";
import React from "react";

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* <Navbar /> */}
      <main className="h-screen bg-gray-50">{children}</main>
    </div>
  );
}
