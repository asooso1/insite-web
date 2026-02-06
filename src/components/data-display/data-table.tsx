"use client";

import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { NoData, NoSearchResults, ErrorState } from "./empty-state";

/**
 * 테이블 컬럼 정의
 */
export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: boolean;
  keyExtractor?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  emptyState?: "noData" | "noSearchResults";
  onRetry?: () => void;
  onClearSearch?: () => void;
  onCreate?: () => void;
  className?: string;
}

/**
 * 데이터 테이블 컴포넌트
 * - 로딩, 에러, 빈 상태 처리
 * - 컬럼 정의로 유연한 렌더링
 *
 * @example
 * <DataTable
 *   columns={[
 *     { key: "title", header: "제목" },
 *     { key: "status", header: "상태", render: (v) => <StatusBadge status={v} /> },
 *   ]}
 *   data={workOrders}
 *   loading={isLoading}
 *   onRowClick={(row) => router.push(`/work-orders/${row.id}`)}
 * />
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  error = false,
  keyExtractor,
  onRowClick,
  emptyState = "noData",
  onRetry,
  onClearSearch,
  onCreate,
  className,
}: DataTableProps<T>): ReactNode {
  // 에러 상태
  if (error) {
    return <ErrorState onRetry={onRetry} />;
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className={cn("w-full", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  style={{ width: col.width }}
                  className={cn(
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right"
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // 빈 상태
  if (data.length === 0) {
    if (emptyState === "noSearchResults") {
      return <NoSearchResults onClear={onClearSearch} />;
    }
    return <NoData onCreate={onCreate} />;
  }

  // 데이터 렌더링
  return (
    <div className={cn("w-full overflow-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                style={{ width: col.width }}
                className={cn(
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right"
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const key = keyExtractor
              ? keyExtractor(row, index)
              : String(row.id ?? index);

            return (
              <TableRow
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
              >
                {columns.map((col) => {
                  const value = row[col.key as keyof T];
                  const rendered = col.render
                    ? col.render(value, row, index)
                    : String(value ?? "-");

                  return (
                    <TableCell
                      key={String(col.key)}
                      className={cn(
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right"
                      )}
                    >
                      {rendered}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
