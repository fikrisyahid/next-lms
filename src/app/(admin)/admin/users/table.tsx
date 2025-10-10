"use client";

import { sortBy } from "lodash";
import { ActionIcon } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import Link from "next/link";
import { useMemo, useState } from "react";

interface IRecords {
  id: number;
  no: number;
  fullname: string;
  username: string;
  ebooks_count: number;
  role: string;
}

const records = [
  {
    id: 1,
    no: 1,
    fullname: "Joe Biden",
    username: "joebiden",
    ebooks_count: 5,
    role: "Admin",
  },
  {
    id: 2,
    no: 2,
    fullname: "Donald Trump",
    username: "donaldtrump",
    ebooks_count: 3,
    role: "User",
  },
  {
    id: 3,
    no: 3,
    fullname: "Barack Obama",
    username: "barackobama",
    ebooks_count: 8,
    role: "User",
  },
  {
    id: 4,
    no: 4,
    fullname: "George Bush",
    username: "georgebush",
    ebooks_count: 2,
    role: "User",
  },
];

export function UserTable() {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IRecords>>({
    columnAccessor: "no",
    direction: "asc",
  });

  const sortedRecords = useMemo(() => {
    const data = sortBy(records, sortStatus.columnAccessor);
    return sortStatus.direction === "desc" ? data.reverse() : data;
  }, [sortStatus]);

  return (
    <DataTable
      withTableBorder
      borderRadius="md"
      shadow="md"
      className="w-full"
      records={sortedRecords}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
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
        { accessor: "role", title: "Role", sortable: true },
        {
          accessor: "actions",
          title: "Action",
          textAlign: "right",
          width: 100,
          render: (record: IRecords) => (
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
            </div>
          ),
        },
      ]}
    />
  );
}
