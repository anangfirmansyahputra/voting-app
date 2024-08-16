import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function PATCH(
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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new NextResponse("No files received.", { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");
    await writeFile(
      path.join(process.cwd(), "public/uploads/" + filename),
      buffer
    );

    const playerUpdate = await db.player.update({
      where: {
        id: params.playerId,
      },
      data: {
        image: filename,
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
