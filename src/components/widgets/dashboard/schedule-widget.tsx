"use client";

import { type ReactNode, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WidgetContainer } from "../widget-container";
import { type WidgetProps } from "../widget-registry";
import { useMonthlySchedule, useWeeklySchedule } from "@/lib/hooks/use-dashboard";
import type { SearchWidgetVO, ScheduleItem } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type ScheduleTab = "weekly" | "monthly";

// ============================================================================
// Sub-components
// ============================================================================

interface ScheduleListProps {
  items: ScheduleItem[];
  loading: boolean;
}

/** 일정 목록 */
function ScheduleList({ items, loading }: ScheduleListProps): ReactNode {
  if (loading) {
    return (
      <div className="space-y-2 py-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-3 w-16 shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-14 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center py-6">
        <p className="text-sm text-muted-foreground">일정이 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {items.map((item, index) => (
        <li key={item.id ?? index} className="flex items-start gap-2 py-2 text-xs">
          {/* 날짜 */}
          <span className="w-16 shrink-0 text-muted-foreground">
            {item.startDate ? formatShortDate(item.startDate) : "-"}
          </span>
          {/* 제목 */}
          <span className="flex-1 truncate font-medium">{item.title ?? "-"}</span>
          {/* 담당자 */}
          {item.assigneeName && (
            <span className="shrink-0 text-muted-foreground">{item.assigneeName}</span>
          )}
          {/* 상태 배지 */}
          {item.state && (
            <Badge variant="outline" className="shrink-0 px-1.5 py-0 text-[10px]">
              {item.state}
            </Badge>
          )}
        </li>
      ))}
    </ul>
  );
}

// ============================================================================
// Component
// ============================================================================

/**
 * 작업 일정표 위젯 (widget42/43)
 *
 * 주간/월간 탭으로 작업 일정을 목록 형태로 표시합니다.
 */
export function ScheduleWidget({ instanceId, config, onRefresh }: WidgetProps): ReactNode {
  const [activeTab, setActiveTab] = useState<ScheduleTab>("weekly");

  const buildingId = config?.buildingId as number | undefined;
  const dashboardType = config?.dashboardType as SearchWidgetVO["dashboardType"];

  const params: SearchWidgetVO = {
    buildingId,
    dashboardType,
  };

  const weekly = useWeeklySchedule(params);
  const monthly = useMonthlySchedule(params);

  const isLoading = activeTab === "weekly" ? weekly.isLoading : monthly.isLoading;
  const error = activeTab === "weekly" ? weekly.error : monthly.error;
  const items = (activeTab === "weekly" ? weekly.data : monthly.data) ?? [];

  const handleRefresh = () => {
    if (activeTab === "weekly") {
      void weekly.refetch();
    } else {
      void monthly.refetch();
    }
    onRefresh?.();
  };

  return (
    <WidgetContainer
      id={instanceId}
      title="작업 일정표"
      subtitle={activeTab === "weekly" ? "주간" : "월간"}
      icon={CalendarDays}
      size="3x2"
      loading={isLoading}
      error={error}
      onRefresh={handleRefresh}
      headerActions={
        <div className="flex rounded-md border text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("weekly")}
            className={cn(
              "px-2 py-1 rounded-l-md transition-colors",
              activeTab === "weekly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            주간
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("monthly")}
            className={cn(
              "px-2 py-1 rounded-r-md transition-colors",
              activeTab === "monthly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            월간
          </button>
        </div>
      }
    >
      <ScheduleList items={items} loading={isLoading} />
    </WidgetContainer>
  );
}

// ============================================================================
// Helpers
// ============================================================================

/** 날짜 문자열을 MM/DD 형식으로 변환 */
function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}/${dd}`;
}
