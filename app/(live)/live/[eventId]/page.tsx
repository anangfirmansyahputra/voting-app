"use client";

import { AvatarComponent } from "@/components/avatar";
import { cn } from "@/lib/utils";
import { Event, Player } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import Timer from "./_components/timer";
import { pusherClient } from "@/lib/pusher";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import FlipMove from "react-flip-move";

type EventWithPlayers = Event & {
  players: Player[];
};

const VotingComponent = ({
  sortedPlayers,
  totalVotes,
}: {
  sortedPlayers: Player[];
  totalVotes: number;
}) => {
  return (
    <div
      className="grid grid-cols-4 gap-10 flex-1 pb-10 relative z-[50]"
      style={{
        gridTemplateColumns: `repeat(${sortedPlayers.length}, minmax(0, 1fr))`,
      }}
    >
      <TransitionGroup>
        {sortedPlayers.map((player, index) => {
          const percentage = Math.round((player.point / totalVotes!) * 100);

          return (
            <CSSTransition key={player.id} timeout={500} classNames="item">
              <div className="w-full space-y-3 h-full flex flex-col">
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
                    <div className="mx-auto flex items-center justify-center">
                      <AvatarComponent id={player.avatar!} size={100} />
                    </div>
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
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </div>
  );
};

export default function LivePage({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<EventWithPlayers | null>(null);
  const [sortedPlayers, setSortedPlayers] = useState<Player[] | []>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  const fetchData = async () => {
    const { data } = await axios.get(`/api/events/${params.eventId}`);
    setSortedPlayers(
      (data as EventWithPlayers).players.sort((a, b) => b.point - a.point)
    );
    setTotalVotes(
      (data as EventWithPlayers).players.reduce(
        (sum, item) => sum + item.point,
        0
      )
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    pusherClient.subscribe(params.eventId);

    pusherClient.bind("incoming-message", async (text: string) => {
      // fetchData()
      await fetchData();
    });

    return () => {
      pusherClient.unsubscribe(params.eventId);
    };
  }, []);

  return (
    <div className="bg-gray-50 h-full relative">
      {/* <div className="space-y-5 flex flex-col absolute inset-5">
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
      </div> */}

      <Timer minutes={event?.duration!} />
      <div className="max-w-screen-xl mx-auto h-full space-y-10 flex flex-col">
        <div className="mb-10 space-y-5">
          <h1 className="text-center font-medium text-6xl uppercase mt-14">
            {event?.name}
          </h1>
        </div>

        <FlipMove
          className="grid grid-cols-6 gap-10 flex-1 pb-10 relative z-[50]"
          enterAnimation="fade"
          leaveAnimation="fade"
          // style={{ width: "100%" }}
        >
          {sortedPlayers!.map((player, index) => {
            const percentage = Math.round((player.point / totalVotes!) * 100);

            return (
              <div
                key={player.id}
                className="w-full space-y-3 h-full flex flex-col transition-transform duration-500 ease-in-out"
                style={{
                  transform: `scale(${player.point !== 0 ? 1.05 : 1})`,
                }}
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
                    <div className="mx-auto flex items-center justify-center">
                      <AvatarComponent id={player.avatar!} size={100} />
                    </div>
                  </div>
                  <div
                    style={{
                      height: player.point !== 0 ? `${percentage}%` : "10%",
                    }}
                    className={cn(
                      `bg-gray-200 py-5 flex items-center justify-center font-bold text-2xl transition-all duration-500 ease-in-out`,
                      index === 0 && "bg-[#FFD700]"
                    )}
                  >
                    {player.point}
                  </div>
                </div>

                <div
                  className={cn(
                    `bg-gray-200 py-3 flex items-center justify-center font-bold text-6xl transition-all duration-500 ease-in-out`,
                    index === 0 && "bg-[#FFD700]"
                  )}
                ></div>
              </div>
            );
          })}
        </FlipMove>
      </div>
    </div>
  );
}
