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
      message: "All fields are required",
    };
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    if (userExists && userExists.id !== userId) {
      return {
        status: "error",
        message: "Username already exists",
      };
    }

    const dynamicData = {
      fullname,
      username,
      role,
      ...(password && { password: await bcrypt.hash(password, 10) }),
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dynamicData,
    });

    return {
      status: "success",
      user: updatedUser,
      message: "User updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update user",
    };
  }
}

export { updateUser };
