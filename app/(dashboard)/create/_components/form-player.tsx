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
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import avatar from "animal-avatar-generator";
import { randomString } from "@/lib/generator";
import { AvatarComponent } from "@/components/avatar";
import { Upload } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
});

export default function FormPlayer({
  eventId,
  playerId,
  name,
  description,
  avatar,
  image,
}: {
  eventId: string;
  playerId: string;
  name?: string | null;
  description?: string | null;
  avatar?: string | null;
  image?: string | null;
}) {
  const [edit, setEdit] = useState(false);
  const [avatarCode, setAvatarCode] = useState(avatar);
  const [file, setFile] = useState<File | undefined>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || "",
      description: description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("avatar", avatarCode || "");

      if (file) {
        formData.append("file", file);
      }

      const { data } = await axios.post(`/api/players/${playerId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Success",
        description: "Update player success",
      });
      setEdit(false);
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-5">
              <FormField
                disabled={!edit}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Juara favorit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={!edit}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="relative w-[200px] h-[200px] mx-auto">
              <div className=" flex flex-col space-y-5 items-center">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Image"
                    width={200}
                    height={200}
                    className="rounded-full border aspect-square object-contain object-center"
                  />
                ) : image ? (
                  <Image
                    src={"/uploads/" + image}
                    alt="Image"
                    width={200}
                    height={200}
                    className="rounded-full border aspect-square object-contain object-center"
                  />
                ) : (
                  <AvatarComponent id={avatarCode!} />
                )}
                {edit && (
                  <div className="flex gap-2">
                    {!previewImage && (
                      <Button
                        type="button"
                        onClick={() => setAvatarCode(randomString(10))}
                      >
                        Generate
                      </Button>
                    )}

                    <div>
                      <Input
                        type="file"
                        ref={(e) => {
                          inputRef.current = e;
                        }}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setPreviewImage(imageUrl);
                            setFile(file);
                          }
                        }}
                        style={{ display: "none" }} // Sembunyikan input file
                      />
                      {edit && (
                        <Button
                          type="button"
                          onClick={handleClick}
                          variant={"outline"}
                        >
                          Upload Image
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {edit && (
            <div className="flex gap-3">
              <Button type="submit">Update</Button>
            </div>
          )}
        </form>
      </Form>
      {!edit && (
        <Button
          type="button"
          variant={"secondary"}
          className="mt-8"
          onClick={() => setEdit(true)}
        >
          Edit
        </Button>
      )}
    </>
  );
}
