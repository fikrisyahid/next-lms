"use server";

import prisma from "@/lib/db";
import { supabase } from "@/lib/supabase";

type Params = {
  name: string;
  logo?: File; // tambahin
};

async function createPublisher({ name, logo }: Params) {
  if (!name) {
    return { status: "error", message: "Publisher name is required" };
  }

  try {
    const existingPublisher = await prisma.publisher.findFirst({
      where: { name },
    });
    if (existingPublisher) {
      return { status: "error", message: "Publisher already exists" };
    }

    let logoUrl: string | null = null;
    if (logo) {
      const fileName = `publishers/${Date.now()}-${logo.name}`;
      const { error } = await supabase.storage
        .from("publisher-logos")
        .upload(fileName, logo, { upsert: false });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("publisher-logos")
        .getPublicUrl(fileName);

      logoUrl = publicUrlData.publicUrl;
    }

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
