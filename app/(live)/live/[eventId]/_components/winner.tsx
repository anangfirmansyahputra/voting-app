"use client";

import { AvatarComponent } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Player } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

export default function Winner({
  player,
  open,
  fetchData,
  setOpen,
}: {
  player: Player;
  open: boolean;
  fetchData: () => Promise<void>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const handleReset = async () => {
    await fetchData();
    setOpen(false);
    window.location.reload();
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl uppercase">
            The winner is?
          </DialogTitle>
          <DialogDescription className="space-y-5 pt-5 px-5 max-w-60 w-full mx-auto">
            <div>
              <h1 className="text-center text-4xl">{player.name}</h1>
              {player.description && (
                <p className="text-center text-lg">({player.description})</p>
              )}
              <h2 className="text-center font-bold text-4xl mt-2">
                {player.point}
              </h2>
            </div>
            <AvatarComponent
              customId={"custom-avatar" + player.avatar}
              id={player.avatar!}
              size={"100%"}
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-5">
          <Button className="w-full" onClick={handleReset}>
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
