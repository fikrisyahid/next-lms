"use client";

import type { ExtendedSubject } from "@/app/types";
import { CustomTable } from "@/components/custom-table";
import type { DataTableColumn } from "mantine-datatable";
import EbookDeleteSubjectModal from "../delete-subject-modal";
import EbookEditSubjectModal from "../edit-subject-modal";

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
    render: (record: ExtendedSubject) => (
      <div className="flex flex-row justify-center gap-2">
        <EbookEditSubjectModal id={record.id} name={record.name} />
        <EbookDeleteSubjectModal id={record.id} name={record.name} />
      </div>
    ),
  },
] as DataTableColumn<Record<string, unknown>>[];

export function SubjectTableClient({
  subjects: records,
}: {
  subjects: ExtendedSubject[];
}) {
  return (
    <CustomTable
      records={records}
      columns={columns}
      placeholder="Cari data mata pelajaran"
      noRecordsText="Tidak ada data mata pelajaran yang ditemukan"
    />
  );
}
