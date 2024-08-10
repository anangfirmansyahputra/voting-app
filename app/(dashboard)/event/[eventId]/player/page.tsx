import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormPlayer from "../../../create/_components/form-player";
import { db } from "@/lib/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function EventPage({
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

  return (
    <div className="p-5 space-y-5 max-w-screen-xl mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/event/${event?.id}`}>
              {event?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Player</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-2 gap-5">
        {event?.players.map((player, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{`Player ${index + 1}`}</CardTitle>
                <CardDescription>Form player</CardDescription>
              </div>
              {!player.isCreated && (
                <p className="text-sm text-muted-foreground">
                  This player need to be updated
                </p>
              )}
            </CardHeader>
            <CardContent>
              <FormPlayer
                description={player.description}
                name={player.name}
                avatar={player.avatar}
                eventId={params.eventId}
                playerId={player.id}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
