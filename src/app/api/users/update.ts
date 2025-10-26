"use server";

import prisma from "@/lib/db";
import bcrypt from "bcrypt";

async function updateUser({
  userId,
  fullname,
  username,
  password,
  role,
}: {
  userId: string;
  fullname: string;
  username: string;
  password?: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}) {
  if (!userId || !fullname || !username || !role) {
    return {
      status: "error",
      message: "Masih ada field yang kosong",
    };
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    if (userExists && userExists.id !== userId) {
      return {
        status: "error",
        message: "Username sudah digunakan",
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullname,
        username,
        role,
        ...(password && { password: await bcrypt.hash(password, 10) }),
      },
    });

    return {
      status: "success",
      user: updatedUser,
      message: "Sukses memperbarui pengguna",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal memperbarui pengguna",
    };
  }
}

export { updateUser };
