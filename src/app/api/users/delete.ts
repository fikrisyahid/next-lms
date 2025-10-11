"use server";

import prisma from "@/lib/db";

async function deleteUser(id: string) {
  if (!id) {
    return {
      status: "error",
      message: "User ID is required",
    };
  }
  try {
    await prisma.user.delete({
      where: { id },
    });
    return {
      status: "success",
      message: "User deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete user",
    };
  }
}

export { deleteUser };
