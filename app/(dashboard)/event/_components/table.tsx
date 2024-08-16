"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Event } from "@prisma/client";
import axios from "axios";
import { Ellipsis, Pencil, Trash, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type TableDataProps = {
  data: Event[];
};

export function TableData({ data }: TableDataProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/events/${id}`);
      router.refresh();
    } catch (err: any) {
      console.log(err);
      toast("Delete event failed", {
        description: err?.request?.response,
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <Table>
        <TableCaption>A list of your recent vote.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium">{d.name}</TableCell>
              <TableCell>{d.duration} Minutes</TableCell>
              <TableCell>{d.player}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      className="w-6 h-6"
                    >
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Event</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      role="button"
                      onClick={() => router.push(`/event/${d.id}/player`)}
                      className="space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <div>Players</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push(`/event/${d.id}`)}
                      className="space-x-2"
                    >
                      <Pencil className="w-4 h-4" />
                      <div>Edit</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      role="button"
                      className="space-x-2"
                      onClick={() => setOpen(true)}
                    >
                      <Trash className="w-4 h-4" />
                      <div>Delete</div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

              <AlertDialog open={open}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your event and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(d.id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          {/* <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow> */}
        </TableFooter>
      </Table>
    </>
  );
}
