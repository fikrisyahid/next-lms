"use server";

import prisma from "@/lib/db";
import type { MediaType } from "@prisma/client";

type GetAllCategoriesParams = {
  ebooks_count?: boolean;
  type?: MediaType;
};

async function getAllCategories({
  ebooks_count,
  type,
}: GetAllCategoriesParams) {
  try {
    const additionalSelect = ebooks_count
      ? {
          _count: {
            select: { ebooks: true },
          },
        }
      : {};

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      where: type ? { type } : {},
      include: additionalSelect,
    });

    const formattedCategories = categories.map((category) => ({
      ...category,
      ebooks_count: category._count?.ebooks || 0,
    }));

    return {
      status: "success",
      categories: formattedCategories,
      message: "Sukses mengambil daftar kategori",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal mengambil daftar kategori",
    };
  }
}

async function getCategory({ id }: { id: string }) {
  if (!id) {
    return {
      status: "error",
      message: "ID kategori wajib diisi",
    };
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return {
        status: "error",
        message: "Kategori tidak ditemukan",
      };
    }

    return {
      status: "success",
      category,
      message: "Sukses mengambil data kategori",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal mengambil data kategori",
    };
  }
}

export { getAllCategories, getCategory };
