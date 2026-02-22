/**
 * 대시보드(Dashboard) React Query 훅
 *
 * csp-was DashBoardController, WidgetController 연동
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';
import type { WidgetVO, SearchWidgetVO } from '@/lib/types/dashboard';

// ============================================================================
// Query Keys Factory
// ============================================================================

export const dashboardKeys = {
  all: ['dashboard'] as const,
  widgetLists: () => [...dashboardKeys.all, 'widgetList'] as const,
  widgetList: (params: WidgetVO) => [...dashboardKeys.widgetLists(), params] as const,
  widgets: () => [...dashboardKeys.all, 'widget'] as const,
  workOrderStatus: (params: SearchWidgetVO) =>
    [...dashboardKeys.widgets(), 'workOrderStatus', params] as const,
  noticeList: (noticeType: string, params: SearchWidgetVO) =>
    [...dashboardKeys.widgets(), 'notice', noticeType, params] as const,
  workStatusDetail: (state: string, params: SearchWidgetVO) =>
    [...dashboardKeys.widgets(), 'workStatus', state, params] as const,
  monthlySchedule: (params: SearchWidgetVO) =>
    [...dashboardKeys.widgets(), 'monthlySchedule', params] as const,
  weeklySchedule: (params: SearchWidgetVO) =>
    [...dashboardKeys.widgets(), 'weeklySchedule', params] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 위젯 목록 조회 훅
 */
export function useWidgetList(params: WidgetVO) {
  return useQuery({
    queryKey: dashboardKeys.widgetList(params),
    queryFn: () => dashboardApi.widgetList(params),
  });
}

/**
 * 작업 현황 KPI 조회 훅 (widget6)
 */
export function useWorkOrderStatus(params: SearchWidgetVO) {
  return useQuery({
    queryKey: dashboardKeys.workOrderStatus(params),
    queryFn: () => dashboardApi.workOrderStatus(params),
  });
}

/**
 * 공지사항 목록 조회 훅 (widget8)
 */
export function useNoticeList(noticeType: string, params: SearchWidgetVO) {
  return useQuery({
    queryKey: dashboardKeys.noticeList(noticeType, params),
    queryFn: () => dashboardApi.noticeList(noticeType, params),
  });
}

/**
 * 업무 현황 상세 조회 훅 (widget37)
 */
export function useWorkStatusDetail(state: string, params: SearchWidgetVO) {
  return useQuery({
    queryKey: dashboardKeys.workStatusDetail(state, params),
    queryFn: () => dashboardApi.workStatusDetail(state, params),
  });
}

/**
 * 작업 일정표 월간 조회 훅 (widget42)
 */
export function useMonthlySchedule(params: SearchWidgetVO) {
  return useQuery({
    queryKey: dashboardKeys.monthlySchedule(params),
    queryFn: () => dashboardApi.monthlySchedule(params),
  });
}

/**
 * 작업 일정표 주간 조회 훅 (widget43)
 */
export function useWeeklySchedule(params: SearchWidgetVO) {
  return useQuery({
    queryKey: dashboardKeys.weeklySchedule(params),
    queryFn: () => dashboardApi.weeklySchedule(params),
  });
}
