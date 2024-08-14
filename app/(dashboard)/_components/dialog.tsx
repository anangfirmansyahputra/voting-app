"use client";

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
import axios from "axios";
import { Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dialog({
  id,
  play,
  hasIncompletePlayer,
}: {
  id: string;
  play: boolean;
  hasIncompletePlayer: boolean;
}) {
  const router = useRouter();

  const onStart = async () => {
    try {
      await axios.post("/api/events/toggle", {
        id,
      });

      router.push(`/live/${id}`);
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {!play ? (
          <Button className="w-full" size={"sm"}>
            <Play className="w-4 h-4 mr-1" />
            Start
          </Button>
        ) : (
          <Button className="w-full" size={"sm"} variant={"secondary"}>
            <Pause className="w-4 h-4 mr-1" />
            Stop
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        {hasIncompletePlayer ? (
          <AlertDialogHeader>
            <AlertDialogTitle>Cannot do this action</AlertDialogTitle>
            <AlertDialogDescription>
              You must set name of each player on this event
            </AlertDialogDescription>
          </AlertDialogHeader>
        ) : (
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {`${
                play
                  ? "This action will stop your event voting"
                  : "This action will start your event voting and will be stoped automatically until the duration is finish"
              }`}
            </AlertDialogDescription>
          </AlertDialogHeader>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {!hasIncompletePlayer ? (
            <AlertDialogAction onClick={onStart}>Continue</AlertDialogAction>
          ) : (
            <AlertDialogAction
              onClick={() => router.push(`/event/${id}/player`)}
            >
              Set player name
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
