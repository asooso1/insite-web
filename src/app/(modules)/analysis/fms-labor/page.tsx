"use client";

import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/page-header";
import { LineChartPreset } from "@/components/charts";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";
import { useFmsLabor } from "@/lib/hooks/use-analysis";
import type { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// Helpers
// ============================================================================

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 4 }, (_, i) => currentYear - i);
}

// ============================================================================
// Labor Distribution Columns
// ============================================================================

function useLaborDistributionColumns(): ColumnDef<{
  alarmLevel: string;
  prevMonth: number;
  thisMonth: number;
  average: number;
}>[] {
  return useMemo(
    () => [
      {
        accessorKey: "alarmLevel",
        header: "알람 레벨",
        size: 100,
      },
      {
        accessorKey: "prevMonth",
        header: "전월",
        size: 80,
      },
      {
        accessorKey: "thisMonth",
        header: "당월",
        size: 80,
      },
      {
        accessorKey: "average",
        header: "평균",
        size: 80,
      },
    ],
    []
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function FmsLaborPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const params = useMemo(
    () => ({
      searchYear: year,
      searchMonth: month,
    }),
    [year, month]
  );

  const { data, isLoading, isError } = useFmsLabor(params);

  const columns = useLaborDistributionColumns();

  // 차트 데이터
  const trendChartData = useMemo(
    () => data?.laborTrendChartDTOs || [],
    [data]
  );

  const rateChartData = useMemo(
    () => data?.laborRateChartDTOs || [],
    [data]
  );

  const assignmentChartData = useMemo(
    () => data?.assignmentChartDTOs || [],
    [data]
  );

  const distributionData = useMemo(
    () => data?.laborDistributionDTOs || [],
    [data]
  );

  if (isError) {
    return (
      <div className="space-y-8">
        <PageHeader title="투입 인력 분석" icon={Users} />
        <EmptyState
          title="데이터를 불러올 수 없습니다"
          description="나중에 다시 시도해 주세요."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="투입 인력 분석" icon={Users} />

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

      {/* 차트 */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          불러오는 중...
        </div>
      ) : data ? (
        <div className="space-y-8">
          {trendChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                할당/처리 인력 추이
              </h3>
              <LineChartPreset
                data={trendChartData}
                xAxisKey="label"
                dataKeys={{
                  assigned: "할당",
                  processed: "처리",
                }}
                height={300}
              />
            </div>
          )}

          {rateChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                처리율 추이
              </h3>
              <LineChartPreset
                data={rateChartData}
                xAxisKey="label"
                dataKeys={{
                  rate: "처리율(%)",
                }}
                height={300}
              />
            </div>
          )}

          {assignmentChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                평균 할당자 수
              </h3>
              <LineChartPreset
                data={assignmentChartData}
                xAxisKey="label"
                dataKeys={{
                  count: "할당자",
                }}
                height={300}
              />
            </div>
          )}

          {distributionData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                알람별 인력 분포
              </h3>
              <DataTable
                columns={columns}
                data={distributionData}
              />
            </div>
          )}

          {trendChartData.length === 0 &&
            rateChartData.length === 0 &&
            assignmentChartData.length === 0 &&
            distributionData.length === 0 && (
              <EmptyState
                title="데이터가 없습니다"
                description="조건에 맞는 인력 데이터가 없습니다."
              />
            )}
        </div>
      ) : (
        <EmptyState
          title="데이터가 없습니다"
          description="조건에 맞는 데이터가 없습니다."
        />
      )}
    </div>
  );
}
