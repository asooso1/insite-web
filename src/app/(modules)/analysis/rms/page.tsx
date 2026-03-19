"use client";

import { useState, useMemo } from "react";
import { AlertCircle, Search } from "lucide-react";
import { useRms } from "@/lib/hooks/use-analysis";
import { PageHeader } from "@/components/common/page-header";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";
import { KPICard } from "@/components/data-display/kpi-card";
import { Loader } from "@/components/data-display/loader";
import type { ColumnDef } from "@tanstack/react-table";
import type { AlarmTypeOccurRatioDTO } from "@/lib/types/analysis";

// ============================================================================
// 필터 정의
// ============================================================================

const INITIAL_FILTERS = {
  searchYear: String(new Date().getFullYear()),
  searchMonth: String(new Date().getMonth() + 1).padStart(2, "0"),
};

const FILTER_DEFS: FilterDef[] = [
  {
    type: "select",
    key: "searchYear",
    options: Array.from({ length: 5 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return { value: String(year), label: `${year}년` };
    }),
  },
  {
    type: "select",
    key: "searchMonth",
    options: Array.from({ length: 12 }, (_, i) => {
      const month = String(i + 1).padStart(2, "0");
      return { value: month, label: `${i + 1}월` };
    }),
  },
];

// ============================================================================
// 컬럼 정의
// ============================================================================

const columns: ColumnDef<AlarmTypeOccurRatioDTO>[] = [
  {
    accessorKey: "legendName",
    header: "알람 유형",
    size: 200,
  },
  {
    accessorKey: "alarmTypeOccurRatio",
    header: "비율 (%)",
    size: 120,
    cell: ({ row }) => `${(row.original.alarmTypeOccurRatio ?? 0).toFixed(2)}%`,
  },
];

// ============================================================================
// 페이지 컴포넌트
// ============================================================================

export default function RmsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const { data, isLoading, isError, refetch } = useRms({
    searchYear: Number(filters.searchYear),
    searchMonth: Number(filters.searchMonth),
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters(INITIAL_FILTERS);
  };

  // 현재 월의 알람 처리율 계산
  const currentMonthRatio = useMemo(() => {
    return data?.thisMonthAlarmReqCompleteRatioDTO?.ratio ?? 0;
  }, [data]);

  // 평균 알람 처리율
  const averageRatio = useMemo(() => {
    return data?.avgAlarmReqCompleteRatioDTO?.ratio ?? 0;
  }, [data]);

  // 내구 연한 종료 설비 수
  const endFacilityCount = useMemo(() => {
    return data?.monthlyPersistingPeriodEndFacilityDTO?.endFacilityCount ?? 0;
  }, [data]);

  // 현재 월의 알람 유형별 비율 데이터
  const alarmTypeData = useMemo(() => {
    return data?.thisAlarmTypeOccurRatioDTOs ?? [];
  }, [data]);

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="데이터 조회 실패"
        description="RMS 분석 데이터를 불러올 수 없습니다."
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="RMS 분석"
        description="원격 모니터링 시스템(RMS) 분석 데이터"
      />

      <FilterBar
        filters={FILTER_DEFS}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      ) : (
        <>
          {/* KPI 카드 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KPICard
              title="현재 월 알람 처리율"
              value={`${currentMonthRatio.toFixed(2)}%`}
            />
            <KPICard
              title="평균 알람 처리율"
              value={`${averageRatio.toFixed(2)}%`}
            />
            <KPICard
              title="내구 연한 종료 설비"
              value={String(endFacilityCount)}
            />
          </div>

          {/* 알람 유형별 비율 테이블 */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">알람 유형별 비율</h3>
            {alarmTypeData.length === 0 ? (
              <EmptyState
                icon={Search}
                title="알람 유형 데이터 없음"
                description="선택한 기간에 알람 유형 데이터가 없습니다."
              />
            ) : (
              <DataTable
                columns={columns}
                data={alarmTypeData}
                loading={isLoading}
              />
            )}
          </div>

          {/* 내구 연한 종료 설비 목록 */}
          {data?.persistPeriodEndFacilityDTOs &&
            data.persistPeriodEndFacilityDTOs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold">
                  내구 연한 종료 설비 목록
                </h3>
                <DataTable
                  columns={[
                    {
                      accessorKey: "buildingName",
                      header: "빌딩",
                      size: 150,
                    },
                    {
                      accessorKey: "facilityName",
                      header: "설비명",
                      size: 200,
                    },
                    {
                      accessorKey: "chargerName",
                      header: "담당자",
                      size: 150,
                    },
                    {
                      accessorKey: "persistPeriod",
                      header: "내구연한(년)",
                      size: 120,
                    },
                    {
                      accessorKey: "persistPeriodEnd",
                      header: "만료일",
                      size: 130,
                      cell: ({ row }) => row.original.persistPeriodEnd || "-",
                    },
                  ]}
                  data={data.persistPeriodEndFacilityDTOs}
                  loading={isLoading}
                />
              </div>
            )}
        </>
      )}
    </div>
  );
}
