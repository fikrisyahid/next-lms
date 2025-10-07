"use server";

import bcrypt from "bcrypt";
import prisma from "../db";

type RegisterInput = {
  fullname: string;
  username: string;
  password: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
};

export async function registerUser({
  fullname,
  username,
  password,
  role,
}: RegisterInput) {
  // Validasi basic
  if (!fullname || !username || !password || !role) {
    throw new Error("All fields are required");
  }

  // Cek apakah username udah dipake
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new Error("Username already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user baru
  const newUser = await prisma.user.create({
    data: {
      fullname,
      username,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      fullname: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });

  return newUser;
}
