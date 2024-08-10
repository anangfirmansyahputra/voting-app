"use server";

import { cookies } from "next/headers";

export async function create(name: string, data: any) {
  cookies().set(name, data, { secure: true });
}
