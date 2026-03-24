"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Eye, Edit, AlertCircle, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";

import { useServiceChargeList } from "@/lib/hooks/use-invoices";
import {
  ServiceCostType,
  ServiceCostTypeLabel,
  type ServiceChargeDTO,
  type SearchServiceChargeVO,
} from "@/lib/types/invoice";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 상수
// ============================================================================

const STATE_OPTIONS = [
  { value: "", label: "전체" },
  { value: "CHARGE", label: ServiceCostTypeLabel.CHARGE },
  { value: "PAYED", label: ServiceCostTypeLabel.PAYED },
  { value: "CANCEL", label: ServiceCostTypeLabel.CANCEL },
];

const FILTER_DEFS: FilterDef[] = [
  { type: "tabs", key: "state", options: STATE_OPTIONS },
  { type: "date-range", fromKey: "chargeDateFrom", toKey: "chargeDateTo" },
  { type: "search", key: "keyword", placeholder: "검색어를 입력하세요" },
];

const INITIAL_FILTERS = { state: "", chargeDateFrom: "", chargeDateTo: "", keyword: "" };

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<ServiceChargeDTO>[] {
  const router = useRouter();

  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.id}</span>
        ),
        size: 70,
      },
      {
        accessorKey: "title",
        header: "제목",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/invoices/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.title}
          </button>
        ),
        size: 200,
      },
      {
        accessorKey: "amount",
        header: "금액",
        cell: ({ row }) => (
          <span className="text-right font-medium">
            {(row.original.amount ?? 0).toLocaleString()}원
          </span>
        ),
        meta: { className: "text-right" },
        size: 150,
      },
      {
        accessorKey: "month",
        header: "청구월",
        cell: ({ row }) => <span>{row.original.month}</span>,
        size: 120,
      },
      {
        accessorKey: "buildingName",
        header: "빌딩",
        cell: ({ row }) => <span>{row.original.buildingName}</span>,
        size: 150,
      },
      {
        accessorKey: "createdAt",
        header: "등록일",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.createdAt}</span>,
        size: 120,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <RowActions row={row} />,
        size: 50,
      },
    ],
    [router]
  );
}

// ============================================================================
// 행 액션
// ============================================================================

function RowActions({ row }: { row: Row<ServiceChargeDTO> }) {
  const router = useRouter();
  const invoice = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="더 보기">
          <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/invoices/${invoice.id}`)}>
          <Eye aria-hidden="true" className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/invoices/${invoice.id}/edit`)}>
          <Edit aria-hidden="true" className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function InvoiceListPage() {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const searchParams: SearchServiceChargeVO = useMemo(
    () => ({
      keyword: filters.keyword || undefined,
      chargeDateFrom: filters.chargeDateFrom || undefined,
      chargeDateTo: filters.chargeDateTo || undefined,
      state: (filters.state as ServiceCostType) || undefined,
      page,
      size,
    }),
    [filters, page, size]
  );

  const { data, isLoading, isError, refetch } = useServiceChargeList(searchParams);

  const columns = useColumns();

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleFilterReset = () => {
    setFilters(INITIAL_FILTERS);
    setPage(0);
  };

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  }

  return (
    <div className="space-y-4 p-6">
      <PageHeader
        title="청구서 목록"
        description="서비스 요금 청구서를 관리합니다."
        icon={FileText}
        actions={
          <Button onClick={() => router.push("/invoices/new")} size="sm">
            <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
            등록
          </Button>
        }
      />

      <FilterBar
        filters={FILTER_DEFS}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        loading={isLoading}
        pagination
        pageSize={size}
      />

      {data && data.totalPages > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            총 {data.totalElements}건 중 {page * size + 1}-
            {Math.min((page + 1) * size, data.totalElements)}건
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(0)}
              disabled={page === 0}
            >
              처음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
              이전
            </Button>
            <span className="px-2 text-sm">
              {page + 1} / {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= data.totalPages - 1}
            >
              다음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.totalPages - 1)}
              disabled={page >= data.totalPages - 1}
            >
              마지막
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
