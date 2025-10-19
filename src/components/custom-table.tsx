"use client";

import { TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { sortBy } from "lodash";
import {
  DataTable,
  type DataTableColumn,
  type DataTableSortStatus,
} from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZES = [10, 15, 20];

type CustomTableProps = {
  records: object[];
  columns: DataTableColumn<Record<string, unknown>>[];
  noRecordsText?: string;
  placeholder?: string;
};

export function CustomTable({
  records,
  columns,
  noRecordsText = "No records found",
  placeholder = "Search data records",
}: CustomTableProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 200);

  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "no",
    direction: "asc",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <needed>
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const filteredRecords = useMemo(() => {
    if (!debouncedSearch) return records;
    const lowercasedSearch = debouncedSearch.toLowerCase();
    return records.filter((record) =>
      Object.values(record).some((value) =>
        String(value).toLowerCase().includes(lowercasedSearch),
      ),
    );
  }, [records, debouncedSearch]);

  const sortedRecords = useMemo(() => {
    const data = sortBy(filteredRecords, sortStatus.columnAccessor);
    return sortStatus.direction === "desc" ? data.reverse() : data;
  }, [filteredRecords, sortStatus]);

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

  if (records.length === 0) {
    return (
      <DataTable
        withTableBorder
        borderRadius="md"
        shadow="md"
        className="w-full"
        records={paginatedRecords}
        columns={columns}
        minHeight={200}
        noRecordsText={noRecordsText}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <TextInput
        className="w-full"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
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
        columns={columns}
        minHeight={200}
      />
    </div>
  );
}
