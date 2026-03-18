"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";

import {
  usePersonalWorkOrderList,
} from "@/lib/hooks/use-personal-work-orders";
import {
  PersonalWorkOrderState,
  PersonalWorkOrderStateLabel,
  PersonalWorkOrderStateStyle,
  type PersonalWorkOrderListDTO,
  type SearchPersonalWorkOrderVO,
} from "@/lib/types/personal-work-order";
import type { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// 필터 정의
// ============================================================================

const INITIAL_FILTERS = {
  state: "",
  type: "write_date" as const,
  from: "",
  to: "",
  searchCode: "title" as const,
  keyword: "",
};

const STATE_OPTIONS = [
  { value: "", label: "전체" },
  { value: PersonalWorkOrderState.WRITE, label: "작성" },
  { value: PersonalWorkOrderState.ISSUE, label: "발행" },
  { value: PersonalWorkOrderState.PROCESSING, label: "처리중" },
  { value: PersonalWorkOrderState.REQ_COMPLETE, label: "완료요청" },
  { value: PersonalWorkOrderState.COMPLETE, label: "완료" },
  { value: PersonalWorkOrderState.CANCEL, label: "취소" },
];

const FILTER_DEFS: FilterDef[] = [
  {
    type: "tabs",
    key: "state",
    options: STATE_OPTIONS,
  },
  {
    type: "select",
    key: "type",
    options: [
      { value: "write_date", label: "작성일자" },
      { value: "confirm_date", label: "승인일자" },
    ],
  },
  {
    type: "date-range",
    fromKey: "from",
    toKey: "to",
  },
  {
    type: "select",
    key: "searchCode",
    options: [
      { value: "title", label: "업무명" },
      { value: "keyword", label: "키워드" },
    ],
  },
  {
    type: "search",
    key: "keyword",
    placeholder: "검색어를 입력하세요",
  },
];

// ============================================================================
// 컬럼 정의
// ============================================================================

const columns: ColumnDef<PersonalWorkOrderListDTO>[] = [
  {
    accessorKey: "personalWorkOrderId",
    header: "No",
    size: 60,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "title",
    header: "업무명",
    size: 200,
  },
  {
    accessorKey: "buildingName",
    header: "빌딩",
    size: 150,
  },
  {
    accessorKey: "teamName",
    header: "팀",
    size: 120,
  },
  {
    accessorKey: "state",
    header: "상태",
    size: 100,
    cell: ({ row }) => (
      <StatusBadge status={PersonalWorkOrderStateStyle[row.original.state]} />
    ),
  },
  {
    accessorKey: "writerInfo.name",
    header: "작성자",
    size: 120,
  },
  {
    accessorKey: "writerInfo.writeDate",
    header: "작성일",
    size: 120,
    cell: ({ row }) =>
      new Date(row.original.writerInfo.writeDate).toLocaleDateString("ko-KR"),
  },
];

// ============================================================================
// 페이지 컴포넌트
// ============================================================================

export default function PersonalWorkOrdersPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data, isLoading, isError, refetch } = usePersonalWorkOrderList({
    ...filters,
    state: (filters.state as PersonalWorkOrderState) || undefined,
    page,
    size: pageSize,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0); // 필터 변경 시 첫 페이지로
  };

  const handleFilterReset = () => {
    setFilters(INITIAL_FILTERS);
    setPage(0);
  };

  if (isError) {
    return <EmptyState icon={AlertCircle} title="데이터를 불러올 수 없습니다" description="잠시 후 다시 시도해주세요." action={{ label: "다시 시도", onClick: () => void refetch() }} />;
  }

  const isEmpty = !isLoading && (!data?.content || data.content.length === 0);

  return (
    <div className="space-y-4">
      <PageHeader
        title="개인 작업"
        description="담당자별 개인 작업지시를 관리합니다"
        actions={
          <Button asChild size="sm">
            <Link href="/personal-work-orders/new">
              <Plus className="mr-1 h-4 w-4" />
              새 작업
            </Link>
          </Button>
        }
      />
      <FilterBar
        filters={FILTER_DEFS}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />
      {isEmpty ? (
        <EmptyState title="데이터가 없습니다" description="등록된 데이터가 없습니다." />
      ) : (
        <DataTable
          columns={columns}
          data={data?.content ?? []}
          loading={isLoading}
          pagination
          pageSize={pageSize}
        />
      )}
    </div>
  );
}
