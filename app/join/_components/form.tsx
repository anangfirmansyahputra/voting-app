"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Event } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Form() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const { data }: { data: Event } = await axios.post("/api/events/join", {
        code,
      });

      router.push(`/vote/${data.id}`);
    } catch (err: any) {
      toast("Failed", {
        description: "Code or event is not found, please try again",
      });
    } finally {
      setCode("");
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="space-y-5">
        <div>
          <CardTitle className="text-center">Vote App</CardTitle>
          <CardDescription className="text-center">
            Join voting with inputing a code
          </CardDescription>
        </div>
        <div className="mt-5">
          <Image
            src={"/assets/4409002.jpg"}
            alt="Vote"
            width={500}
            height={500}
            className="aspect-video rounded"
          />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="code">Code</Label>
              <Input
                disabled={isLoading}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                id="code"
                placeholder="Input your code event from admin vote"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="grid sm:grid-cols-2 gap-2">
        <Button disabled={isLoading} type="submit" onClick={handleSubmit}>
          Join
        </Button>
        <Button variant={"outline"} onClick={() => router.push("/")}>
          Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}
