"use client";

import { type ReactNode } from "react";
import { WorkOrderStatusWidget } from "@/components/widgets/dashboard/work-order-status-widget";
import { NoticeWidget } from "@/components/widgets/dashboard/notice-widget";
import { WorkStatusTableWidget } from "@/components/widgets/dashboard/work-status-table-widget";
import { ScheduleWidget } from "@/components/widgets/dashboard/schedule-widget";
import type { AuthUser } from "@/lib/stores/auth-store";

interface DashboardWidgetsProps {
  /** 현재 로그인 사용자 정보 */
  user: AuthUser;
}

/**
 * 대시보드 위젯 그리드
 *
 * 클라이언트 컴포넌트 - React Query 훅 사용
 */
export function DashboardWidgets({ user }: DashboardWidgetsProps): ReactNode {
  const buildingId = user.currentBuildingId
    ? Number(user.currentBuildingId)
    : undefined;

  /** 위젯 공통 config */
  const widgetConfig = {
    buildingId,
    dashboardType: "MAIN" as const,
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 작업 현황 KPI - 전체 너비 */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <WorkOrderStatusWidget
          instanceId="work-order-status"
          config={widgetConfig}
        />
      </div>

      {/* 공지사항 */}
      <NoticeWidget
        instanceId="notice"
        config={{ ...widgetConfig, noticeType: "NOTICE" }}
      />

      {/* 업무 현황 상세 */}
      <WorkStatusTableWidget
        instanceId="work-status-table"
        config={widgetConfig}
      />

      {/* 작업 일정표 */}
      <ScheduleWidget
        instanceId="schedule"
        config={widgetConfig}
      />
    </div>
  );
}
