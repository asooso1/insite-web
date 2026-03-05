"use client";

import { use, useState, useMemo } from "react";
import { Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { LineChartPreset } from "@/components/charts";
import { EmptyState } from "@/components/data-display/empty-state";
import {
  useFmsTrendDetail,
  useFmsTrendData,
} from "@/lib/hooks/use-analysis";

// ============================================================================
// Info Card
// ============================================================================

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 font-semibold">{value || "-"}</div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function FmsTrendDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const controlPointId = Number(id);

  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { data: detail, isLoading: detailLoading } =
    useFmsTrendDetail(controlPointId);
  const { data: trendData, isLoading: trendLoading } =
    useFmsTrendData({
      controlPointId,
      startDate: startDate as string,
      endDate: endDate as string,
    });

  const chartData = useMemo(() => {
    if (!trendData) return [];

    return trendData.map((item) => ({
      timestamp: new Date(item.timestamp).toLocaleDateString(),
      value: item.value,
      ...(item.compareValue && { compareValue: item.compareValue }),
    }));
  }, [trendData]);

  const title = detail?.controlPointName || "FMS 트렌드 상세";

  if (detailLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title={title} icon={Activity} />
        <div className="text-center py-8 text-muted-foreground">
          불러오는 중...
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="space-y-8">
        <PageHeader title={title} icon={Activity} />
        <EmptyState
          title="데이터를 찾을 수 없습니다"
          description="존재하지 않는 관제점입니다."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title={title} icon={Activity} />

      {/* 기본 정보 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <InfoCard label="빌딩" value={detail.buildingName} />
          <InfoCard label="층" value={detail.buildingFloor} />
          <InfoCard label="설비명" value={detail.facilityName} />
          <InfoCard label="분류경로" value={detail.facilityCategoryPath} />
          <InfoCard label="측정유형" value={detail.controlPointMeasureTypeName} />
          <InfoCard label="단위" value={detail.controlPointMeasureUnit} />
          <InfoCard label="우선순위" value={detail.controlPointPriorityName} />
          <InfoCard label="상태" value={detail.controlPointStateName} />
          <InfoCard label="상한값" value={detail.controlPointUpperLimit} />
          <InfoCard label="하한값" value={detail.controlPointLowestLimit} />
        </div>
      </div>

      {/* 기간 선택 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">데이터 조회</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium">시작일</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium">종료일</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* 트렌드 차트 */}
      {trendLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          불러오는 중...
        </div>
      ) : chartData.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">시간대별 추이</h3>
          <LineChartPreset
            data={chartData}
            xAxisKey="timestamp"
            dataKeys={{
              value: "측정값",
              ...(chartData.some((d) => "compareValue" in d) && {
                compareValue: "비교값",
              }),
            }}
            height={400}
          />
        </div>
      ) : (
        <EmptyState
          title="차트 데이터가 없습니다"
          description="해당 기간의 데이터가 없습니다."
        />
      )}
    </div>
  );
}
