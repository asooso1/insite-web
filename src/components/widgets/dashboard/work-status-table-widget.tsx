"use client";

import { type ReactNode } from "react";
import { ListChecks } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetContainer } from "../widget-container";
import { type WidgetProps } from "../widget-registry";
import { useWorkStatusDetail } from "@/lib/hooks/use-dashboard";
import type { SearchWidgetVO, WorkStatusDetailItem } from "@/lib/types/dashboard";

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

  const items: WorkStatusDetailItem[] = data?.workOrderDTOs ?? [];

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
                <th className="pb-1.5 text-left font-medium">업무명</th>
                <th className="pb-1.5 text-left font-medium">대분류</th>
                <th className="pb-1.5 text-left font-medium">담당 그룹</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item, index) => (
                <tr key={item.id ?? index} className="text-xs">
                  <td className="py-1.5 pr-2">
                    <span className="line-clamp-1 max-w-[160px]">{item.name ?? "-"}</span>
                  </td>
                  <td className="py-1.5 pr-2 text-muted-foreground">
                    {item.firstClassName ?? "-"}
                  </td>
                  <td className="py-1.5 text-muted-foreground">
                    {item.buildingUserGroupName ?? "-"}
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

