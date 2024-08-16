"use client";

import { AvatarComponent } from "@/components/avatar";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Event, Player } from "@prisma/client";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Image from "next/image";

type SelectUserProps = {
  event: Event & {
    players: Player[];
  };
  cookie: string | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SelectUser({
  event,
  cookie,
  setOpen,
}: SelectUserProps) {
  const [select, setSelect] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [voted, setVoted] = useState(false);

  const handleVote = async (playerId: string) => {
    setIsLoading(true);

    try {
      await axios.get(`/api/events/${event.id}/players/${playerId}`, {
        headers: {
          "Vote-App": event.id,
        },
      });
      setSelect(null);
      setName(null);
      Cookies.set("vote_app", event.key);
      setVoted(true);
      setOpen(true);
      toast("Thank you for your contribution");
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-5 md:p-0 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-5">
        {event.players.map((player) => (
          <div
            role="button"
            onClick={() => {
              if (!voted) {
                setSelect(player.id);
                setName(player.name);
              }
            }}
            key={player.id}
            className={cn(
              "relative h-full w-full p-10 md:p-5 flex flex-col border-2 items-center space-y-5 aspect-square justify-center bg-white rounded-lg group hover:border-primary transition-all",
              select === player.id && "border-primary"
            )}
          >
            <h5 className="font-medium text-2xl text-center">{player.name}</h5>
            <div className="flex-1 flex items-end">
              {player.image ? (
                <div className="relative aspect-square w-[150px] h-[150px] rounded-full border shadow overflow-hidden">
                  <Image
                    alt={player.name!}
                    fill
                    src={`/uploads/${player.image}`}
                    className="object-cover"
                  />
                </div>
              ) : (
                <AvatarComponent id={player.avatar!} size={150} />
              )}
            </div>

            <div className="opacity-0 transition-opacity duration-150 absolute group-hover:opacity-100 flex bg-[#222121b6] w-full h-full -top-5 left-0 rounded-lg items-center justify-center px-5">
              {/* <Button>Select</Button> */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full" disabled={isLoading}>
                    Submit
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. You will vote{" "}
                      <span className="font-bold">{name}</span> for event{" "}
                      <span className="font-bold">{event.name}</span>. So, make
                      sure for that
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleVote(player.id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
