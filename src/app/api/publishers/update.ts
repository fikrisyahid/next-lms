"use server";

import prisma from "@/lib/db";
import { deleteFromBucket } from "@/lib/storage/delete-from-bucket";
import { extractFilePathFromUrl } from "@/lib/storage/extract-path";
import { uploadToBucket } from "@/lib/storage/upload-to-bucket";

type Params = {
  id: string;
  name: string;
  logo?: File;
};

async function generateLogoUrl(file?: File) {
  if (!file) return null;

  const { results } = await uploadToBucket({
    bucketName: "publisher-logos",
    files: file,
  });

  if (results && results.length > 0) {
    return results[0].publicUrl || null;
  }

  return null;
}

async function updatePublisher({ id, name, logo }: Params) {
  if (!id || !name) {
    return {
      status: "error",
      message: "ID dan nama penerbit wajib diisi",
    };
  }

  try {
    const existingPublisher = await prisma.publisher.findFirst({
      where: { name },
    });

    if (existingPublisher?.name === name && existingPublisher.id !== id) {
      return {
        status: "error",
        message: "Penerbit dengan nama tersebut sudah ada",
      };
    }

    const existingLogoUrl = existingPublisher?.logoUrl;
    if (logo && existingLogoUrl) {
      const filePath = extractFilePathFromUrl({
        bucketName: "publisher-logos",
        url: existingLogoUrl,
      });

      const { status: logoDeletedStatus } = await deleteFromBucket({
        bucketName: "publisher-logos",
        filePaths: filePath || "",
      });

      if (logoDeletedStatus === "error") {
        return {
          status: "error",
          message: "Gagal menghapus logo penerbit dari penyimpanan",
        };
      }
    }

    const logoUrl = logo ? await generateLogoUrl(logo) : undefined;

    const newPublisher = await prisma.publisher.update({
      where: { id },
      data: {
        name,
        ...(logoUrl && { logoUrl }),
      },
    });

    return {
      status: "success",
      publisher: newPublisher,
      message: "Sukses memperbarui penerbit",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal memperbarui penerbit",
    };
  }
}

export { updatePublisher };
