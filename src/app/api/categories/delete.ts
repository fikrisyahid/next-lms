"use server";

import prisma from "@/lib/db";

async function deleteCategory({ id }: { id: string }) {
  if (!id) {
    return {
      status: "error",
      message: "ID kategori wajib diisi",
    };
  }

  try {
    await prisma.category.delete({
      where: { id },
    });

    return {
      status: "success",
      message: "Kategori berhasil dihapus",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal menghapus kategori",
    };
  }
}

export { deleteCategory };