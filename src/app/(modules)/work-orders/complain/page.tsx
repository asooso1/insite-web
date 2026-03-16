"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, AlertCircle, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { FilterBar, type FilterDef, type FilterOption } from "@/components/common/filter-bar";

import { useComplainList } from "@/lib/hooks/use-complains";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  VocState,
  VocStateLabel,
  VocStateStyle,
  type VocDTO,
  type SearchVocVO,
} from "@/lib/types/complain";
import type { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// 필터 설정
// ============================================================================

const INITIAL_FILTERS = {
  state: "",
  writeDateFrom: "",
  writeDateTo: "",
  searchCode: "title",
  keyword: "",
};

const STATE_TABS_OPTIONS: FilterOption[] = [
  { value: "", label: "전체" },
  { value: VocState.ASK, label: "접수" },
  { value: VocState.PROCESS, label: "처리중" },
  { value: VocState.FINISH, label: "완료" },
  { value: VocState.REJECT, label: "반려" },
];

const SEARCH_CODE_OPTIONS: FilterOption[] = [
  { value: "title", label: "제목" },
  { value: "vocUserName", label: "민원인" },
  { value: "phone", label: "연락처" },
];

const FILTER_DEFS: FilterDef[] = [
  { type: "tabs", key: "state", options: STATE_TABS_OPTIONS },
  { type: "date-range", fromKey: "writeDateFrom", toKey: "writeDateTo" },
  { type: "select", key: "searchCode", options: SEARCH_CODE_OPTIONS },
  { type: "search", key: "keyword", placeholder: "검색어 입력..." },
];

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<VocDTO>[] {
  const router = useRouter();

  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span>,
        size: 80,
      },
      {
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => {
          const state = row.original.state;
          return (
            <StatusBadge
              status={VocStateStyle[state]}
              label={VocStateLabel[state]}
            />
          );
        },
        size: 100,
      },
      {
        accessorKey: "title",
        header: "제목",
        cell: ({ row }) => (
          <button
            onClick={() =>
              router.push(`/work-orders/complain/${row.original.id}`)
            }
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.title}
          </button>
        ),
        size: 250,
      },
      {
        accessorKey: "vocUserName",
        header: "민원인",
        cell: ({ row }) => <span>{row.original.vocUserName}</span>,
        size: 100,
      },
      {
        accessorKey: "vocUserPhone",
        header: "연락처",
        cell: ({ row }) => <span>{row.original.vocUserPhone}</span>,
        size: 120,
      },
      {
        accessorKey: "buildingDTO.name",
        header: "빌딩",
        cell: ({ row }) => <span>{row.original.buildingDTO.name}</span>,
        size: 120,
      },
      {
        accessorKey: "buildingFloorDTO.name",
        header: "층",
        cell: ({ row }) => <span>{row.original.buildingFloorDTO.name}</span>,
        size: 80,
      },
      {
        accessorKey: "buildingFloorZoneDTO.name",
        header: "구역",
        cell: ({ row }) => <span>{row.original.buildingFloorZoneDTO.name}</span>,
        size: 100,
      },
      {
        accessorKey: "vocDate",
        header: "민원일시",
        cell: ({ row }) => {
          const date = row.original.vocDate;
          if (!date || date === "-") return <span>-</span>;
          return <span className="text-sm">{date.split(" ")[0]}</span>;
        },
        size: 120,
      },
    ],
    [router]
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function ComplainListPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // 빌딩 ID 가져오기
  const buildingId = user ? Number(user.currentBuildingId) : 0;

  // 검색 파라미터
  const searchParams: SearchVocVO & { page: number; size: number } = useMemo(
    () => ({
      buildingId,
      page,
      size,
      state: (filters.state as VocState) || undefined,
      searchCode: filters.searchCode as "title" | "vocUserName" | "phone",
      searchKeyword: filters.keyword || undefined,
      writeDateFrom: filters.writeDateFrom || undefined,
      writeDateTo: filters.writeDateTo || undefined,
    }),
    [buildingId, page, size, filters]
  );

  // 데이터 조회
  const { data, isLoading, isError, refetch } = useComplainList(searchParams);

  // 컬럼
  const columns = useColumns();

  // 필터 핸들러
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 에러 처리
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
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <PageHeader
        title="민원 목록"
        description="민원(VOC)을 관리합니다."
        actions={
          <Button onClick={() => router.push("/work-orders/complain/new")}>
            <Plus className="mr-2 h-4 w-4" />
            민원 등록
          </Button>
        }
      />

      {/* 필터 */}
      <FilterBar
        filters={FILTER_DEFS}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        loading={isLoading}
        pagination={false}
      />

      {/* 데이터 없음 */}
      {!isLoading && (!data?.content || data.content.length === 0) && (
        <EmptyState
          icon={Inbox}
          title="민원이 없습니다"
          description="새 민원을 등록해보세요."
          action={{
            label: "민원 등록",
            onClick: () => router.push("/work-orders/complain/new"),
          }}
        />
      )}

      {/* 서버 사이드 페이지네이션 */}
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
