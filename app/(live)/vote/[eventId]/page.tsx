"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { pusherClient } from "@/lib/pusher";
import { Event, Player } from "@prisma/client";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SelectUser from "./_components/select-user";

type EventWithPlayers = Event & {
  players: Player[];
};

export default function VotePage({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<EventWithPlayers | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const fetchEvent = async () => {
    try {
      const token = Cookies.get("vote_app") || null;

      const { data }: { data: EventWithPlayers } = await axios.get(
        `/api/events/${params.eventId}`
      );
      setEvent(data);
      setToken(token);

      if (token === data.key || !data.start) {
        setOpen(true);
      }

      return data;
    } catch (err) {
      console.log(err);
      setEvent(null);
    }
  };

  useEffect(() => {
    fetchEvent();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    pusherClient.subscribe(params.eventId);

    pusherClient.bind("start-vote", async (text: string) => {
      const event = await fetchEvent();
      const token = Cookies.get("vote_app") || null;

      if (event?.start && event.play && token !== event.key) {
        setOpen(false);
      }
    });

    return () => {
      pusherClient.unsubscribe(params.eventId);
    };
  }, []);

  if (!isLoaded) {
    return null;
  }

  if (!event) {
    return null;
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen h-dvh overflow-auto p-5">
        <div className="max-w-screen-md flex flex-col md:items-center md:justify-center mx-auto min-h-full space-y-5 sm:space-y-10 w-full">
          <h1 className="text-3xl sm:text-4xl text-center mt-10 md:mt-0 font-semibold uppercase">
            {event!.name}
          </h1>
          <SelectUser event={event!} cookie={token} setOpen={setOpen} />
        </div>
      </div>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {event!.start ? `You've already voted` : "Cannot Vote!"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {event!.start
                ? "You cannot vote more than once"
                : "Please wait the admin for start this voting"}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
