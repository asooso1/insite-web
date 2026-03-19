"use client";

import { useState, useMemo } from "react";
import { BarChart2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/data-display/empty-state";
import { DataTable } from "@/components/data-display/data-table";
import {
  BarChartPreset,
  LineChartPreset,
  PieChartPreset,
} from "@/components/charts";
import {
  useStatisticsA,
  useStatisticsB,
  useStatisticsC,
} from "@/lib/hooks/use-analysis";
import type {
  StatisticsADTO,
  StatisticsBDTO,
  StatisticsCItemDTO,
} from "@/lib/types/analysis";
import type { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// Helpers
// ============================================================================

function getMonthOptions() {
  const today = new Date();
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i);
    months.push({
      value: d.toISOString().split("T")[0],
      label: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`,
    });
  }
  return months;
}

// ============================================================================
// Statistics A (기능별 순위)
// ============================================================================

function StatisticsATab({
  data,
  isLoading,
}: {
  data: StatisticsADTO | undefined;
  isLoading: boolean;
}) {
  const chartData = useMemo(() => {
    if (!data?.usageRankingDTOS) return [];

    return data.usageRankingDTOS.buildingName.map((name, idx) => ({
      buildingName: name,
      스케줄: data.usageRankingDTOS.scheduleScore[idx] || 0,
      작업지시: data.usageRankingDTOS.workOrderScore[idx] || 0,
      보고: data.usageRankingDTOS.reportScore[idx] || 0,
      청구: data.usageRankingDTOS.invoiceBillScore[idx] || 0,
      민원: data.usageRankingDTOS.vocScore[idx] || 0,
      자재: data.usageRankingDTOS.materialScore[idx] || 0,
    }));
  }, [data]);

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">불러오는 중...</div>;
  }

  if (!data || chartData.length === 0) {
    return (
      <EmptyState
        title="데이터가 없습니다"
        description="조건에 맞는 데이터가 없습니다."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">빌딩별 기능 점수</h3>
        <BarChartPreset
          data={chartData}
          xAxisKey="buildingName"
          dataKeys={{
            스케줄: "스케줄",
            작업지시: "작업지시",
            보고: "보고",
            청구: "청구",
            민원: "민원",
            자재: "자재",
          }}
          height={400}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Statistics B (직무별 분포)
// ============================================================================

function StatisticsBTab({
  data,
  isLoading,
}: {
  data: StatisticsBDTO | undefined;
  isLoading: boolean;
}) {
  const pieData = useMemo(() => {
    if (!data?.usageJobTypeDTO) return [];

    return data.usageJobTypeDTO.jobType.map((jobType, idx) => ({
      name: jobType,
      value: data.usageJobTypeDTO.value[idx] || 0,
    }));
  }, [data]);

  const barData = useMemo(() => {
    if (!data?.usageRankingJobTypeDTO) return [];

    return data.usageRankingJobTypeDTO.jobTypeGroup.map((group, idx) => ({
      jobTypeGroup: group,
      작업지시평균: data.usageRankingJobTypeDTO.workOrderAvg[idx] || 0,
      보고평균: data.usageRankingJobTypeDTO.reportAvg[idx] || 0,
      스케줄평균: data.usageRankingJobTypeDTO.scheduleAvg[idx] || 0,
      청구평균: data.usageRankingJobTypeDTO.invoiceBillAvg[idx] || 0,
    }));
  }, [data]);

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">불러오는 중...</div>;
  }

  if (!data || (pieData.length === 0 && barData.length === 0)) {
    return (
      <EmptyState
        title="데이터가 없습니다"
        description="조건에 맞는 데이터가 없습니다."
      />
    );
  }

  return (
    <div className="space-y-8">
      {pieData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">직무별 분포</h3>
          <PieChartPreset data={pieData} height={300} showLegend />
        </div>
      )}

      {barData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">직무별 평균 지표</h3>
          <BarChartPreset
            data={barData}
            xAxisKey="jobTypeGroup"
            dataKeys={{
              작업지시평균: "작업지시",
              보고평균: "보고",
              스케줄평균: "스케줄",
              청구평균: "청구",
            }}
            height={400}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Statistics C (부서별 상세)
// ============================================================================

function useStatisticsCColumns(): ColumnDef<StatisticsCItemDTO>[] {
  return useMemo(
    () => [
      {
        accessorKey: "chargeDepartment",
        header: "부서",
        size: 120,
      },
      {
        accessorKey: "buildingName",
        header: "빌딩명",
        size: 150,
      },
      {
        accessorKey: "worker",
        header: "담당자",
        size: 80,
      },
      {
        accessorKey: "task",
        header: "업무",
        size: 80,
      },
      {
        accessorKey: "complain",
        header: "민원",
        size: 80,
      },
      {
        accessorKey: "fmsItem",
        header: "자재",
        size: 80,
      },
      {
        accessorKey: "report",
        header: "보고",
        size: 80,
      },
      {
        accessorKey: "bill",
        header: "청구",
        size: 80,
      },
    ],
    []
  );
}

function StatisticsCTab({
  data,
  isLoading,
}: {
  data: StatisticsCItemDTO[] | undefined;
  isLoading: boolean;
}) {
  const columns = useStatisticsCColumns();

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">불러오는 중...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="데이터가 없습니다"
        description="조건에 맞는 데이터가 없습니다."
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
    />
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function StatisticsPage() {
  // 백엔드가 yyyy-MM 형식 기대 (getThisYearMonthDayFr: searchDateFr + "-01 00:00:00")
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 7) // "yyyy-MM"
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().slice(0, 7) // "yyyy-MM"
  );

  const statsA = useStatisticsA({
    searchDateFr: startDate as string,
    searchDateTo: endDate as string,
  });
  const statsB = useStatisticsB({
    searchDateFr: startDate as string,
    searchDateTo: endDate as string,
  });
  const statsC = useStatisticsC({
    searchDateFr: startDate as string,
    searchDateTo: endDate as string,
  });

  return (
    <div className="space-y-8">
      <PageHeader title="통계 분석" icon={BarChart2} />

      {/* 날짜 필터 */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium">시작일</label>
          <Input
            type="month"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium">종료일</label>
          <Input
            type="month"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      {/* 탭 */}
      <Tabs defaultValue="a" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="a">A등급 (기능별)</TabsTrigger>
          <TabsTrigger value="b">B등급 (직무별)</TabsTrigger>
          <TabsTrigger value="c">C등급 (부서별)</TabsTrigger>
        </TabsList>

        <TabsContent value="a" className="mt-8">
          <StatisticsATab
            data={statsA.data}
            isLoading={statsA.isLoading}
          />
        </TabsContent>

        <TabsContent value="b" className="mt-8">
          <StatisticsBTab
            data={statsB.data}
            isLoading={statsB.isLoading}
          />
        </TabsContent>

        <TabsContent value="c" className="mt-8">
          <StatisticsCTab
            data={statsC.data}
            isLoading={statsC.isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
