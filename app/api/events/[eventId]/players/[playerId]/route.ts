import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse, userAgent } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string; playerId: string } }
) {
  try {
    // @ts-ignore
    let ipAddress = req.headers["x-real-ip"] as string;

    // @ts-ignore
    const forwardedFor = req.headers["x-forwarded-for"] as string;
    if (!ipAddress && forwardedFor) {
      ipAddress = forwardedFor?.split(",").at(0) ?? "Unknown";
    }

    console.log(forwardedFor);

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

    const player = await db.player.findFirst({
      where: {
        id: params.playerId,
        eventId: params.eventId,
      },
    });

    if (!player) {
      return new NextResponse("Player not found", { status: 404 });
    }

    return NextResponse.json(player);
  } catch (err: any) {
    console.log(err);
    return new NextResponse(err?.message || "Internal server error", {
      status: 500,
    });
  }
}
