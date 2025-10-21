"use server";

import prisma from "@/lib/db";
import type { MediaType } from "@prisma/client";

async function createCategory({
  name,
  type,
}: {
  name: string;
  type: MediaType;
}) {
  if (!name || !type) {
    return {
      status: "error",
      message: "Nama kategori dan tipe media wajib diisi",
    };
  }

  try {
    const existingCategory = await prisma.category.findFirst({
      where: { name, type },
    });

    if (existingCategory) {
      return {
        status: "error",
        message: "Kategori dengan nama dan tipe media tersebut sudah ada",
      };
    }

    const newCategory = await prisma.category.create({
      data: { name, type },
    });

    return {
      status: "success",
      category: newCategory,
      message: "Kategori berhasil dibuat",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal membuat kategori",
    };
  }
}

export { createCategory };
