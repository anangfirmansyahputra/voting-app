"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3).max(50),
  notes: z.string().optional(),
  player: z.number().min(2).max(10, "You can insert max 10 player"),
  duration: z.number().min(1).max(1140, "Max duration is 1 day (1140)"),
  duration_type: z.string(),
});

export default function FormVote({ event }: { event?: Event }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event?.name! || "",
      notes: event?.notes || "",
      duration: Number(event?.duration) || 1,
      player: Number(event?.player) || 1,
      duration_type: event?.duration_type || "MINUTES",
    } || {
      name: "",
      notes: "",
      duration: 1,
      player: 1,
      duration_type: "",
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
      toast({
        title: "Error",
        description: "Create event failed, please try again",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-5">
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
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  This is how much player can be vote. Minimum is 1 and max is
                  10
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  This is duration time of event will be held, please insert in
                  minutes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="duration_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Duraton" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MINUTES">Minutes</SelectItem>
                      <SelectItem value="SECOND">Second</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This is type of duration, default value is minutes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
