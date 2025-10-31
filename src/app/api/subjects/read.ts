"use server";

import prisma from "@/lib/db";

type GetAllSubjectsParams = {
  ebooks_count?: boolean;
};

async function getAllSubjects({ ebooks_count }: GetAllSubjectsParams = {}) {
  try {
    const additionalSelect = ebooks_count
      ? {
          _count: {
            select: { ebooks: true },
          },
        }
      : {};

    const subjects = await prisma.subjects.findMany({
      orderBy: { name: "asc" },
      include: additionalSelect,
    });

    const formattedSubjects = subjects.map((subject) => ({
      ...subject,
      ebooks_count: subject._count?.ebooks || 0,
    }));

    return {
      status: "success",
      subjects: formattedSubjects,
      message: "Sukses mengambil daftar mata pelajaran",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal mengambil daftar mata pelajaran",
    };
  }
}

async function getCategory({ id }: { id: string }) {
  if (!id) {
    return {
      status: "error",
      message: "ID mata pelajaran wajib diisi",
    };
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return {
        status: "error",
        message: "Mata pelajaran tidak ditemukan",
      };
    }

    return {
      status: "success",
      category,
      message: "Sukses mengambil data mata pelajaran",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal mengambil data mata pelajaran",
    };
  }
}

export { getAllSubjects, getCategory };
