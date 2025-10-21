import { Title } from "@mantine/core";
import EbookAddCategoryModal from "./components/add-category-modal";
import EbookCategoryTable from "./components/table";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-4 items-stretch">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Title>Daftar Kategori E-Books</Title>
        <EbookAddCategoryModal />
      </div>
      <EbookCategoryTable />
    </div>
  );
}
