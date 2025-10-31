"use client";

import type { getAllCategories } from "@/app/api/categories";
import { createEbook } from "@/app/api/ebooks/create";
import type { getAllSubjects } from "@/app/api/subjects";
import { BASE_COLOR } from "@/config/color";
import { generatePdfThumbnail } from "@/lib/storage/generate-pdf-thumbnail";
import getFilesURL from "@/lib/storage/get-files-url";
import {
  Button,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import type {
  ClassLevel,
  Curriculum,
  EbookType,
  EducationLevel,
} from "@prisma/client";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EbooksData = {
  title: string;
  author: string;
  description: string;
  isbn: string;
  curriculum: Curriculum;
  classLevel: ClassLevel;
  educationLevel: EducationLevel;
  price: number;
  type: EbookType;
  file?: File | Blob;
  categoryId: string;
  subjectsId: string;
  publisherId: string;
};

type AddEbookModalProps = {
  subjects: Awaited<ReturnType<typeof getAllSubjects>>["subjects"];
  categories: Awaited<ReturnType<typeof getAllCategories>>["categories"];
};

export default function AddEbookModal({
  subjects,
  categories,
}: AddEbookModalProps) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<EbooksData>({
    initialValues: {
      title: "",
      author: "",
      description: "",
      isbn: "",
      curriculum: "NONCURRICULUM",
      classLevel: "NONCLASS",
      educationLevel: "UMUM",
      price: 0,
      type: "NONBSE",
      file: undefined,
      categoryId: "",
      subjectsId: "",
      publisherId: "",
    },
    validate: {
      title: (value) => (value ? null : "Judul e-Book wajib diisi"),
      author: (value) => (value ? null : "Penulis e-Book wajib diisi"),
      description: (value) => (value ? null : "Deskripsi e-Book wajib diisi"),
      isbn: (value) => (value ? null : "ISBN e-Book wajib diisi"),
      price: (value) =>
        value >= 0 ? null : "Harga e-Book wajib diisi dengan benar",
      type: (value) => (value ? null : "Tipe e-Book wajib diisi"),
      file: (value) => (value ? null : "File e-Book wajib diisi"),
      categoryId: (value) => (value ? null : "Kategori e-Book wajib diisi"),
      subjectsId: (value) =>
        value ? null : "Mata Pelajaran e-Book wajib diisi",
      publisherId: (value) => (value ? null : "Penerbit e-Book wajib diisi"),
    },
  });

  const handleSubmit = async (values: EbooksData) => {
    setLoading(true);
    try {
      // Upload PDF E-Book to supabase storage
      const {
        status: uploadPDFStatus,
        data: uploadPDFData,
        message: uploadPDFMessage,
      } = await getFilesURL({
        bucketName: "ebooks-pdf",
        files: values.file || undefined,
      });

      if (uploadPDFStatus === "error" || !uploadPDFData) {
        setLoading(false);
        notifications.show({
          title: "Gagal",
          message: uploadPDFMessage || "Gagal mengunggah file e-Book",
          color: "red",
        });
        return;
      }

      // Generate E-Book's thumbnail and upload to supabase storage
      // biome-ignore lint/style/noNonNullAssertion: <File is guaranteed to be present due to validation>
      const thumbnailBlob = await generatePdfThumbnail({ file: values.file! });
      const {
        status: thumbnailStatus,
        data: thumbnailData,
        message: thumbnailMessage,
      } = await getFilesURL({
        bucketName: "ebooks-thumbnail",
        files: thumbnailBlob,
      });

      if (thumbnailStatus === "error" || !thumbnailData) {
        setLoading(false);
        notifications.show({
          title: "Gagal",
          message: thumbnailMessage || "Gagal mengunggah thumbnail e-Book",
          color: "red",
        });
        return;
      }

      const result = await createEbook({
        ...values,
        fileUrl: uploadPDFData[0],
        thumbnailUrl: thumbnailData[0],
      });

      if (result.status === "error") {
        notifications.show({
          title: "Gagal",
          message: result.message || "Gagal menambahkan e-Book",
          color: "red",
        });
        setLoading(false);
        return;
      }

      notifications.show({
        title: "Sukses",
        message: `E-Book ${values.title} berhasil ditambahkan!`,
        color: "green",
      });

      form.reset();
      setOpened(false);
      modals.closeAll();
      router.refresh();
    } catch (_) {
      notifications.show({
        title: "Gagal",
        message: "Gagal menambahkan e-Book",
        color: "red",
      });
    }
    setLoading(false);
  };

  const confirmSubmit = (values: EbooksData) => {
    modals.openConfirmModal({
      title: "Konfirmasi Penambahan E-Book",
      centered: true,
      children: (
        <Text size="sm">
          Apakah kamu yakin ingin menambahkan E-Book dengan judul{" "}
          <b>{values.title}</b>?
        </Text>
      ),
      labels: { confirm: "Ya, Tambah", cancel: "Batal" },
      confirmProps: { color: BASE_COLOR.primary, loading },
      onConfirm: () => handleSubmit(values),
    });
  };

  return (
    <>
      <Button
        onClick={() => setOpened(true)}
        leftSection={<IconPlus stroke={1.5} />}
        color={BASE_COLOR.primary}
      >
        Tambah E-Book
      </Button>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          form.reset();
        }}
        title="Tambah E-Book Baru"
        centered
        size="xl"
      >
        <form onSubmit={form.onSubmit((values) => confirmSubmit(values))}>
          <Stack gap="sm">
            <TextInput
              label="Judul E-Book"
              placeholder="Masukkan judul e-book"
              required
              {...form.getInputProps("title")}
            />

            <TextInput
              label="Penulis"
              placeholder="Masukkan nama penulis"
              required
              {...form.getInputProps("author")}
            />

            <TextInput
              label="ISBN"
              placeholder="Masukkan nomor ISBN"
              required
              {...form.getInputProps("isbn")}
            />

            <TextInput
              label="Deskripsi"
              placeholder="Masukkan deskripsi singkat e-book"
              required
              {...form.getInputProps("description")}
            />

            <Select
              label="Kurikulum"
              placeholder="Pilih kurikulum"
              data={[
                { value: "K13", label: "K13" },
                { value: "MERDEKA", label: "Merdeka" },
                { value: "NONCURRICULUM", label: "Non Kurikulum" },
              ]}
              {...form.getInputProps("curriculum")}
            />

            <Select
              label="Jenjang Pendidikan"
              placeholder="Pilih jenjang"
              data={[
                { value: "SD", label: "SD" },
                { value: "SMP", label: "SMP" },
                { value: "SMA", label: "SMA" },
                { value: "UMUM", label: "Umum" },
              ]}
              {...form.getInputProps("educationLevel")}
            />

            <Select
              label="Kelas"
              placeholder="Pilih kelas"
              data={[
                { value: "NONCLASS", label: "Non Kelas" },
                { value: "I", label: "Kelas 1" },
                { value: "II", label: "Kelas 2" },
                { value: "III", label: "Kelas 3" },
                { value: "IV", label: "Kelas 4" },
                { value: "V", label: "Kelas 5" },
                { value: "VI", label: "Kelas 6" },
              ]}
              {...form.getInputProps("classLevel")}
            />

            <Select
              label="Tipe E-Book"
              placeholder="Pilih tipe"
              data={[
                { value: "BSE", label: "BSE" },
                { value: "NONBSE", label: "Non BSE" },
              ]}
              {...form.getInputProps("type")}
            />

            <NumberInput
              label="Harga"
              placeholder="Masukkan harga e-book"
              prefix="Rp"
              min={0}
              allowNegative={false}
              allowDecimal={false}
              required
              thousandSeparator="."
              decimalSeparator=","
              {...form.getInputProps("price")}
            />

            <Select
              label="Kategori"
              placeholder="Pilih kategori"
              data={[
                { value: "cat1", label: "Kategori 1" },
                { value: "cat2", label: "Kategori 2" },
              ]}
              required
              {...form.getInputProps("categoryId")}
            />

            <Select
              label="Mata Pelajaran"
              placeholder="Pilih mata pelajaran"
              data={[
                { value: "sub1", label: "Matematika" },
                { value: "sub2", label: "Bahasa Indonesia" },
              ]}
              required
              {...form.getInputProps("subjectsId")}
            />

            <Select
              label="Penerbit"
              placeholder="Pilih penerbit"
              data={[
                { value: "pub1", label: "Erlangga" },
                { value: "pub2", label: "Gramedia" },
              ]}
              required
              {...form.getInputProps("publisherId")}
            />

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                form.setFieldValue("file", e.currentTarget.files?.[0])
              }
              required
            />

            <Button
              type="submit"
              loading={loading}
              fullWidth
              color={BASE_COLOR.primary}
            >
              Tambah E-Book
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
