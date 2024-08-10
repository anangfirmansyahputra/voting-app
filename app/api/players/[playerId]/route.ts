import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { playerId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorize", { status: 401 });
    }

    const player = await db.player.findFirst({
      where: {
        id: params.playerId,
      },
    });

    if (!player) {
      return new NextResponse("player not found", { status: 404 });
    }

    const { name, description, avatar } = await req.json();

    const playerUpdate = await db.player.update({
      where: {
        id: params.playerId,
      },
      data: {
        description,
        name,
        isCreated: true,
        avatar,
      },
    });

    return NextResponse.json(playerUpdate);
  } catch (err: any) {
    console.log(err);
    return new NextResponse(err?.message || "Internal server error", {
      status: 500,
    });
  }
}

export async function DELETE(
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

    await db.event.delete({
      where: {
        id: params.eventId,
      },
    });

    return new NextResponse("Delete event success", {
      status: 200,
    });
  } catch (err: any) {
    console.log(err);
    return new NextResponse(err?.message || "Internal server error", {
      status: 500,
    });
  }
}
