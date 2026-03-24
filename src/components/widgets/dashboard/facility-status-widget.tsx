"use client";

import { type ReactNode } from "react";
import { Building2, CheckCircle2, AlertCircle, Hammer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetContainer } from "../widget-container";
import { type WidgetProps } from "../widget-registry";
import { useFacilityStatus } from "@/lib/hooks/use-dashboard";
import type { SearchWidgetVO } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";

// ============================================================================
// Sub-components
// ============================================================================

interface KpiCardProps {
  /** 카드 제목 */
  label: string;
  /** 수치 */
  value: number | undefined;
  /** 아이콘 */
  icon: ReactNode;
  /** 강조 색상 클래스 */
  colorClass: string;
  /** 로딩 상태 */
  loading: boolean;
}

/** KPI 수치 카드 */
function KpiCard({ label, value, icon, colorClass, loading }: KpiCardProps): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-3 gap-1.5">
      <div className={cn("rounded-full p-2", colorClass)}>{icon}</div>
      {loading ? (
        <Skeleton className="h-7 w-12" />
      ) : (
        <span className="text-2xl font-bold tabular-nums">{(value ?? 0).toLocaleString()}</span>
      )}
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

/**
 * 시설 현황 KPI 위젯
 *
 * 전체/운영중/점검중/공사중 시설 수를 KPI 카드로 표시합니다.
 */
export function FacilityStatusWidget({ instanceId, config, onRefresh }: WidgetProps): ReactNode {
  const buildingId = config?.buildingId as number | undefined;
  const dashboardType = config?.dashboardType as SearchWidgetVO["dashboardType"];

  const params: SearchWidgetVO = {
    buildingId,
    dashboardType,
  };

  const { data, isLoading, error, refetch } = useFacilityStatus(params);

  const handleRefresh = () => {
    void refetch();
    onRefresh?.();
  };

  return (
    <WidgetContainer
      id={instanceId}
      title="시설 현황"
      subtitle="전체 시설 KPI"
      icon={Building2}
      size="4x2"
      loading={isLoading}
      error={error}
      onRefresh={handleRefresh}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 h-full py-1">
        <KpiCard
          label="전체"
          value={data?.totalCount}
          icon={<Building2 className="h-4 w-4 text-primary" />}
          colorClass="bg-primary/10"
          loading={isLoading}
        />
        <KpiCard
          label="운영중"
          value={data?.operatingCount}
          icon={<CheckCircle2 className="h-4 w-4 text-system-green" />}
          colorClass="bg-[var(--system-green-secondary)]"
          loading={isLoading}
        />
        <KpiCard
          label="점검중"
          value={data?.checkingCount}
          icon={<AlertCircle className="h-4 w-4 text-system-yellow" />}
          colorClass="bg-[var(--system-yellow-secondary)]"
          loading={isLoading}
        />
        <KpiCard
          label="공사중"
          value={data?.constructingCount}
          icon={<Hammer className="h-4 w-4 text-system-blue" />}
          colorClass="bg-[var(--system-blue-secondary)]"
          loading={isLoading}
        />
      </div>
    </WidgetContainer>
  );
}
