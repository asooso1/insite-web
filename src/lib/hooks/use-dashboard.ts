/**
 * 대시보드(Dashboard) React Query 훅
 *
 * csp-was DashBoardController, WidgetController 연동
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';
import type { WidgetVO, SearchWidgetVO, Widget37DTO, FacilityStatusWidget } from '@/lib/types/dashboard';
import { FacilityState } from '@/lib/types/facility';
import type { FacilityListDTO, PageResponse } from '@/lib/types/facility';

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
  facilityStatus: (params: SearchWidgetVO) =>
    [...dashboardKeys.widgets(), 'facilityStatus', params] as const,
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
    staleTime: 30 * 1000,
  });
}

/**
 * 작업 현황 KPI 조회 훅 (widget6)
 */
export function useWorkOrderStatus(params: SearchWidgetVO) {
  return useQuery({
    queryKey: dashboardKeys.workOrderStatus(params),
    queryFn: () => dashboardApi.workOrderStatus(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 공지사항 목록 조회 훅 (widget8)
 */
export function useNoticeList(noticeType: string, params: SearchWidgetVO) {
  return useQuery({
    queryKey: dashboardKeys.noticeList(noticeType, params),
    queryFn: () => dashboardApi.noticeList(noticeType, params),
    staleTime: 30 * 1000,
  });
}

/**
 * 업무 현황 상세 조회 훅 (widget37)
 */
export function useWorkStatusDetail(state: string, params: SearchWidgetVO) {
  return useQuery({
    queryKey: dashboardKeys.workStatusDetail(state, params),
    queryFn: () => dashboardApi.workStatusDetail(state, params),
    staleTime: 30 * 1000,
  });
}

/**
 * 작업 일정표 월간 조회 훅 (widget42)
 */
export function useMonthlySchedule(params: SearchWidgetVO) {
  return useQuery({
    queryKey: dashboardKeys.monthlySchedule(params),
    queryFn: () => dashboardApi.monthlySchedule(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 작업 일정표 주간 조회 훅 (widget43)
 */
export function useWeeklySchedule(params: SearchWidgetVO) {
  return useQuery({
    queryKey: dashboardKeys.weeklySchedule(params),
    queryFn: () => dashboardApi.weeklySchedule(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 시설 현황 KPI 조회 훅 (클라이언트사이드 집계)
 *
 * 시설 목록을 조회한 후 클라이언트에서 상태별로 집계합니다.
 * - 전체: 전체 시설 수
 * - 운영중: ONGOING_OPERATING 상태
 * - 점검중: NOW_CHECK 상태
 * - 공사중: ONGOING_CONSTRUCT 상태
 */
export function useFacilityStatus(params: SearchWidgetVO) {
  return useQuery({
    queryKey: dashboardKeys.facilityStatus(params),
    queryFn: async () => {
      const response = await dashboardApi.facilityStatus(params);

      // 시설 목록에서 상태별 집계
      const facilities = (response as PageResponse<FacilityListDTO>)?.content ?? [];
      const operatingCount = facilities.filter(
        (f) => f.facilityDTO?.state === FacilityState.ONGOING_OPERATING,
      ).length;
      const checkingCount = facilities.filter(
        (f) => f.facilityDTO?.state === FacilityState.NOW_CHECK,
      ).length;
      const constructingCount = facilities.filter(
        (f) => f.facilityDTO?.state === FacilityState.ONGOING_CONSTRUCT,
      ).length;

      const result: FacilityStatusWidget = {
        totalCount: (response as PageResponse<FacilityListDTO>)?.totalElements ?? 0,
        operatingCount,
        checkingCount,
        constructingCount,
      };

      return result;
    },
    staleTime: 30 * 1000,
  });
}
