"use server";

import prisma from "@/lib/db";
import bcrypt from "bcrypt";

async function createUser({
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
      message: "Masih ada field yang kosong",
    };
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    if (userExists) {
      return {
        status: "error",
        message: "Username sudah digunakan",
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
      message: "Sukses membuat pengguna",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal membuat pengguna",
    };
  }
}

export { createUser };
