import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

import { auth } from "@clerk/nextjs/server";
import Form from "./_components/form";

export default async function JoinPage() {
  const { userId } = auth();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-primary to-orange-400">
      <Navbar userId={userId} />
      <div className="flex-1 pt-[80px] flex items-center justify-center px-5 md:px-0">
        <Form />
      </div>
      <Footer />
    </div>
  );
}
