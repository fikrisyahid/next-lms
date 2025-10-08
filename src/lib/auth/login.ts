"use server";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "../db";

const SECRET = process.env.JWT_SECRET || "default_secret";

export default async function login({
  username,
  password,
  rememberMe,
}: {
  username: string;
  password: string;
  rememberMe: boolean;
}) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { status: "error", errorMessage: "Username not registered" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { status: "error", errorMessage: "Invalid credentials" };
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET,
    { expiresIn: "1d" }
  );

  const cookieStore = await cookies();

  cookieStore.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * (rememberMe ? 30 : 1),
    path: "/",
    sameSite: "lax",
  });

  const { password: _, ...safeUser } = user;
  return { status: "success", user: safeUser };
}
