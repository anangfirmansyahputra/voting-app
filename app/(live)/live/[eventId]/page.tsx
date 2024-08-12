"use client";

import { AvatarComponent } from "@/components/avatar";
import QrCode from "@/components/qr-code";
import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import { Event, Player } from "@prisma/client";
import axios from "axios";
import { Pause, PlaySquare, ScanQrCode, Undo2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import FlipMove from "react-flip-move";
import Timer from "./_components/timer";

type EventWithPlayers = Event & {
  players: Player[];
};

export default function LivePage({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<EventWithPlayers | null>(null);
  const [isStart, setIsStart] = useState(false);
  const [sortedPlayers, setSortedPlayers] = useState<Player[] | []>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  const fetchData = async () => {
    const { data }: { data: EventWithPlayers } = await axios.get(
      `/api/events/${params.eventId}`
    );
    setEvent(data);
    setIsStart(data.start);
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

  const handleStart = async () => {
    try {
      await axios.get(`/api/events/${params.eventId}/start`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    pusherClient.subscribe(params.eventId);

    pusherClient.bind("incoming-message", async (text: string) => {
      await fetchData();
    });

    return () => {
      pusherClient.unsubscribe(params.eventId);
    };
  }, []);

  return (
    <div className="bg-gray-50 h-full relative">
      <div className="space-y-5 flex flex-col absolute inset-5 w-fit h-fit">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={"/"}>
                <Button variant={"outline"} size={"icon"}>
                  <Undo2 />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to browse</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size={"icon"}>
              {isStart ? <Pause /> : <PlaySquare />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {isStart
                  ? " This action will pause this vote and people can't vote the player"
                  : "This action will start this vote and people can vote the player"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleStart();
                  if (isStart) {
                    setIsStart(false);
                  } else {
                    setIsStart(true);
                  }
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button size={"icon"} variant={"outline"}>
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

      {isStart && <Timer minutes={event?.duration!} />}
      <div className="max-w-screen-xl mx-auto h-full space-y-10 flex flex-col">
        <div className="mb-10 space-y-5 w-fit mx-auto">
          <h1
            className={cn(
              "text-center font-medium uppercase mt-14",
              event?.name?.length! < 20 ? "text-6xl" : "text-3xl"
            )}
          >
            {event?.name}
          </h1>
          <div className="w-full bg-primary h-1" />
        </div>

        <FlipMove
          className="grid gap-10 flex-1 pb-10 relative z-[50]"
          enterAnimation="fade"
          leaveAnimation="fade"
          style={{
            gridTemplateColumns: `repeat(${sortedPlayers.length}, minmax(0, 1fr))`,
          }}
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
