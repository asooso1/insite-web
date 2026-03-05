"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Eye, Edit, Trash2, AlertCircle, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";

import {
  useMonthlyReportList,
  useWeeklyReportList,
  useWorkLogList,
  useDeleteMonthlyReport,
  useDeleteWeeklyReport,
  useDeleteWorkLog,
} from "@/lib/hooks/use-reports";
import {
  ReportStateLabel,
  ReportStateStyle,
  type MonthlyReportDTO,
  type WeeklyReportDTO,
  type DailyReportDTO,
  type SearchReportVO,
} from "@/lib/types/report";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 탭 정의
// ============================================================================

const TABS = [
  { value: "monthly", label: "월간보고서" },
  { value: "weekly", label: "주간보고서" },
  { value: "workLog", label: "업무일지" },
  { value: "tbm", label: "TBM" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

// ============================================================================
// 상태 배지 헬퍼
// ============================================================================

function StateBadge({ state }: { state: string }) {
  const key = state as keyof typeof ReportStateLabel;
  const label = ReportStateLabel[key] ?? state;
  const style = ReportStateStyle[key] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}

// ============================================================================
// 월간보고서 컬럼
// ============================================================================

function useMonthlyColumns(): ColumnDef<MonthlyReportDTO>[] {
  const router = useRouter();
  const deleteMutation = useDeleteMonthlyReport();

  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span>,
        size: 70,
      },
      {
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => <StateBadge state={row.original.state} />,
        size: 90,
      },
      {
        accessorKey: "buildingName",
        header: "건물",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/reports/monthly/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.buildingName}
          </button>
        ),
        size: 160,
      },
      {
        accessorKey: "workYear",
        header: "년도",
        cell: ({ row }) => <span>{row.original.workYear}</span>,
        size: 80,
      },
      {
        accessorKey: "workMonth",
        header: "월",
        cell: ({ row }) => <span>{row.original.workMonth}월</span>,
        size: 60,
      },
      {
        accessorKey: "writerName",
        header: "작성자",
        cell: ({ row }) => <span>{row.original.writerName || "-"}</span>,
        size: 100,
      },
      {
        accessorKey: "writeDate",
        header: "작성일",
        cell: ({ row }) => <span>{row.original.writeDate || "-"}</span>,
        size: 110,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: Row<MonthlyReportDTO> }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/reports/monthly/${row.original.id}`)}>
                <Eye className="mr-2 h-4 w-4" />상세 보기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/reports/monthly/${row.original.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />수정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  if (confirm("보고서를 삭제하시겠습니까?")) {
                    deleteMutation.mutate(row.original.id);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 50,
      },
    ],
    [router, deleteMutation]
  );
}

// ============================================================================
// 주간보고서 컬럼
// ============================================================================

function useWeeklyColumns(): ColumnDef<WeeklyReportDTO>[] {
  const router = useRouter();
  const deleteMutation = useDeleteWeeklyReport();

  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span>,
        size: 70,
      },
      {
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => <StateBadge state={row.original.state} />,
        size: 90,
      },
      {
        accessorKey: "buildingName",
        header: "건물",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/reports/weekly/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.buildingName}
          </button>
        ),
        size: 160,
      },
      {
        accessorKey: "workDateFrom",
        header: "시작일",
        cell: ({ row }) => <span>{row.original.workDateFrom}</span>,
        size: 110,
      },
      {
        accessorKey: "workDateTo",
        header: "종료일",
        cell: ({ row }) => <span>{row.original.workDateTo}</span>,
        size: 110,
      },
      {
        accessorKey: "writerName",
        header: "작성자",
        cell: ({ row }) => <span>{row.original.writerName || "-"}</span>,
        size: 100,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: Row<WeeklyReportDTO> }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/reports/weekly/${row.original.id}`)}>
                <Eye className="mr-2 h-4 w-4" />상세 보기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/reports/weekly/${row.original.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />수정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  if (confirm("보고서를 삭제하시겠습니까?")) {
                    deleteMutation.mutate(row.original.id);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 50,
      },
    ],
    [router, deleteMutation]
  );
}

// ============================================================================
// 업무일지 컬럼
// ============================================================================

function useWorkLogColumns(): ColumnDef<DailyReportDTO>[] {
  const router = useRouter();
  const deleteMutation = useDeleteWorkLog();

  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span>,
        size: 70,
      },
      {
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => <StateBadge state={row.original.state} />,
        size: 90,
      },
      {
        accessorKey: "buildingName",
        header: "건물",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/reports/work-logs/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.buildingName}
          </button>
        ),
        size: 160,
      },
      {
        accessorKey: "workDate",
        header: "업무일",
        cell: ({ row }) => <span>{row.original.workDate}</span>,
        size: 110,
      },
      {
        accessorKey: "writerName",
        header: "작성자",
        cell: ({ row }) => <span>{row.original.writerName || "-"}</span>,
        size: 100,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: Row<DailyReportDTO> }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/reports/work-logs/${row.original.id}`)}>
                <Eye className="mr-2 h-4 w-4" />상세 보기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/reports/work-logs/${row.original.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />수정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  if (confirm("업무일지를 삭제하시겠습니까?")) {
                    deleteMutation.mutate(row.original.id);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 50,
      },
    ],
    [router, deleteMutation]
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default function ReportListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabValue>("monthly");
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  const searchParams: SearchReportVO = useMemo(() => ({ page, size }), [page, size]);

  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyReportList(searchParams);
  const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyReportList(searchParams);
  const { data: workLogData, isLoading: workLogLoading } = useWorkLogList(searchParams);

  const monthlyColumns = useMonthlyColumns();
  const weeklyColumns = useWeeklyColumns();
  const workLogColumns = useWorkLogColumns();

  const handleTabChange = useCallback((tab: TabValue) => {
    setActiveTab(tab);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const newPath =
    activeTab === "monthly"
      ? "/reports/monthly/new"
      : activeTab === "weekly"
      ? "/reports/weekly/new"
      : activeTab === "workLog"
      ? "/reports/work-logs/new"
      : null;

  const currentData =
    activeTab === "monthly"
      ? monthlyData
      : activeTab === "weekly"
      ? weeklyData
      : activeTab === "workLog"
      ? workLogData
      : undefined;

  const isLoading =
    activeTab === "monthly"
      ? monthlyLoading
      : activeTab === "weekly"
      ? weeklyLoading
      : activeTab === "workLog"
      ? workLogLoading
      : false;

  const totalPages = currentData?.totalPages ?? 0;
  const totalElements = currentData?.totalElements ?? 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">보고서</h1>
          <p className="text-muted-foreground">월간/주간/업무일지 보고서를 관리합니다.</p>
        </div>
        {newPath && (
          <Button onClick={() => router.push(newPath)}>
            <Plus className="mr-2 h-4 w-4" />
            새 보고서
          </Button>
        )}
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 테이블 콘텐츠 */}
      {activeTab === "monthly" && (
        <>
          <DataTable columns={monthlyColumns} data={monthlyData?.content ?? []} loading={monthlyLoading} pagination={false} />
          {!monthlyLoading && (monthlyData?.content ?? []).length === 0 && (
            <EmptyState icon={FileText} title="월간보고서가 없습니다" description="새 보고서를 등록해보세요."
              action={{ label: "새 월간보고서", onClick: () => router.push("/reports/monthly/new") }}
            />
          )}
        </>
      )}

      {activeTab === "weekly" && (
        <>
          <DataTable columns={weeklyColumns} data={weeklyData?.content ?? []} loading={weeklyLoading} pagination={false} />
          {!weeklyLoading && (weeklyData?.content ?? []).length === 0 && (
            <EmptyState icon={FileText} title="주간보고서가 없습니다" description="새 보고서를 등록해보세요."
              action={{ label: "새 주간보고서", onClick: () => router.push("/reports/weekly/new") }}
            />
          )}
        </>
      )}

      {activeTab === "workLog" && (
        <>
          <DataTable columns={workLogColumns} data={workLogData?.content ?? []} loading={workLogLoading} pagination={false} />
          {!workLogLoading && (workLogData?.content ?? []).length === 0 && (
            <EmptyState icon={FileText} title="업무일지가 없습니다" description="새 업무일지를 등록해보세요."
              action={{ label: "새 업무일지", onClick: () => router.push("/reports/work-logs/new") }}
            />
          )}
        </>
      )}

      {activeTab === "tbm" && (
        <EmptyState icon={AlertCircle} title="TBM 목록" description="TBM(법정보고서) 기능은 준비 중입니다." />
      )}

      {/* 페이지네이션 */}
      {activeTab !== "tbm" && totalPages > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            총 {totalElements}건 중 {page * size + 1}-{Math.min((page + 1) * size, totalElements)}건
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(0)} disabled={page === 0}>처음</Button>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>이전</Button>
            <span className="px-2 text-sm">{page + 1} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}>다음</Button>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(totalPages - 1)} disabled={page >= totalPages - 1}>마지막</Button>
          </div>
        </div>
      )}
    </div>
  );
}
