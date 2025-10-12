"use client";

import { sortBy } from "lodash";
import {
  DataTable,
  type DataTableColumn,
  type DataTableSortStatus,
} from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZES = [10, 15, 20];

export function CustomTable({
  records,
  columns,
  noRecordsText = "No records found",
}: {
  records: object[];
  columns: DataTableColumn<Record<string, unknown>>[];
  noRecordsText?: string;
}) {
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
  );
}
