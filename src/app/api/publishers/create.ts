"use server";

import prisma from "@/lib/db";
import { uploadToBucket } from "@/lib/storage/upload-to-bucket";

type Params = {
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

async function createPublisher({ name, logo }: Params) {
  if (!name) {
    return { status: "error", message: "Publisher name is required" };
  }

  try {
    const existingPublisher = await prisma.publisher.findFirst({
      where: { name },
    });

    if (existingPublisher) {
      return {
        status: "error",
        message: "Publisher with that name already exists",
      };
    }

    const logoUrl = await generateLogoUrl(logo);

    const newPublisher = await prisma.publisher.create({
      data: { name, logoUrl },
    });

    return {
      status: "success",
      publisher: newPublisher,
      message: "Publisher created successfully",
    };
  } catch (err) {
    console.error("createPublisher error:", err);
    return { status: "error", message: "Failed to create publisher" };
  }
}

export { createPublisher };
