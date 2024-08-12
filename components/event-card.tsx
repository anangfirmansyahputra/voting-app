"use client";

import { Badge } from "@/components/ui/badge";

import Dialog from "@/app/(dashboard)/_components/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Player } from "@prisma/client";
import { Globe, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type EventCardProps = {
  id: string;
  name: string;
  player: number;
  play: boolean;
  players: Player[];
};

export default function EventCard({
  id,
  name,
  player,
  play,
  players,
}: EventCardProps) {
  const router = useRouter();

  const hasIncompletePlayer = players.some((player) => !player.isCreated);

  return (
    <Card
      key={id}
      className="rounded-lg overflow-hidden shadow transition-shadow group relative"
    >
      <CardHeader className="relative aspect-video">
        <Image
          src={"/assets/card.webp"}
          alt={name}
          fill
          className="absolute object-cover"
        />
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        <p className="font-medium text-base group-hover:text-primary-foreground truncate">
          {name}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant={"secondary"} className="space-x-1">
            <User size={14} />
            <span className="text-xs">{player}</span>
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={!play ? "secondary" : "default"}
                  size={"icon"}
                  disabled={!play}
                  className="w-7 h-7"
                  onClick={() => router.push(`/live/${id}`)}
                >
                  <Globe />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Live Preview</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
      <CardFooter className="pb-5 px-3">
        <Dialog id={id} play={play} hasIncompletePlayer={hasIncompletePlayer} />
      </CardFooter>
    </Card>
  );
}
