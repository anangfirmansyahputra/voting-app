import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <>
      <Navbar userId={userId} />
      <div className="flex pt-[80px]">
        <Sidebar />
        <div className="lg:pl-72 bg-gray-50 w-full h-full min-h-[calc(100vh-80px)]">
          {children}
        </div>
      </div>
    </>
  );
}
