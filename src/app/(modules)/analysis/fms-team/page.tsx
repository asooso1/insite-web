"use client";

import { useState, useMemo } from "react";
import { ClipboardList } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/page-header";
import { LineChartPreset, BarChartPreset } from "@/components/charts";
import { EmptyState } from "@/components/data-display/empty-state";
import { useFmsTeam } from "@/lib/hooks/use-analysis";

// ============================================================================
// Helpers
// ============================================================================

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 4 }, (_, i) => currentYear - i);
}

// ============================================================================
// Main Component
// ============================================================================

export default function FmsTeamPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const params = useMemo(
    () => ({
      searchYear: year,
      searchMonth: month,
    }),
    [year, month]
  );

  const { data, isLoading, isError } = useFmsTeam(params);

  // 차트 데이터
  const occurrenceChartData = useMemo(
    () => data?.workOrderOccurrenceDTOs || [],
    [data]
  );

  const processRateChartData = useMemo(
    () => data?.workOrderProcessRateDTOs || [],
    [data]
  );

  const completionTimeChartData = useMemo(
    () => data?.workOrderAvgCompletionTimeDTOs || [],
    [data]
  );

  const typeChartData = useMemo(
    () => data?.workOrderTypeChartDTOs || [],
    [data]
  );

  const categoryChartData = useMemo(
    () => data?.workOrderCategoryChartDTOs || [],
    [data]
  );

  const typeTimeChartData = useMemo(
    () => data?.typeCompletionTimeDTOs || [],
    [data]
  );

  const categoryTimeChartData = useMemo(
    () => data?.categoryCompletionTimeDTOs || [],
    [data]
  );

  const processTimeChartData = useMemo(
    () => data?.workOrderProcessTimeDTOs || [],
    [data]
  );

  if (isError) {
    return (
      <div className="space-y-8">
        <PageHeader title="작업 현황 분석" icon={ClipboardList} />
        <EmptyState
          title="데이터를 불러올 수 없습니다"
          description="나중에 다시 시도해 주세요."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="작업 현황 분석" icon={ClipboardList} />

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
          {occurrenceChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                작업 발생 건수
              </h3>
              <LineChartPreset
                data={occurrenceChartData}
                xAxisKey="label"
                dataKeys={{
                  count: "발생건수",
                }}
                height={300}
              />
            </div>
          )}

          {processRateChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                작업 처리율
              </h3>
              <LineChartPreset
                data={processRateChartData}
                xAxisKey="label"
                dataKeys={{
                  rate: "처리율(%)",
                }}
                height={300}
              />
            </div>
          )}

          {typeChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                유형별 작업 건수
              </h3>
              <BarChartPreset
                data={typeChartData}
                xAxisKey="label"
                dataKeys={{
                  count: "건수",
                }}
                height={300}
              />
            </div>
          )}

          {categoryChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                구분별 작업 건수
              </h3>
              <BarChartPreset
                data={categoryChartData}
                xAxisKey="label"
                dataKeys={{
                  count: "건수",
                }}
                height={300}
              />
            </div>
          )}

          {typeTimeChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                유형별 평균 완료 시간
              </h3>
              <BarChartPreset
                data={typeTimeChartData}
                xAxisKey="label"
                dataKeys={{
                  minutes: "분",
                }}
                height={300}
              />
            </div>
          )}

          {categoryTimeChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                구분별 평균 완료 시간
              </h3>
              <BarChartPreset
                data={categoryTimeChartData}
                xAxisKey="label"
                dataKeys={{
                  minutes: "분",
                }}
                height={300}
              />
            </div>
          )}

          {processTimeChartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                전체 평균 처리 시간
              </h3>
              <BarChartPreset
                data={processTimeChartData}
                xAxisKey="label"
                dataKeys={{
                  minutes: "분",
                }}
                height={300}
              />
            </div>
          )}

          {occurrenceChartData.length === 0 &&
            processRateChartData.length === 0 &&
            typeChartData.length === 0 &&
            categoryChartData.length === 0 &&
            typeTimeChartData.length === 0 &&
            categoryTimeChartData.length === 0 &&
            processTimeChartData.length === 0 && (
              <EmptyState
                title="데이터가 없습니다"
                description="조건에 맞는 작업 데이터가 없습니다."
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
