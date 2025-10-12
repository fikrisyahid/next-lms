"use server";

import prisma from "@/lib/db";
import bcrypt from "bcrypt";

async function addUser({
  fullname,
  username,
  password,
  role,
}: {
  fullname: string;
  username: string;
  password: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}) {
  if (!fullname || !username || !password || !role) {
    return {
      status: "error",
      message: "All fields are required",
    };
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    if (userExists) {
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
    });

    return {
      status: "success",
      user: newUser,
      message: "User created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create user",
    };
  }
}

export { addUser };
