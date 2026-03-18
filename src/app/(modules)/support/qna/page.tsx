"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { PageHeader } from "@/components/common/page-header";
import type { ColumnDef } from "@tanstack/react-table";

import { useQuestionList } from "@/lib/hooks/use-qna";
import { QnaStateLabel, QnaStateStyle, type QnaDTO, type SearchQnaVO, type QnaState } from "@/lib/types/qna";

// ============================================================================
// 필터 설정
// ============================================================================

const STATE_OPTIONS = [
  { value: "", label: "전체" },
  { value: "WAIT", label: "답변 대기" },
  { value: "COMPLETE", label: "답변 완료" },
];

const INITIAL_FILTERS = {
  state: "",
  keyword: "",
};

const FILTER_DEFS: FilterDef[] = [
  { type: "tabs", key: "state", options: STATE_OPTIONS },
  { type: "search", key: "keyword", placeholder: "제목으로 검색..." },
];

// ============================================================================
// 컬럼 정의
// ============================================================================

function useQnaColumns(): ColumnDef<QnaDTO>[] {
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
            onClick={() => router.push(`/support/qna/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline truncate"
          >
            {row.original.title}
          </button>
        ),
        size: 350,
      },
      {
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => (
          <StatusBadge
            status={QnaStateStyle[row.original.state as QnaState]}
            label={QnaStateLabel[row.original.state as QnaState]}
          />
        ),
        size: 100,
      },
      {
        accessorKey: "authorName",
        header: "작성자",
        cell: ({ row }) => <span>{row.original.authorName}</span>,
        size: 100,
      },
      {
        accessorKey: "createdAt",
        header: "등록일",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.createdAt}</span>
        ),
        size: 120,
      },
    ],
    [router]
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default function QnaListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  // 데이터 조회
  const params: SearchQnaVO = useMemo(
    () => ({
      page,
      size,
      state: (filters.state || undefined) as QnaState | undefined,
      keyword: filters.keyword || undefined,
    }),
    [page, size, filters]
  );

  const { data, isLoading, isError, refetch } = useQuestionList(params);
  const columns = useQnaColumns();

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

  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className="space-y-4 p-6">
      <PageHeader
        title="Q&A"
        description="질문하고 답변을 받아보세요."
        actions={
          <Button asChild size="sm">
            <a href="/support/qna/new">
              <Plus className="mr-1 h-4 w-4" />
              새 질문 등록
            </a>
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
        pagination={false}
      />

      {!isLoading && (data?.content ?? []).length === 0 && (
        <EmptyState
          title="질문이 없습니다"
          description="등록된 질문이 없습니다."
          action={{
            label: "질문 등록",
            onClick: () => router.push("/support/qna/new"),
          }}
        />
      )}

      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            총 {totalElements}건 중 {page * size + 1}-
            {Math.min((page + 1) * size, totalElements)}건
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
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
            >
              다음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={page >= totalPages - 1}
            >
              마지막
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
