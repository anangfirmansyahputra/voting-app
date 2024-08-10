import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return new NextResponse("Please input event", { status: 400 });
    }

    const event = await db.event.findFirst({
      where: {
        id,
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    await db.event.update({
      where: {
        id,
      },
      data: {
        play: !event.play,
      },
    });

    return new NextResponse("Toggle event success");
  } catch (err: any) {
    console.log(err);
    return new NextResponse(err?.message || "Internal server error", {
      status: 500,
    });
  }
}
