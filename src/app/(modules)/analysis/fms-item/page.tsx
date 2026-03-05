"use client";

import { useState, useMemo } from "react";
import { Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/page-header";
import { BarChartPreset } from "@/components/charts";
import { EmptyState } from "@/components/data-display/empty-state";
import { useFmsItemHistory } from "@/lib/hooks/use-analysis";

// ============================================================================
// Helpers
// ============================================================================

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 4 }, (_, i) => currentYear - i);
}

function getTop10(items: Array<{ materialName: string; count: number }>) {
  return items.slice(0, 10).map((item) => ({
    materialName: item.materialName,
    count: item.count,
  }));
}

// ============================================================================
// Main Component
// ============================================================================

export default function FmsItemPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const params = useMemo(
    () => ({
      searchYear: year,
      searchMonth: month,
    }),
    [year, month]
  );

  const { data, isLoading, isError } = useFmsItemHistory(params);

  // 차트 데이터 준비
  const stockChartData = useMemo(() => {
    if (!data?.materialSuitableOfCurrentStockDTOs) return [];
    return getTop10(data.materialSuitableOfCurrentStockDTOs);
  }, [data]);

  const useChartData = useMemo(() => {
    if (!data?.materialSuitableOfUseStockDTOs) return [];
    return getTop10(data.materialSuitableOfUseStockDTOs);
  }, [data]);

  const timeChartData = useMemo(() => {
    if (!data?.materialUseTimeDTOs) return [];
    return getTop10(data.materialUseTimeDTOs);
  }, [data]);

  if (isError) {
    return (
      <div className="space-y-8">
        <PageHeader title="자재 입출고 분석" icon={Package} />
        <EmptyState
          title="데이터를 불러올 수 없습니다"
          description="나중에 다시 시도해 주세요."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="자재 입출고 분석" icon={Package} />

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
          {stockChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                보유 현황 TOP 10
              </h3>
              <BarChartPreset
                data={stockChartData}
                xAxisKey="materialName"
                dataKeys={{ count: "수량" }}
                height={300}
                horizontal
              />
            </div>
          )}

          {useChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                소진 현황 TOP 10
              </h3>
              <BarChartPreset
                data={useChartData}
                xAxisKey="materialName"
                dataKeys={{ count: "수량" }}
                height={300}
                horizontal
              />
            </div>
          )}

          {timeChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                사용 시간 TOP 10
              </h3>
              <BarChartPreset
                data={timeChartData}
                xAxisKey="materialName"
                dataKeys={{ count: "시간" }}
                height={300}
                horizontal
              />
            </div>
          )}

          {stockChartData.length === 0 &&
            useChartData.length === 0 &&
            timeChartData.length === 0 && (
              <EmptyState
                title="데이터가 없습니다"
                description="조건에 맞는 자재 데이터가 없습니다."
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
