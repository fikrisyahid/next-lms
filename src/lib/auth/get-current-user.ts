"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "default_secret";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET) as {
      id: string;
      username: string;
      role: string;
    };
    return decoded;
  } catch {
    return null;
  }
}
