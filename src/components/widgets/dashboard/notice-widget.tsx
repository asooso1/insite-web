"use client";

import { type ReactNode } from "react";
import { Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { WidgetContainer } from "../widget-container";
import { type WidgetProps } from "../widget-registry";
import { useNoticeList } from "@/lib/hooks/use-dashboard";
import type { SearchWidgetVO } from "@/lib/types/dashboard";

// ============================================================================
// Component
// ============================================================================

/**
 * 공지사항 목록 위젯 (widget8)
 *
 * 최신 공지사항 목록을 표시합니다.
 */
export function NoticeWidget({ instanceId, config, onRefresh }: WidgetProps): ReactNode {
  const buildingId = config?.buildingId as number | undefined;
  const dashboardType = config?.dashboardType as SearchWidgetVO["dashboardType"];
  /** 공지사항 타입 (기본: NOTICE) */
  const noticeType = (config?.noticeType as string | undefined) ?? "NOTICE";

  const params: SearchWidgetVO = {
    buildingId,
    dashboardType,
  };

  const { data, isLoading, error, refetch } = useNoticeList(noticeType, params);

  const handleRefresh = () => {
    void refetch();
    onRefresh?.();
  };

  const items = data ?? [];

  return (
    <WidgetContainer
      id={instanceId}
      title="공지사항"
      subtitle="최신 공지"
      icon={Bell}
      size="3x2"
      loading={isLoading}
      error={error}
      onRefresh={handleRefresh}
    >
      {isLoading ? (
        <div className="space-y-2 py-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 shrink-0" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-3 w-20 shrink-0" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">등록된 공지사항이 없습니다.</p>
        </div>
      ) : (
        <ul className="divide-y">
          {items.map((item, index) => (
            <li
              key={item.id ?? index}
              className="flex items-center gap-2 py-2 text-sm"
            >
              {item.isNew && (
                <Badge variant="destructive" className="shrink-0 px-1.5 py-0 text-[10px]">
                  NEW
                </Badge>
              )}
              <span className="flex-1 truncate text-foreground">{item.title ?? "-"}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {item.createdAt ? formatDate(item.createdAt) : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </WidgetContainer>
  );
}

// ============================================================================
// Helpers
// ============================================================================

/** 날짜 문자열을 MM-DD 형식으로 변환 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}
