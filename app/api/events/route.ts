import { db } from "@/lib/db";
import { randomString } from "@/lib/generator";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, player, notes, play, isPublished, duration } =
      await req.json();

    const event = await db.event.create({
      data: {
        name,
        player,
        notes,
        play,
        isPublished,
        duration,
        userId,
      },
    });

    await db.player.createMany({
      data: Array(event.player)
        .fill(0)
        .map((d) => ({
          eventId: event.id,
          avatar: randomString(10),
        })),
    });

    return NextResponse.json(event);
  } catch (err: any) {
    console.log(err);
    return new NextResponse(err?.message || "Internal server error", {
      status: 500,
    });
  }
}
