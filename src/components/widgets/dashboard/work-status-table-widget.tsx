"use client";

import { type ReactNode } from "react";
import { ListChecks } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { WidgetContainer } from "../widget-container";
import { type WidgetProps } from "../widget-registry";
import { useWorkStatusDetail } from "@/lib/hooks/use-dashboard";
import type { SearchWidgetVO } from "@/lib/types/dashboard";

// ============================================================================
// Helpers
// ============================================================================

/** 상태값에 따른 배지 변형 반환 */
function getStateBadgeVariant(
  state: string | undefined
): "default" | "secondary" | "destructive" | "outline" {
  if (!state) return "outline";
  const s = state.toUpperCase();
  if (s === "DONE" || s === "COMPLETE" || s === "완료") return "default";
  if (s === "IN_PROGRESS" || s === "진행중") return "secondary";
  if (s === "OVERDUE" || s === "지연") return "destructive";
  return "outline";
}

// ============================================================================
// Component
// ============================================================================

/**
 * 업무 현황 상세 테이블 위젯 (widget37)
 *
 * 특정 상태의 업무 목록을 테이블 형태로 표시합니다.
 */
export function WorkStatusTableWidget({ instanceId, config, onRefresh }: WidgetProps): ReactNode {
  const buildingId = config?.buildingId as number | undefined;
  const dashboardType = config?.dashboardType as SearchWidgetVO["dashboardType"];
  /** 조회할 업무 상태 (기본: 전체) */
  const state = (config?.state as string | undefined) ?? "";

  const params: SearchWidgetVO = {
    buildingId,
    dashboardType,
  };

  const { data, isLoading, error, refetch } = useWorkStatusDetail(state, params);

  const handleRefresh = () => {
    void refetch();
    onRefresh?.();
  };

  const items = data ?? [];

  return (
    <WidgetContainer
      id={instanceId}
      title="업무 현황"
      subtitle="상세 목록"
      icon={ListChecks}
      size="4x2"
      loading={isLoading}
      error={error}
      onRefresh={handleRefresh}
    >
      {isLoading ? (
        <div className="space-y-2 py-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16 shrink-0" />
              <Skeleton className="h-4 w-16 shrink-0" />
              <Skeleton className="h-4 w-20 shrink-0" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">업무 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="pb-1.5 text-left font-medium">제목</th>
                <th className="pb-1.5 text-left font-medium">담당자</th>
                <th className="pb-1.5 text-left font-medium">상태</th>
                <th className="pb-1.5 text-left font-medium">마감일</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item, index) => (
                <tr key={item.id ?? index} className="text-xs">
                  <td className="py-1.5 pr-2">
                    <span className="line-clamp-1 max-w-[160px]">{item.title ?? "-"}</span>
                  </td>
                  <td className="py-1.5 pr-2 text-muted-foreground">
                    {item.assigneeName ?? "-"}
                  </td>
                  <td className="py-1.5 pr-2">
                    <Badge
                      variant={getStateBadgeVariant(item.state)}
                      className="px-1.5 py-0 text-[10px]"
                    >
                      {item.state ?? "-"}
                    </Badge>
                  </td>
                  <td className="py-1.5 text-muted-foreground">
                    {item.dueDate ? formatDate(item.dueDate) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </WidgetContainer>
  );
}

// ============================================================================
// Helpers
// ============================================================================

/** 날짜 문자열을 YYYY-MM-DD 형식으로 변환 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toISOString().slice(0, 10);
}
