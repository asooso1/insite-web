"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { FileText, Plus, Eye } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";
import { Button } from "@/components/ui/button";

import { useMonthlyReportList } from "@/lib/hooks/use-reports";
import {
  ReportState,
  ReportStateLabel,
  ReportStateStyle,
  type MonthlyReportDTO,
  type SearchReportVO,
} from "@/lib/types/report";
import type { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// 연도 옵션 생성 (현재 연도 기준 ±3년)
// ============================================================================

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const options = [{ value: "", label: "전체 연도" }];
  for (let y = currentYear + 1; y >= currentYear - 3; y--) {
    options.push({ value: String(y), label: `${y}년` });
  }
  return options;
}

const MONTH_OPTIONS = [
  { value: "", label: "전체 월" },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: `${i + 1}월`,
  })),
];

// ============================================================================
// 필터 정의
// ============================================================================

const FILTER_DEFS: FilterDef[] = [
  {
    type: "tabs",
    key: "state",
    options: [
      { value: "", label: "전체" },
      { value: ReportState.DRAFT, label: ReportStateLabel.DRAFT },
      { value: ReportState.REPORT, label: ReportStateLabel.REPORT },
      { value: ReportState.APPROVE, label: ReportStateLabel.APPROVE },
      { value: ReportState.DISCARD, label: ReportStateLabel.DISCARD },
    ],
  },
  {
    type: "select",
    key: "workYear",
    options: getYearOptions(),
  },
  {
    type: "select",
    key: "workMonth",
    options: MONTH_OPTIONS,
  },
  {
    type: "search",
    key: "searchKeyword",
    placeholder: "건물명, 작성자 검색",
  },
];

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<MonthlyReportDTO>[] {
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
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => {
          const label = ReportStateLabel[row.original.state] ?? row.original.state;
          const style = ReportStateStyle[row.original.state] ?? "";
          return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
              {label}
            </span>
          );
        },
        size: 100,
      },
      {
        accessorKey: "buildingName",
        header: "빌딩",
        cell: ({ row }) => <span>{row.original.buildingName}</span>,
        size: 180,
      },
      {
        accessorKey: "baseAreaName",
        header: "거점",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.baseAreaName || "-"}
          </span>
        ),
        size: 140,
      },
      {
        id: "period",
        header: "보고 기간",
        cell: ({ row }) => (
          <span>
            {row.original.workYear}년 {row.original.workMonth}월
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "writerName",
        header: "작성자",
        cell: ({ row }) => (
          <span>{row.original.writerName || "-"}</span>
        ),
        size: 100,
      },
      {
        accessorKey: "writeDate",
        header: "작성일",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.writeDate?.split(" ")[0] ?? "-"}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "reportDate",
        header: "보고일",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.reportDate?.split(" ")[0] ?? "-"}
          </span>
        ),
        size: 120,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/reports/monthly/${row.original.id}`)}
            aria-label="상세 보기"
          >
            <Eye aria-hidden="true" className="mr-1.5 h-4 w-4" />
            보기
          </Button>
        ),
        size: 80,
      },
    ],
    [router]
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function MonthlyReportListPage() {
  const router = useRouter();

  const currentYear = String(new Date().getFullYear());
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  // URL 상태 (nuqs)
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
  const [state, setState] = useQueryState("state", parseAsString.withDefault(""));
  const [workYear, setWorkYear] = useQueryState(
    "workYear",
    parseAsString.withDefault(currentYear)
  );
  const [workMonth, setWorkMonth] = useQueryState(
    "workMonth",
    parseAsString.withDefault(currentMonth)
  );
  const [searchKeyword, setSearchKeyword] = useQueryState(
    "searchKeyword",
    parseAsString.withDefault("")
  );

  const size = 20;

  const FILTER_SETTERS: Record<string, (v: string) => void> = useMemo(
    () => ({
      state: (v) => void setState(v),
      workYear: (v) => void setWorkYear(v),
      workMonth: (v) => void setWorkMonth(v),
      searchKeyword: (v) => void setSearchKeyword(v),
    }),
    [setState, setWorkYear, setWorkMonth, setSearchKeyword]
  );

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      FILTER_SETTERS[key]?.(value);
      void setPage(0);
    },
    [FILTER_SETTERS, setPage]
  );

  const handleFilterReset = useCallback(() => {
    void setState("");
    void setWorkYear(currentYear);
    void setWorkMonth(currentMonth);
    void setSearchKeyword("");
    void setPage(0);
  }, [setState, setWorkYear, setWorkMonth, setSearchKeyword, setPage, currentYear, currentMonth]);

  const searchParams: SearchReportVO & { page: number; size: number } = useMemo(
    () => ({
      page,
      size,
      state: (state as SearchReportVO["state"]) || undefined,
      workYear: workYear || undefined,
      workMonth: workMonth || undefined,
      searchKeyword: searchKeyword || undefined,
    }),
    [page, size, state, workYear, workMonth, searchKeyword]
  );

  const filters = { state, workYear, workMonth, searchKeyword };

  const { data, isLoading, isError, refetch } = useMonthlyReportList(searchParams);

  const columns = useColumns();

  const handlePageChange = useCallback(
    (newPage: number) => {
      void setPage(newPage);
    },
    [setPage]
  );

  if (isError) {
    return (
      <EmptyState
        icon={FileText}
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
        title="월간보고서"
        description="월간 업무 보고서를 관리합니다."
        icon={FileText}
        actions={
          <Button onClick={() => router.push("/reports/monthly/new")}>
            <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
            신규 등록
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
