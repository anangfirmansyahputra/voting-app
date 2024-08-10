import { AvatarComponent } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import SelectUser from "./_components/select-user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { create } from "@/app/action";
import { headers } from "next/headers";

export default async function VotePage({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await db.event.findFirst({
    where: {
      id: params.eventId,
    },
    include: {
      players: true,
    },
  });

  if (!event) {
    redirect("/");
  }

  const cookieStore = cookies();
  const token = cookieStore.get("vote_app");

  const headersList = headers();
  const ip = headersList.get("x-forwarded-for") || "121.0.0.1";

  console.log(ip);

  return (
    <div className="bg-gray-50 h-dvh">
      <div className="max-w-screen-lg flex flex-col items-center justify-center mx-auto h-full space-y-10 w-full">
        <h1 className="text-4xl font-semibold uppercase">{event.name}</h1>
        <SelectUser event={event} />
      </div>
    </div>
  );
}
