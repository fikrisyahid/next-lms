"use server";

import prisma from "@/lib/db";

async function deleteUser(id: string) {
  if (!id) {
    return {
      status: "error",
      message: "ID pengguna wajib diisi",
    };
  }
  try {
    await prisma.user.delete({
      where: { id },
    });
    return {
      status: "success",
      message: "Sukses menghapus data pengguna",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal menghapus data pengguna",
    };
  }
}

export { deleteUser };
