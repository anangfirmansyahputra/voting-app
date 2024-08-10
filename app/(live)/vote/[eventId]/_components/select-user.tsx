"use client";

import { AvatarComponent } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Event, Player } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
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

type SelectUserProps = {
  event: Event & {
    players: Player[];
  };
};

export default function SelectUser({ event }: SelectUserProps) {
  const [select, setSelect] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async () => {
    setIsLoading(true);

    try {
      await axios.get(`/api/events/${event.id}/players/${select}`);
      setSelect(null);
      setName(null);
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 w-full gap-5">
        {event.players.map((player) => (
          <div
            role="button"
            onClick={() => {
              setSelect(player.id);
              setName(player.name);
            }}
            key={player.id}
            className={cn(
              "w-full flex flex-col items-center space-y-5 border aspect-square justify-center bg-white rounded-lg hover:border-primary transition-all",
              select === player.id && "border-primary"
            )}
          >
            <h5 className="font-medium text-2xl">{player.name}</h5>
            {/* <div className="">
              <AvatarComponent id={player.avatar!} size={200} />
            </div> */}
            <div className="">
              <AvatarComponent id={player.avatar!} size={150} />
            </div>
          </div>
        ))}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full"
            size={"lg"}
            disabled={isLoading || select !== null ? false : true}
          >
            Submit
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You will vote{" "}
              <span className="font-bold">{name}</span> for event{" "}
              <span className="font-bold">{event.name}</span>. So, make sure for
              that
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVote}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
