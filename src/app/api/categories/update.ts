"use server";

import prisma from "@/lib/db";
import type { MediaType } from "@prisma/client";

async function updateCategory({
  id,
  name,
  type,
}: {
  id: string;
  name: string;
  type: MediaType;
}) {
  if (!id || !name || !type) {
    return {
      status: "error",
      message: "ID, nama kategori, dan tipe media wajib diisi",
    };
  }

  try {
    const existingCategory = await prisma.category.findFirst({
      where: { name, type },
    });

    if (existingCategory && existingCategory.id !== id) {
      return {
        status: "error",
        message: "Kategori dengan nama tersebut sudah ada",
      };
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, type },
    });

    return {
      status: "success",
      category: updatedCategory,
      message: "Sukses memperbarui kategori",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal memperbarui kategori",
    };
  }
}

export { updateCategory };
