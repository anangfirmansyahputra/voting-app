import { randomString } from "@/lib/generator";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    // const { userId } = auth();

    // if (!userId) {
    //   return new NextResponse("Unauthorize", { status: 401 });
    // }

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

    // for (const player of event.players) {
    //   await db.player.update({
    //     where: {
    //       id: player.id,
    //     },
    //     data: {
    //       point: 0,
    //     },
    //   });
    // }

    return NextResponse.json(event);
  } catch (err: any) {
    console.log(err);
    return new NextResponse(err?.message || "Internal server error", {
      status: 500,
    });
  }
}

export async function POST(
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

    const { name, description } = await req.json();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    let nameFile;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + file.name.replaceAll(" ", "_");
      await writeFile(
        path.join(process.cwd(), "public/uploads/" + filename),
        buffer
      );

      nameFile = filename;
    }

    const player = await db.player.create({
      data: {
        eventId: params.eventId,
        description,
        name,
        image: nameFile,
      },
    });

    return NextResponse.json(player);
  } catch (err: any) {
    console.log(err);
    return new NextResponse(err?.message || "Internal server error", {
      status: 500,
    });
  }
}

export async function PATCH(
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
      orderBy: {
        createdAt: "asc",
      },
    });

    const body = await req.json();

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    const updatedEvent = await db.event.update({
      where: {
        id: params.eventId,
      },
      data: {
        ...body,
        play: false,
      },
    });

    if (body.player > event.player) {
      const playerToCreate = body.player - event.player;

      await db.player.createMany({
        data: Array(playerToCreate)
          .fill(0)
          .map((data) => ({
            eventId: event.id,
            avatar: randomString(10),
          })),
      });
    }

    if (body.player < event.player) {
      const playerToDeleted = event.player - body.player;
      const players = event.players;

      const dataToBeDeleted = players.slice(-playerToDeleted);

      for (const player of dataToBeDeleted) {
        await db.player.delete({
          where: {
            id: player.id,
          },
        });
      }
    }

    return NextResponse.json(updatedEvent, {
      status: 200,
    });
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
