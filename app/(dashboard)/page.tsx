import EventCard from "@/components/event-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await db.event.updateMany({
    where: {
      userId,
    },
    data: {
      start: false,
      play: false,
    },
  });

  const events = await db.event.findMany({
    where: {
      userId,
    },
    include: {
      players: true,
    },
  });

  return (
    <div className="p-5 max-w-screen-xl mx-auto space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Browse</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-4 gap-5">
        {events.length === 0 && <div></div>}

        {events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            name={event.name}
            play={event.play}
            player={event.player}
            players={event.players}
          />
        ))}
      </div>
    </div>
  );
}
