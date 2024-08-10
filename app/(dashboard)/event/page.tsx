import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableData } from "./_components/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function EventPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const events = await db.event.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="max-w-screen-xl mx-auto p-5 space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={"/"}>Browse</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={"/event"}>Event</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader className="flex items-center flex-row justify-between">
          <div>
            <CardTitle>Event</CardTitle>
            <CardDescription>{`Here's a list of your vote`}</CardDescription>
          </div>
          <Link href={"/event/create"}>
            <Button className="space-x-1" size={"sm"}>
              <PlusCircle className="w-5 h-5" />
              <span>Create</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <TableData data={events} />
        </CardContent>
      </Card>
    </div>
  );
}
