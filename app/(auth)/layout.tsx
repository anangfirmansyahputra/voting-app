import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="flex flex-col w-full h-screen">
    // <Navbar />
    // <div className="flex-1">{children}</div>
    // <Footer />
    // </div>
    children
  );
}
