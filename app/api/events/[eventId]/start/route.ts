import { db } from "@/lib/db";
import { randomString } from "@/lib/generator";
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
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    if (!event.play) {
      return new NextResponse("This event not play", { status: 400 });
    }

    await pusherServer.trigger(event.id, "start-vote", "");

    await db.event.update({
      where: {
        id: params.eventId,
      },
      data: {
        start: !event.start,
        key: randomString(6),
      },
    });

    return new NextResponse("Start event success", { status: 200 });
  } catch (err: any) {
    console.log(err);
    return new NextResponse(err?.message || "Internal server error", {
      status: 500,
    });
  }
}
