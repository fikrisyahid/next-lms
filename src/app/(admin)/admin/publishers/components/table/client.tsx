"use client";

import type { ExtendedPublisher } from "@/app/types";
import { CustomTable } from "@/components/custom-table";
import type { DataTableColumn } from "mantine-datatable";
import DeletePublisherModal from "../delete-publisher-modal";
import Image from "next/image";
import { IconPhoto } from "@tabler/icons-react";

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
    render: (record: ExtendedPublisher) => {
      if (record.logoUrl) {
        return (
          <Image
            src={record.logoUrl}
            alt={record.name}
            width={70}
            height={70}
            className="object-contain rounded"
            unoptimized
          />
        );
      } else {
        return <IconPhoto className="w-10 h-10 text-gray-400" />;
      }
    },
  },
  { accessor: "name", title: "Nama", sortable: true },
  { accessor: "ebooks_count", title: "Jumlah E-Books", sortable: true },
  {
    accessor: "actions",
    title: "Aksi",
    textAlign: "right",
    width: 100,
    render: (record: ExtendedPublisher) => (
      <div className="flex flex-row justify-end gap-2">
        {/* Edit publisher modal */}
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
    />
  );
}
