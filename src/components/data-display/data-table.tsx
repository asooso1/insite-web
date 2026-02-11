"use client";

import {
  type ReactNode,
  useRef,
  useMemo,
  useEffect,
  useState,
} from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
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
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export type { ColumnDef } from "@tanstack/react-table";

export type DataTableVariant = "default" | "striped" | "category";

export interface DataTableProps<TData> {
  /** TanStack Table ColumnDef 배열 */
  columns: ColumnDef<TData, unknown>[];
  /** 테이블 데이터 */
  data: TData[];
  /** 테이블 variant */
  variant?: DataTableVariant;
  /** 로딩 상태 */
  loading?: boolean;
  /** 에러 상태 */
  error?: boolean;
  /** 페이지네이션 활성화 */
  pagination?: boolean;
  /** 페이지 크기 (기본: 10) */
  pageSize?: number;
  /** 가상 스크롤 활성화 (1000+ 행에서 권장) */
  virtualScroll?: boolean;
  /** 가상 스크롤 시 행 높이 (px) */
  estimateRowHeight?: number;
  /** 가상 스크롤 시 테이블 최대 높이 */
  maxHeight?: number | string;
  /** 툴바 컴포넌트 */
  toolbar?: ReactNode;
  /** 행 클릭 핸들러 */
  onRowClick?: (row: TData) => void;
  /** 빈 상태 타입 */
  emptyState?: "noData" | "noSearchResults";
  /** 재시도 핸들러 (에러 상태) */
  onRetry?: () => void;
  /** 검색 초기화 핸들러 (검색 결과 없음 상태) */
  onClearSearch?: () => void;
  /** 생성 핸들러 (빈 상태) */
  onCreate?: () => void;
  /** 행 선택 활성화 */
  enableRowSelection?: boolean;
  /** 선택된 행 변경 핸들러 */
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  /** 초기 정렬 상태 */
  initialSorting?: SortingState;
  /** 클래스명 */
  className?: string;
  /** 테이블 컨테이너 클래스명 */
  containerClassName?: string;
}

// ============================================================================
// Variant Styles
// ============================================================================

const variantStyles: Record<DataTableVariant, {
  row: string;
  rowEven: string;
  rowOdd: string;
  categoryHeader: string;
}> = {
  default: {
    row: "",
    rowEven: "",
    rowOdd: "",
    categoryHeader: "",
  },
  striped: {
    row: "",
    rowEven: "bg-muted/30",
    rowOdd: "",
    categoryHeader: "",
  },
  category: {
    row: "",
    rowEven: "",
    rowOdd: "",
    categoryHeader: "bg-muted/50 font-semibold",
  },
};

// ============================================================================
// Sort Icon Component
// ============================================================================

function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }): ReactNode {
  if (isSorted === "asc") {
    return <ChevronUp className="ml-1 h-4 w-4 inline-block" />;
  }
  if (isSorted === "desc") {
    return <ChevronDown className="ml-1 h-4 w-4 inline-block" />;
  }
  return <ChevronsUpDown className="ml-1 h-4 w-4 inline-block text-muted-foreground/50" />;
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function DataTableSkeleton<TData>({
  columns,
  rows = 5,
  className,
}: {
  columns: ColumnDef<TData, unknown>[];
  rows?: number;
  className?: string;
}): ReactNode {
  return (
    <div className={cn("w-full", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((_, colIndex) => (
                <TableCell key={colIndex}>
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

// ============================================================================
// Virtual Table Body
// ============================================================================

function VirtualTableBody<TData>({
  table,
  variant,
  onRowClick,
  estimateRowHeight,
  maxHeight,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
  variant: DataTableVariant;
  onRowClick?: (row: TData) => void;
  estimateRowHeight: number;
  maxHeight: number | string;
}): ReactNode {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const firstVirtualRow = virtualRows[0];
  const lastVirtualRow = virtualRows[virtualRows.length - 1];

  const paddingTop = firstVirtualRow ? firstVirtualRow.start : 0;
  const paddingBottom = lastVirtualRow ? totalSize - lastVirtualRow.end : 0;

  const styles = variantStyles[variant];

  return (
    <div
      ref={tableContainerRef}
      className="overflow-auto"
      style={{ maxHeight }}
    >
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className={cn(
                    header.column.getCanSort() && "cursor-pointer select-none"
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <SortIcon isSorted={header.column.getIsSorted()} />
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            if (!row) return null;

            const isEven = virtualRow.index % 2 === 0;

            return (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={cn(
                  onRowClick && "cursor-pointer",
                  styles.row,
                  isEven ? styles.rowEven : styles.rowOdd
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ============================================================================
// Regular Table Body
// ============================================================================

function RegularTableBody<TData>({
  table,
  variant,
  onRowClick,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
  variant: DataTableVariant;
  onRowClick?: (row: TData) => void;
}): ReactNode {
  const styles = variantStyles[variant];

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                style={{ width: header.getSize() }}
                className={cn(
                  header.column.getCanSort() && "cursor-pointer select-none"
                )}
                onClick={header.column.getToggleSortingHandler()}
              >
                {header.isPlaceholder ? null : (
                  <div className="flex items-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && (
                      <SortIcon isSorted={header.column.getIsSorted()} />
                    )}
                  </div>
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row, index) => {
          const isEven = index % 2 === 0;

          return (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              className={cn(
                onRowClick && "cursor-pointer",
                styles.row,
                isEven ? styles.rowEven : styles.rowOdd
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// ============================================================================
// Main DataTable Component
// ============================================================================

/**
 * TanStack Table v8 기반 데이터 테이블 컴포넌트
 *
 * @features
 * - 정렬, 필터링, 페이지네이션
 * - 가상 스크롤 (1000+ 행 지원)
 * - variant: default, striped, category
 * - 행 선택
 * - 로딩, 에러, 빈 상태 처리
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<WorkOrder>[] = [
 *   { accessorKey: "title", header: "제목" },
 *   { accessorKey: "status", header: "상태", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
 * ];
 *
 * <DataTable
 *   columns={columns}
 *   data={workOrders}
 *   variant="striped"
 *   pagination
 *   onRowClick={(row) => router.push(`/work-orders/${row.id}`)}
 * />
 * ```
 */
export function DataTable<TData>({
  columns,
  data,
  variant = "default",
  loading = false,
  error = false,
  pagination = false,
  pageSize = 10,
  virtualScroll = false,
  estimateRowHeight = 48,
  maxHeight = 600,
  toolbar,
  onRowClick,
  emptyState = "noData",
  onRetry,
  onClearSearch,
  onCreate,
  enableRowSelection = false,
  onRowSelectionChange,
  initialSorting = [],
  className,
  containerClassName,
}: DataTableProps<TData>): ReactNode {
  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // -------------------------------------------------------------------------
  // Table Instance
  // -------------------------------------------------------------------------
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(pagination && !virtualScroll
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // -------------------------------------------------------------------------
  // Row Selection Callback
  // -------------------------------------------------------------------------
  const selectedRows = useMemo(() => {
    if (!enableRowSelection) return [];
    return table.getSelectedRowModel().rows.map((row) => row.original);
  }, [table, enableRowSelection, rowSelection]);

  // 선택 변경 시 콜백 호출
  useEffect(() => {
    if (onRowSelectionChange && enableRowSelection) {
      onRowSelectionChange(selectedRows);
    }
  }, [selectedRows, onRowSelectionChange, enableRowSelection]);

  // -------------------------------------------------------------------------
  // Render States
  // -------------------------------------------------------------------------

  // 에러 상태
  if (error) {
    return <ErrorState onRetry={onRetry} />;
  }

  // 로딩 상태
  if (loading) {
    return <DataTableSkeleton columns={columns} rows={5} className={className} />;
  }

  // 빈 상태
  if (data.length === 0) {
    if (emptyState === "noSearchResults") {
      return <NoSearchResults onClear={onClearSearch} />;
    }
    return <NoData onCreate={onCreate} />;
  }

  // -------------------------------------------------------------------------
  // Render Table
  // -------------------------------------------------------------------------
  return (
    <div className={cn("w-full space-y-4", containerClassName)}>
      {/* 툴바 */}
      {toolbar}

      {/* 테이블 */}
      <div className={cn("rounded-md border", className)}>
        {virtualScroll ? (
          <VirtualTableBody
            table={table}
            variant={variant}
            onRowClick={onRowClick}
            estimateRowHeight={estimateRowHeight}
            maxHeight={maxHeight}
          />
        ) : (
          <RegularTableBody
            table={table}
            variant={variant}
            onRowClick={onRowClick}
          />
        )}
      </div>

      {/* 페이지네이션 (가상 스크롤이 아닌 경우만) */}
      {pagination && !virtualScroll && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}

// ============================================================================
// Pagination Component
// ============================================================================

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
}

function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>): ReactNode {
  return (
    <div className="flex items-center justify-between px-2">
      {/* 선택된 행 수 */}
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <>
            {table.getFilteredSelectedRowModel().rows.length}개 /
            {" "}{table.getFilteredRowModel().rows.length}개 행 선택됨
          </>
        )}
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* 페이지 크기 선택 */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">표시 행</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 페이지 정보 */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()} 페이지
        </div>

        {/* 페이지 네비게이션 */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">첫 페이지로</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">이전 페이지</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">다음 페이지</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">마지막 페이지로</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Named export for pagination component
export { DataTablePagination };
