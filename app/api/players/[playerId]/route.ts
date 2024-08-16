import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { writeFile, unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(
  req: Request,
  { params }: { params: { playerId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const player = await db.player.findFirst({
      where: {
        id: params.playerId,
      },
    });

    if (!player) {
      return new NextResponse("Player not found", { status: 404 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const avatar = formData.get("avatar") as string | null;
    const file = formData.get("file") as File | null;

    let filename = "";

    if (file) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      filename = Date.now() + file.name.replaceAll(" ", "_");
      await writeFile(path.join(uploadDir, filename), buffer);

      if (player.image) {
        await unlink(
          path.join(process.cwd(), "public/uploads/" + player.image)
        );
      }
    }

    const playerUpdate = await db.player.update({
      where: {
        id: params.playerId,
      },
      data: {
        description: description || player.description,
        name: name || player.name,
        isCreated: true,
        avatar: avatar || player.avatar,
        image: filename || player.image,
      },
    });

    return NextResponse.json(playerUpdate);
  } catch (err: any) {
    console.error("Error:", err); // Menambahkan logging untuk kesalahan
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
