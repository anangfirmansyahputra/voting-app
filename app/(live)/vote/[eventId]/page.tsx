import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SelectUser from "./_components/select-user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default async function VotePage({
  params,
}: {
  params: { eventId: string };
}) {
  let open = false;
  const event = await db.event.findFirst({
    where: {
      id: params.eventId,
    },
    include: {
      players: true,
    },
  });

  if (!event) {
    redirect("/");
  }

  const cookieStore = cookies();
  const token = cookieStore.get("vote_app")?.value || null;

  if (token === event.id) {
    open = true;
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen h-full overflow-auto p-5">
        <div className="max-w-screen-md flex flex-col md:items-center md:justify-center mx-auto min-h-full space-y-5 sm:space-y-10 w-full">
          <h1 className="text-3xl sm:text-4xl text-center mt-10 md:mt-0 font-semibold uppercase">
            {event.name}
          </h1>
          <SelectUser event={event} cookie={token} />
        </div>
      </div>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`You've already voted`}</AlertDialogTitle>
            <AlertDialogDescription>
              You cannot vote more than once
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
