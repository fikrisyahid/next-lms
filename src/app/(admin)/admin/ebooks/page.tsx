import { Text, Title } from "@mantine/core";
import AddEbookModal from "./components/add-ebook-modal";
import { getAllSubjects } from "@/app/api/subjects";
import { getAllCategories } from "@/app/api/categories";

export default async function EbooksPage() {
  const { subjects } = await getAllSubjects();
  const { categories } = await getAllCategories();

  const isFetchError = !subjects || !categories;

  return (
    <div className="flex flex-col gap-4 items-stretch">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Title>Daftar E-Books</Title>
        <AddEbookModal
          subjects={subjects || []}
          categories={categories || []}
        />
      </div>
      {isFetchError ? (
        <Text>Gagal memuat data. Silakan muat ulang halaman.</Text>
      ) : (
        <Text>Data berhasil dimuat.</Text>
      )}
    </div>
  );
}
