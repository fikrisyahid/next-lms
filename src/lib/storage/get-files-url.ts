import { uploadToBucket } from "./upload-to-bucket";

export default async function getFilesURL({
  bucketName,
  files,
}: {
  bucketName: string;
  files?: File | Blob | (File | Blob)[];
}) {
  if (!files)
    return {
      status: "error",
      message: "Gagal mendapatkan URL dari file, tidak ada file",
      data: null,
    };

  const fileArray = Array.isArray(files) ? files : [files];

  try {
    const { status, results, message } = await uploadToBucket({
      bucketName,
      files: fileArray,
    });

    if (status === "error") {
      return {
        status: "error",
        data: null,
        message,
      };
    }

    const formattedResults = results?.map((result) => result.publicUrl);

    return {
      status: "success",
      message: "Sukses mendapatkan URL dari file",
      data: formattedResults,
    };
  } catch {
    return {
      status: "error",
      message: "Gagal mendapatkan URL dari file",
      data: null,
    };
  }
}
