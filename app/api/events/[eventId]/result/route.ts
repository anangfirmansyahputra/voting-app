import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorize", { status: 401 });
    }

    const event = await db.event.findFirst({
      where: {
        id: params.eventId,
      },
      include: {
        players: true,
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    await db.event.update({
      where: {
        id: event.id,
      },
      data: {
        start: false,
      },
    });

    for (const player of event.players) {
      await db.player.update({
        where: {
          id: player.id,
        },
        data: {
          point: 0,
        },
      });
    }

    await pusherServer.trigger(event.id, "start-vote", "");

    return new NextResponse("Result success", { status: 200 });
  } catch (err: any) {
    console.log(err);
    return new NextResponse(err?.message || "Internal server error", {
      status: 500,
    });
  }
}
