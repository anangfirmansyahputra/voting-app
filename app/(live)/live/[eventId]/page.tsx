import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Timer from "./_components/timer";
import QrCode from "@/components/qr-code";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanQrCode, Undo2 } from "lucide-react";
import Link from "next/link";
import { AvatarComponent } from "@/components/avatar";

export default async function LivePage({
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

  const sortedPlayers = event?.players.sort((a, b) => b.point - a.point);
  const totalVotes = event?.players.reduce((sum, item) => sum + item.point, 0);

  return (
    <div className="bg-gray-50 h-full relative">
      <div className="space-y-5 flex flex-col absolute inset-5">
        <Link href={"/"}>
          <Button variant={"outline"} size={"icon"}>
            <Undo2 />
          </Button>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button size={"icon"}>
              <ScanQrCode />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="space-y-5">
              <DialogTitle className="text-center">QR Code</DialogTitle>
              <DialogDescription className="flex items-center justify-center">
                <QrCode />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Timer minutes={event?.duration!} />
      <div className="max-w-screen-xl mx-auto h-full space-y-10 flex flex-col">
        <div className="mb-10 space-y-5">
          <h1 className="text-center font-medium text-6xl uppercase mt-14">
            {event?.name}
          </h1>
        </div>

        <div
          className="grid grid-cols-4 gap-10 flex-1 pb-10 relative z-[50]"
          style={{
            gridTemplateColumns: `repeat(${event?.players.length}, minmax(0, 1fr))`,
          }}
        >
          {sortedPlayers!.map((player, index) => {
            const percentage = Math.round((player.point / totalVotes!) * 100);

            return (
              <div
                key={player.id}
                className="w-full space-y-3 h-full flex flex-col"
              >
                <div className="flex-1 flex flex-col space-y-5 justify-end">
                  <div className={cn("mx-auto space-y-2")}>
                    <div className="pb-2">
                      <p className="text-center font-bold text-2xl">
                        {player.name}
                      </p>
                      {player.description && (
                        <div className="text-center font-medium text-muted-foreground">
                          {player.description}
                        </div>
                      )}
                    </div>
                    <AvatarComponent id={player.avatar!} size={100} />
                  </div>
                  <div
                    style={{
                      height: player.point !== 0 ? `${percentage}%` : "10%",
                    }}
                    className={cn(
                      `bg-gray-200 py-5 flex items-center justify-center font-bold text-6xl`,
                      index === 0 && "bg-[#FFD700]"
                    )}
                  >
                    {player.point}
                  </div>
                </div>

                <div
                  className={cn(
                    `bg-gray-200 py-3 flex items-center justify-center font-bold text-6xl`,
                    index === 0 && "bg-[#FFD700]"
                  )}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
