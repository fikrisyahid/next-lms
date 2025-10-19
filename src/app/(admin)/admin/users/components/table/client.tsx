"use client";

import { Badge } from "@mantine/core";
import type { ExtendedUser } from "@/app/types";
import DeleteUserModal from "../delete-user-modal";
import { CustomTable } from "@/components/custom-table";
import type { DataTableColumn } from "mantine-datatable";
import EditUserModal from "../edit-user-modal";
import translateRole from "@/lib/utils/translate-role";

const badgeColorBasedOnRole: {
  [key in ExtendedUser["role"]]: string;
} = {
  ADMIN: "red",
  STUDENT: "blue",
  TEACHER: "green",
};

const columns = [
  {
    accessor: "no",
    title: "No",
    textAlign: "center",
    width: 60,
    sortable: true,
  },
  { accessor: "fullname", title: "Nama Lengkap", sortable: true },
  { accessor: "username", title: "Username", sortable: true },
  { accessor: "ebooks_count", title: "Jumlah E-Books", sortable: true },
  {
    accessor: "role",
    title: "Hak Akses",
    sortable: true,
    width: 120,
    render: (record: ExtendedUser) => (
      <Badge color={badgeColorBasedOnRole[record.role]}>
        {translateRole({ role: record.role })}
      </Badge>
    ),
  },
  {
    accessor: "actions",
    title: "Aksi",
    textAlign: "right",
    width: 100,
    render: (record: ExtendedUser) => (
      <div className="flex flex-row justify-end gap-2">
        <EditUserModal
          userId={record.id}
          fullname={record.fullname}
          username={record.username}
          role={record.role}
        />
        <DeleteUserModal
          id={record.id}
          username={record.username}
          fullname={record.fullname}
          role={record.role}
        />
      </div>
    ),
  },
] as DataTableColumn<Record<string, unknown>>[];

export function UserTableClient({ users: records }: { users: ExtendedUser[] }) {
  return (
    <CustomTable
      records={records}
      columns={columns}
      placeholder="Cari data pengguna"
    />
  );
}
