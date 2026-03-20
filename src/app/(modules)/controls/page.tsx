"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Eye,
  Edit,
  AlertCircle,
  Inbox,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { FilterBar, type FilterDef, type FilterOption } from "@/components/common/filter-bar";

import { useControlList } from "@/lib/hooks/use-controls";
import {
  ControlState,
  ControlStateStyle,
  type ControlListDTO,
  type SearchControlVO,
} from "@/lib/types/control";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 필터 설정
// ============================================================================

const INITIAL_FILTERS = {
  state: "",
  keyword: "",
};

const STATE_TABS_OPTIONS: FilterOption[] = [
  { value: "", label: "전체" },
  { value: ControlState.WRITE, label: "작성" },
  { value: ControlState.REQUEST, label: "요청" },
  { value: ControlState.COMPLETE, label: "완료" },
  { value: ControlState.CANCEL, label: "취소" },
];

const FILTER_DEFS: FilterDef[] = [
  { type: "tabs", key: "state", options: STATE_TABS_OPTIONS },
  { type: "search", key: "keyword", placeholder: "제어명 검색..." },
];

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<ControlListDTO>[] {
  const router = useRouter();

  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.id}</span>
        ),
        size: 80,
      },
      {
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => (
          <StatusBadge status={ControlStateStyle[row.original.state as ControlState]} />
        ),
        size: 100,
      },
      {
        accessorKey: "facilityName",
        header: "시설명",
        cell: ({ row }) => <span>{row.original.facilityName}</span>,
        size: 150,
      },
      {
        accessorKey: "name",
        header: "제어명",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/controls/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 200,
      },
      {
        accessorKey: "targetValue",
        header: "목표값",
        cell: ({ row }) => <span>{row.original.targetValue}</span>,
        size: 100,
      },
      {
        accessorKey: "currentValue",
        header: "현재값",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.currentValue || "-"}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: "buildingName",
        header: "빌딩",
        cell: ({ row }) => <span>{row.original.buildingName}</span>,
        size: 100,
      },
      {
        accessorKey: "createdAt",
        header: "등록일",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.createdAt}</span>
        ),
        size: 100,
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

function RowActions({ row }: { row: Row<ControlListDTO> }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/controls/${row.original.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/controls/${row.original.id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function ControlListPage() {
  const router = useRouter();

  // 로컬 상태
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // 검색 파라미터
  const searchParams: SearchControlVO & { page: number; size: number } = useMemo(
    () => ({
      page,
      size,
      state: (filters.state as ControlState) || undefined,
      keyword: filters.keyword || undefined,
    }),
    [page, size, filters]
  );

  // 데이터 조회
  const { data, isLoading, isError, refetch } = useControlList(searchParams);

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
        title="제어 목록"
        description="시설 제어를 관리합니다."
        icon={Settings}
        actions={
          <Button onClick={() => router.push("/controls/new")}>
            <Plus className="mr-2 h-4 w-4" />
            등록
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
