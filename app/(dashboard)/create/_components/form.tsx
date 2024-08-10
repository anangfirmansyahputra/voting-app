"use client";

import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Event } from "@prisma/client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  notes: z.string().optional(),
  player: z.string().min(1).max(2),
  duration: z.string().min(1).max(3),
});

export default function FormVote({ event }: { event?: Event }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event?.name! || "",
      notes: event?.notes || "",
      duration: String(event?.duration) || "0",
      player: String(event?.player) || "0",
    } || {
      name: "",
      notes: "",
      duration: "0",
      player: "0",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (event) {
        const { data } = await axios.patch(`/api/events/${event.id}`, {
          ...values,
          player: Number(values.player),
          duration: Number(values.duration),
        });
      } else {
        const { data } = await axios.post("/api/events", {
          ...values,
          player: Number(values.player),
          duration: Number(values.duration),
        });
      }

      toast({
        title: "Success",
        description: event
          ? "Update event voting success"
          : "Create event voting success",
      });
      router.push("/event");
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormDescription>This is your event vote name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="player"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Player</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>
                  This is how much player can be vote.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>
                  This is duration time of event will be held, please insert in
                  minutes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="submit">{event ? "Update" : "Submit"}</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/event")}
          >
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
}
