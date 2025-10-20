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
    return { status: "error", message: "Publisher id or name is required" };
  }

  try {
    const existingPublisher = await prisma.publisher.findFirst({
      where: { name },
    });

    if (existingPublisher?.name === name && existingPublisher.id !== id) {
      return {
        status: "error",
        message: "Publisher with that name already exists",
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
          message: "Failed to delete publisher logo from storage",
        };
      }
    }

    const logoUrl = logo ? await generateLogoUrl(logo) : undefined;

    const newPublisher = await prisma.publisher.update({
      where: { id },
      data: { name, ...(logoUrl && { logoUrl }) },
    });

    return {
      status: "success",
      publisher: newPublisher,
      message: "Publisher created successfully",
    };
  } catch (err) {
    console.error("updatePublisher error:", err);
    return { status: "error", message: "Failed to create publisher" };
  }
}

export { updatePublisher };
