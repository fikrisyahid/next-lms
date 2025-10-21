"use client";

import type { ExtendedPublisher } from "@/app/types";
import { CustomTable } from "@/components/custom-table";
import type { DataTableColumn } from "mantine-datatable";
import DeletePublisherModal from "../delete-publisher-modal";
import Image from "next/image";
import { IconPhoto } from "@tabler/icons-react";
import EditPublisherModal from "../edit-publisher-modal";

const columns = [
  {
    accessor: "no",
    title: "No",
    textAlign: "center",
    width: 60,
    sortable: true,
  },
  {
    accessor: "logoUrl",
    title: "Logo",
    textAlign: "center",
    render: (record: ExtendedPublisher) => {
      if (record.logoUrl) {
        return (
          <div className="flex justify-center">
            <Image
              src={record.logoUrl}
              alt={record.name}
              width={70}
              height={70}
              className="object-contain rounded"
              unoptimized
            />
          </div>
        );
      } else {
        return (
          <div className="flex justify-center">
            <IconPhoto className="w-15 h-15 text-gray-400" />
          </div>
        );
      }
    },
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
    render: (record: ExtendedPublisher) => (
      <div className="flex flex-row justify-center gap-2">
        <EditPublisherModal id={record.id} name={record.name} />
        <DeletePublisherModal id={record.id} name={record.name} />
      </div>
    ),
  },
] as DataTableColumn<Record<string, unknown>>[];

export function PublisherTableClient({
  publishers: records,
}: {
  publishers: ExtendedPublisher[];
}) {
  return (
    <CustomTable
      records={records}
      columns={columns}
      placeholder="Cari data penerbit"
      noRecordsText="Tidak ada data penerbit yang ditemukan"
    />
  );
}
