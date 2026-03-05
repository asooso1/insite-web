"use client";

import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/page-header";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";
import { useUsageStatus } from "@/lib/hooks/use-analysis";
import type {
  UsageStatusItemDTO,
  UsageStatusSummaryDTO,
} from "@/lib/types/analysis";
import type { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// Helpers
// ============================================================================

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 4 }, (_, i) => currentYear - i);
}

function SummaryCard({
  label,
  value,
  unit = "",
}: {
  label: string;
  value: number | string;
  unit?: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-bold">
        {value}
        {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

// ============================================================================
// Columns
// ============================================================================

function useColumns(): ColumnDef<UsageStatusItemDTO>[] {
  return useMemo(
    () => [
      {
        accessorKey: "chargeDepartment",
        header: "사업소",
        size: 120,
      },
      {
        accessorKey: "managerName",
        header: "담당자",
        size: 100,
      },
      {
        accessorKey: "buildingName",
        header: "빌딩명",
        size: 150,
      },
      {
        accessorKey: "featureUsageRate",
        header: "기능사용률(%)",
        cell: ({ row }) => (
          <span>{(row.original.featureUsageRate * 100).toFixed(1)}</span>
        ),
        size: 120,
      },
      {
        accessorKey: "participationRate",
        header: "참여율(%)",
        cell: ({ row }) => (
          <span>{(row.original.participationRate * 100).toFixed(1)}</span>
        ),
        size: 100,
      },
      {
        accessorKey: "participant",
        header: "참여자 수",
        size: 100,
      },
      {
        accessorKey: "workOrderCount",
        header: "작업 수",
        size: 80,
      },
      {
        accessorKey: "vocCount",
        header: "민원 수",
        size: 80,
      },
      {
        accessorKey: "reportCount",
        header: "보고 수",
        size: 80,
      },
    ],
    []
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function UsagePage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const params = useMemo(
    () => ({
      searchYear: year,
      searchMonth: month,
    }),
    [year, month]
  );

  const { data, isLoading, isError } = useUsageStatus(params);

  const columns = useColumns();

  const summaryItems: Array<{
    label: string;
    value: number | string;
    unit?: string;
  }> = useMemo(() => {
    if (!data) return [];

    const prev = data.prevMonth;
    const curr = data.thisMonth;

    return [
      {
        label: "건물 수 (당월)",
        value: curr.buildingCount,
      },
      {
        label: "평균 작업 수",
        value: curr.workOrderCountAverage.toFixed(1),
      },
      {
        label: "참여율",
        value: ((curr.approveCountAverage / curr.totalCount) * 100).toFixed(1),
        unit: "%",
      },
    ];
  }, [data]);

  if (isError) {
    return (
      <div className="space-y-8">
        <PageHeader title="사용 현황" icon={TrendingUp} />
        <EmptyState
          title="데이터를 불러올 수 없습니다"
          description="나중에 다시 시도해 주세요."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="사용 현황" icon={TrendingUp} />

      {/* 필터 */}
      <div className="flex gap-4">
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {getYearOptions().map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}년
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <SelectItem key={m} value={String(m)}>
                {m}월
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 요약 카드 */}
      {data && (
        <div className="grid gap-4 md:grid-cols-3">
          {summaryItems.map((item) => (
            <SummaryCard
              key={item.label}
              label={item.label}
              value={item.value}
              unit={item.unit}
            />
          ))}
        </div>
      )}

      {/* 테이블 */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          불러오는 중...
        </div>
      ) : data && data.listData.length > 0 ? (
        <DataTable
          columns={columns}
          data={data.listData}
        />
      ) : (
        <EmptyState
          title="데이터가 없습니다"
          description="조건에 맞는 데이터가 없습니다."
        />
      )}
    </div>
  );
}
