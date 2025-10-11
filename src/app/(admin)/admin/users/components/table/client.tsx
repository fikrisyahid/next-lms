"use client";

import { sortBy } from "lodash";
import { ActionIcon, Badge } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ExtendedUser } from "@/app/types";
import DeleteUserModal from "../delete-user-modal";

const PAGE_SIZES = [10, 15, 20];

export function UserTableClient({ users: records }: { users: ExtendedUser[] }) {
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<ExtendedUser>
  >({
    columnAccessor: "no",
    direction: "asc",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <needed>
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const sortedRecords = useMemo(() => {
    const data = sortBy(records, sortStatus.columnAccessor);
    return sortStatus.direction === "desc" ? data.reverse() : data;
  }, [records, sortStatus]);

  const numberedRecords = useMemo(() => {
    return sortedRecords.map((record, index) => ({
      ...record,
      no: index + 1,
    }));
  }, [sortedRecords]);

  const paginatedRecords = useMemo(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    return numberedRecords.slice(from, to);
  }, [page, pageSize, numberedRecords]);

  return (
    <DataTable
      withTableBorder
      borderRadius="md"
      shadow="md"
      className="w-full"
      records={paginatedRecords}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      totalRecords={records.length}
      page={page}
      onPageChange={setPage}
      recordsPerPage={pageSize}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      columns={[
        {
          accessor: "no",
          title: "No",
          textAlign: "center",
          width: 60,
          sortable: true,
        },
        { accessor: "fullname", title: "Full Name", sortable: true },
        { accessor: "username", title: "Username", sortable: true },
        { accessor: "ebooks_count", title: "E-Books Count", sortable: true },
        {
          accessor: "role",
          title: "Role",
          sortable: true,
          render: (record: ExtendedUser) => {
            const badgeColorBasedOnRole: {
              [key in ExtendedUser["role"]]: string;
            } = {
              ADMIN: "red",
              STUDENT: "blue",
              TEACHER: "green",
            };
            return (
              <Badge color={badgeColorBasedOnRole[record.role]}>
                {record.role}
              </Badge>
            );
          },
        },
        {
          accessor: "actions",
          title: "Action",
          textAlign: "right",
          width: 100,
          render: (record: ExtendedUser) => (
            <div className="flex flex-row justify-end gap-2">
              <ActionIcon
                variant="filled"
                component={Link}
                href={`/detail/${record.id}`}
                color="yellow"
              >
                <IconPencil
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
              <DeleteUserModal
                id={record.id}
                username={record.username}
                fullname={record.fullname}
                role={record.role}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
