"use client";

import { useState } from "react";
import { Users, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { DataTable, type ColumnDef } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";
import { Button } from "@/components/ui/button";
import { useAttendanceDayAdmin, useDownloadAttendanceExcel } from "@/lib/hooks/use-service-attendance";
import {
  AttendanceStatus,
  AttendanceStatusLabel,
  type AttendanceDTO,
} from "@/lib/types/service-attendance";
import { handleApiError } from "@/lib/api/error-handler";
import { toast } from "sonner";

// ============================================================================
// 컬럼 정의
// ============================================================================

const columns: ColumnDef<AttendanceDTO>[] = [
  {
    accessorKey: "accountName",
    header: "이름",
    size: 120,
  },
  {
    accessorKey: "date",
    header: "날짜",
    size: 120,
  },
  {
    accessorKey: "checkInTime",
    header: "출근 시간",
    size: 120,
    cell: ({ row }) => row.original.checkInTime ?? "-",
  },
  {
    accessorKey: "checkOutTime",
    header: "퇴근 시간",
    size: 120,
    cell: ({ row }) => row.original.checkOutTime ?? "-",
  },
  {
    accessorKey: "workHours",
    header: "근무 시간",
    size: 100,
    cell: ({ row }) =>
      row.original.workHours !== null ? `${row.original.workHours}시간` : "-",
    meta: { className: "text-right" },
  },
  {
    accessorKey: "status",
    header: "상태",
    size: 100,
    cell: ({ row }) =>
      AttendanceStatusLabel[row.original.status] ?? row.original.status,
    meta: { className: "text-center" },
  },
];

// ============================================================================
// 상수
// ============================================================================

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

const INITIAL_FILTERS = {
  date: getTodayString(),
};

const FILTER_DEFS: FilterDef[] = [
  {
    type: "date-range",
    fromKey: "date",
    toKey: "date",
    fromPlaceholder: "날짜 선택",
    toPlaceholder: "날짜 선택",
  },
];

// ============================================================================
// 컴포넌트
// ============================================================================

export default function ServiceAttendancePage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const { data, isLoading, isError, refetch } = useAttendanceDayAdmin({
    date: filters.date,
    page: 0,
    size: 50,
  });

  const { mutate: downloadExcel, isPending: isDownloading } =
    useDownloadAttendanceExcel();

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => setFilters(INITIAL_FILTERS);

  const handleDownload = () => {
    downloadExcel(
      { date: filters.date },
      {
        onSuccess: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `근태현황_${filters.date}.xlsx`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        onError: (error) => handleApiError(error),
      }
    );
  };

  if (isError) return <EmptyState icon={AlertCircle} title="데이터를 불러올 수 없습니다" description="잠시 후 다시 시도해주세요." action={{ label: "다시 시도", onClick: () => void refetch() }} />;

  const rows = data?.content ?? [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="근태 관리"
        description="직원 출퇴근 현황을 관리합니다"
        icon={Users}
        stats={[{ label: "전체", value: data?.totalElements ?? 0 }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            엑셀 다운로드
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
        data={rows}
        loading={isLoading}
        pagination
        pageSize={50}
      />
    </div>
  );
}
