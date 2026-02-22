"use client";

import { type ReactNode } from "react";
import { ClipboardList, Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetContainer } from "../widget-container";
import { type WidgetProps } from "../widget-registry";
import { useWorkOrderStatus } from "@/lib/hooks/use-dashboard";
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
 * 작업 현황 KPI 위젯 (widget6)
 *
 * 전체/대기/진행중/완료 작업 수를 KPI 카드로 표시합니다.
 */
export function WorkOrderStatusWidget({ instanceId, config, onRefresh }: WidgetProps): ReactNode {
  const buildingId = config?.buildingId as number | undefined;
  const dashboardType = config?.dashboardType as SearchWidgetVO["dashboardType"];

  const params: SearchWidgetVO = {
    buildingId,
    dashboardType,
  };

  const { data, isLoading, error, refetch } = useWorkOrderStatus(params);

  const handleRefresh = () => {
    void refetch();
    onRefresh?.();
  };

  return (
    <WidgetContainer
      id={instanceId}
      title="작업 현황"
      subtitle="전체 작업 KPI"
      icon={ClipboardList}
      size="4x2"
      loading={isLoading}
      error={error}
      onRefresh={handleRefresh}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 h-full py-1">
        <KpiCard
          label="전체"
          value={data?.totalCount}
          icon={<ClipboardList className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
          colorClass="bg-blue-100 dark:bg-blue-900/30"
          loading={isLoading}
        />
        <KpiCard
          label="대기"
          value={data?.pendingCount}
          icon={<Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
          colorClass="bg-yellow-100 dark:bg-yellow-900/30"
          loading={isLoading}
        />
        <KpiCard
          label="진행 중"
          value={data?.inProgressCount}
          icon={<Loader2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
          colorClass="bg-indigo-100 dark:bg-indigo-900/30"
          loading={isLoading}
        />
        <KpiCard
          label="완료"
          value={data?.completedCount}
          icon={<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />}
          colorClass="bg-green-100 dark:bg-green-900/30"
          loading={isLoading}
        />
      </div>
      {/* 지연 작업이 있을 경우 경고 표시 */}
      {!isLoading && (data?.overdueCount ?? 0) > 0 && (
        <div className="mt-2 flex items-center gap-1.5 rounded-md bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>지연된 작업 {data?.overdueCount}건이 있습니다.</span>
        </div>
      )}
    </WidgetContainer>
  );
}
