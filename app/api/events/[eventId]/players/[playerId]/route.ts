import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string; playerId: string } }
) {
  try {
    const voteApp = req.headers.get("Vote-App");

    if (!voteApp || voteApp !== params.eventId) {
      return new NextResponse("Please insert correct data", { status: 400 });
    }

    const event = await db.event.findFirst({
      where: {
        id: params.eventId,
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    await pusherServer.trigger(event.id, "incoming-message", "");

    const player = await db.player.findFirst({
      where: {
        id: params.playerId,
        eventId: params.eventId,
      },
    });

    if (!player) {
      return new NextResponse("Player not found", { status: 404 });
    }

    if (!event.play || !event.start) {
      return new NextResponse("This vote is closed", { status: 400 });
    }

    await db.player.update({
      where: {
        eventId: params.eventId,
        id: params.playerId,
      },
      data: {
        point: {
          increment: 1,
        },
      },
    });

    return new NextResponse("Success to vote", { status: 200 });
  } catch (err: any) {
    console.log(err);
    return new NextResponse(err?.message || "Internal server error", {
      status: 500,
    });
  }
}
