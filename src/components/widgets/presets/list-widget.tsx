"use client";

import { type ReactNode } from "react";
import { List, Bell, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { WidgetContainer } from "../widget-container";
import {
  type WidgetProps,
  type WidgetMeta,
  defineWidget,
} from "../widget-registry";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface ListWidgetConfig {
  /** 위젯 제목 */
  title?: string;
  /** 부제목 */
  subtitle?: string;
  /** 목록 항목 */
  items?: ListItem[];
  /** 최대 표시 항목 수 */
  maxItems?: number;
  /** 목록 타입 */
  listType?: "notification" | "alert" | "activity";
}

export interface ListItem {
  /** 항목 ID */
  id: string;
  /** 항목 제목 */
  title: string;
  /** 항목 설명 */
  description?: string;
  /** 타임스탬프 */
  timestamp?: string;
  /** 상태/타입 */
  type?: "info" | "warning" | "error" | "success";
  /** 읽음 여부 */
  read?: boolean;
}

// ============================================================================
// Sample Data
// ============================================================================

const SAMPLE_NOTIFICATIONS: ListItem[] = [
  {
    id: "1",
    title: "긴급 점검 알림",
    description: "B동 3층 HVAC 시스템 점검이 필요합니다",
    timestamp: "10분 전",
    type: "warning",
    read: false,
  },
  {
    id: "2",
    title: "작업 완료",
    description: "A동 엘리베이터 정기점검이 완료되었습니다",
    timestamp: "1시간 전",
    type: "success",
    read: false,
  },
  {
    id: "3",
    title: "센서 이상 감지",
    description: "C동 1층 온도 센서 데이터 이상",
    timestamp: "2시간 전",
    type: "error",
    read: true,
  },
  {
    id: "4",
    title: "시스템 업데이트",
    description: "BEMS 소프트웨어 업데이트가 예정되어 있습니다",
    timestamp: "어제",
    type: "info",
    read: true,
  },
];

// ============================================================================
// Component
// ============================================================================

const typeIcons = {
  info: Bell,
  warning: AlertTriangle,
  error: AlertTriangle,
  success: CheckCircle2,
};

const typeColors = {
  info: "text-blue-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  success: "text-green-500",
};

/**
 * 목록 위젯 컴포넌트
 *
 * 대시보드에서 알림, 활동 로그 등을 목록 형태로 표시합니다.
 */
export function ListWidget({
  instanceId,
  config,
  onRefresh,
}: WidgetProps): ReactNode {
  const widgetConfig = config as ListWidgetConfig | undefined;
  const title = widgetConfig?.title ?? "알림";
  const subtitle = widgetConfig?.subtitle;
  const items = widgetConfig?.items ?? SAMPLE_NOTIFICATIONS;
  const maxItems = widgetConfig?.maxItems ?? 5;

  const displayItems = items.slice(0, maxItems);
  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <WidgetContainer
      id={instanceId}
      title={title}
      subtitle={subtitle ?? (unreadCount > 0 ? `${unreadCount}개 읽지 않음` : undefined)}
      icon={Bell}
      size="3x2"
      onRefresh={onRefresh}
      footer={
        items.length > maxItems ? (
          <span className="text-xs cursor-pointer hover:underline">
            전체 보기 ({items.length})
          </span>
        ) : undefined
      }
    >
      <div className="h-full overflow-auto space-y-2">
        {displayItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">알림이 없습니다</p>
          </div>
        ) : (
          displayItems.map((item) => {
            const Icon = typeIcons[item.type ?? "info"];
            const colorClass = typeColors[item.type ?? "info"];

            return (
              <div
                key={item.id}
                className={cn(
                  "flex gap-3 p-2 rounded-lg transition-colors",
                  "hover:bg-muted/50 cursor-pointer",
                  !item.read && "bg-primary/5"
                )}
              >
                <div
                  className={cn(
                    "shrink-0 mt-0.5 rounded-full p-1",
                    colorClass
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        !item.read && "font-semibold"
                      )}
                    >
                      {item.title}
                    </p>
                    {item.timestamp && (
                      <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {item.timestamp}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </WidgetContainer>
  );
}

// ============================================================================
// Widget Definition
// ============================================================================

export const listWidgetMeta: WidgetMeta = {
  id: "list-widget",
  name: "목록 위젯",
  description: "알림, 활동 로그 등을 목록으로 표시합니다",
  category: "list",
  icon: List,
  defaultSize: "3x2",
  supportedSizes: ["2x2", "3x2", "4x2", "6x2"],
  configurable: true,
};

export const listWidgetDefinition = defineWidget(listWidgetMeta, ListWidget);
