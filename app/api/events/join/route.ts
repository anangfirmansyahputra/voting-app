import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    const event = await db.event.findFirst({
      where: {
        key: code,
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    return NextResponse.json(event, {
      status: 200,
    });
  } catch (err: any) {
    return new NextResponse(err?.message || "Internal server error", {
      status: 500,
    });
  }
}
