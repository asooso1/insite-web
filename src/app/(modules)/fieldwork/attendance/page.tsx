"use client";

import { useState, useMemo } from "react";
import { Clock, AlertCircle, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";

import { useFieldAttendanceList } from "@/lib/hooks/use-field-attendance";
import {
  LogInLogOutMethodLabel,
  type FieldAttendanceDTO,
} from "@/lib/types/field-attendance";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<FieldAttendanceDTO>[] {
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
        accessorKey: "accountName",
        header: "작업자",
        cell: ({ row }) => (
          <span className="font-medium text-foreground">
            {row.original.accountName}
          </span>
        ),
      },
      {
        accessorKey: "projectName",
        header: "프로젝트",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.projectName}</span>
        ),
      },
      {
        accessorKey: "workOrderTitle",
        header: "작업명",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.workOrderTitle}
          </span>
        ),
      },
      {
        accessorKey: "checkInTime",
        header: "체크인 시간",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.checkInTime
              ? new Date(row.original.checkInTime).toLocaleString("ko-KR")
              : "-"}
          </span>
        ),
      },
      {
        accessorKey: "checkOutTime",
        header: "체크아웃 시간",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.checkOutTime
              ? new Date(row.original.checkOutTime).toLocaleString("ko-KR")
              : "-"}
          </span>
        ),
      },
      {
        accessorKey: "logInLogOutMethod",
        header: "방식",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {LogInLogOutMethodLabel[row.original.logInLogOutMethod]}
          </span>
        ),
      },
    ],
    []
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default function FieldAttendancePage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const buildingId = Number(user?.currentBuildingId ?? 0);

  const { data, isLoading, isError } = useFieldAttendanceList({
    projectId: buildingId > 0 ? buildingId : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    page,
    size,
  });

  const columns = useColumns();

  if (isError) {
    return (
      <EmptyState
        title="오류 발생"
        description="출퇴근 이력을 불러올 수 없습니다"
        icon={AlertCircle}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="출퇴근 이력"
        description="작업자의 출퇴근 기록을 확인하세요"
        icon={Clock}
      />

      {/* 필터 영역 */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-foreground">시작일</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(0);
              }}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">종료일</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(0);
              }}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* 테이블 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-muted-foreground">불러오는 중...</span>
        </div>
      ) : !data?.content || data.content.length === 0 ? (
        <EmptyState
          title="출퇴근 이력이 없습니다"
          description="선택한 기간에 출퇴근 기록이 없습니다"
          icon={Inbox}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data.content}
          />

          {/* 페이지네이션 */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                총 {data.totalElements}개 중 {page * size + 1}-
                {Math.min((page + 1) * size, data.totalElements)}개 표시
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  이전
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.totalPages - 1}
                >
                  다음
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
