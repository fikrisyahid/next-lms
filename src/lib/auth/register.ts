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
  if (!fullname || !username || !password || !role) {
    return {
      status: "error",
      message: "All fields are required",
    }
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return {
      status: "error",
      message: "Username already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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

  return {
    status: "success",
    user: newUser,
    message: "User registered successfully",
  };
}
