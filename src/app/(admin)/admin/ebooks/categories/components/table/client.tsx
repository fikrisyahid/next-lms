"use client";

import type { ExtendedCategory } from "@/app/types";
import { CustomTable } from "@/components/custom-table";
import type { DataTableColumn } from "mantine-datatable";
import EbookDeleteCategoryModal from "../delete-category-modal";
import EbookEditCategoryModal from "../edit-category-modal";

const columns = [
  {
    accessor: "no",
    title: "No",
    textAlign: "center",
    width: 60,
    sortable: true,
  },
  { accessor: "name", title: "Nama", sortable: true, textAlign: "center" },
  {
    accessor: "ebooks_count",
    title: "Jumlah E-Books",
    sortable: true,
    textAlign: "center",
  },
  {
    accessor: "actions",
    title: "Aksi",
    textAlign: "center",
    width: 100,
    render: (record: ExtendedCategory) => (
      <div className="flex flex-row justify-center gap-2">
        <EbookEditCategoryModal id={record.id} name={record.name} />
        <EbookDeleteCategoryModal id={record.id} name={record.name} />
      </div>
    ),
  },
] as DataTableColumn<Record<string, unknown>>[];

export function CategoryTableClient({
  categories: records,
}: {
  categories: ExtendedCategory[];
}) {
  return (
    <CustomTable
      records={records}
      columns={columns}
      placeholder="Cari data kategori"
      noRecordsText="Tidak ada data kategori yang ditemukan"
    />
  );
}
