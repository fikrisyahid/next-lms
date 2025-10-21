import { getAllCategories } from "@/app/api/categories";
import { CategoryTableClient } from "./client";

export default async function EbookCategoryTable() {
  const categoryAPIResponse = await getAllCategories({ ebooks_count: true });

  const categories =
    categoryAPIResponse.status === "success"
      ? categoryAPIResponse.categories || []
      : [];

  return (
    <div className="flex flex-col gap-4 items-center">
      <CategoryTableClient categories={categories} />
    </div>
  );
}
