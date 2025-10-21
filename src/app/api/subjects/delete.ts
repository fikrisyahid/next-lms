"use server";

import prisma from "@/lib/db";

async function deleteSubject({ id }: { id: string }) {
  if (!id) {
    return {
      status: "error",
      message: "ID mata pelajaran wajib diisi",
    };
  }

  try {
    await prisma.subjects.delete({
      where: { id },
    });

    return {
      status: "success",
      message: "Mata pelajaran berhasil dihapus",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal menghapus mata pelajaran",
    };
  }
}

export { deleteSubject };
