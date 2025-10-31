"use server";

import prisma from "@/lib/db";
import type {
  ClassLevel,
  Curriculum,
  EbookType,
  EducationLevel,
} from "@prisma/client";

type CreateEbookParams = {
  title: string;
  author: string;
  description: string;
  isbn: string;
  curriculum: Curriculum;
  classLevel: ClassLevel;
  educationLevel: EducationLevel;
  price: number;
  type: EbookType;
  fileUrl: string;
  thumbnailUrl: string;
  categoryId: string;
  subjectsId: string;
  publisherId: string;
};

async function createEbook({
  author,
  categoryId,
  classLevel,
  curriculum,
  description,
  educationLevel,
  fileUrl,
  thumbnailUrl,
  isbn,
  price,
  publisherId,
  subjectsId,
  title,
  type,
}: CreateEbookParams) {
  if (
    !title ||
    !author ||
    !description ||
    !fileUrl ||
    !thumbnailUrl ||
    !isbn ||
    !price ||
    !publisherId ||
    !subjectsId ||
    !classLevel ||
    !curriculum ||
    !educationLevel ||
    !type ||
    !categoryId
  ) {
    return {
      status: "error",
      message: "Masih ada data yang kosong",
    };
  }

  try {
    const response = await prisma.ebook.create({
      data: {
        title,
        author,
        description,
        ISBN: isbn,
        curriculum,
        classLevel,
        educationLevel,
        price,
        type,
        fileUrl,
        thumbnailUrl,
        category: {
          connect: {
            id: categoryId,
          },
        },
        subjects: {
          connect: {
            id: subjectsId,
          },
        },
        publisher: {
          connect: {
            id: publisherId,
          },
        },
      },
    });

    return {
      status: "success",
      data: response,
      message: "E-Book berhasil dibuat",
    };
  } catch {
    return {
      status: "error",
      message: "Terjadi kesalahan saat membuat e-Book",
    };
  }
}

export { createEbook };
