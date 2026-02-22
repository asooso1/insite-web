/**
 * 대시보드(Dashboard) API 클라이언트
 *
 * csp-was DashBoardController, WidgetController 연동
 */

import { apiClient } from './client';
import type {
  WidgetVO,
  SearchWidgetVO,
  WorkOrderStatusWidget,
  NoticeWidgetItem,
  WorkStatusDetailItem,
  ScheduleItem,
} from '../types/dashboard';

// ============================================================================
// 대시보드 API
// ============================================================================

/**
 * SearchWidgetVO를 URLSearchParams 문자열로 변환
 */
function toSearchParams(params: SearchWidgetVO): string {
  const sp = new URLSearchParams();
  if (params.dashboardType) sp.set('dashboardType', params.dashboardType);
  if (params.buildingId) sp.set('buildingId', String(params.buildingId));
  if (params.wideAreaId) sp.set('wideAreaId', String(params.wideAreaId));
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

/**
 * WidgetVO를 URLSearchParams 문자열로 변환
 */
function toWidgetParams(params: WidgetVO): string {
  const sp = new URLSearchParams();
  if (params.accountType) sp.set('accountType', params.accountType);
  if (params.dashboardType) sp.set('dashboardType', params.dashboardType);
  if (params.groupType) sp.set('groupType', params.groupType);
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export const dashboardApi = {
  /**
   * 위젯 목록 조회
   * GET /api/dashBoard/widgetList
   */
  widgetList: (params: WidgetVO) =>
    apiClient.get<unknown[]>(`/api/dashBoard/widgetList${toWidgetParams(params)}`),

  /**
   * 작업 현황 KPI 조회 (widget6)
   * GET /widget/widget6
   */
  workOrderStatus: (params: SearchWidgetVO) =>
    apiClient.get<WorkOrderStatusWidget>(`/widget/widget6${toSearchParams(params)}`),

  /**
   * 공지사항 목록 조회 (widget8)
   * GET /widget/widget8/{noticeType}
   */
  noticeList: (noticeType: string, params: SearchWidgetVO) =>
    apiClient.get<NoticeWidgetItem[]>(`/widget/widget8/${noticeType}${toSearchParams(params)}`),

  /**
   * 업무 현황 상세 조회 (widget37)
   * GET /widget/widget37/{state}
   */
  workStatusDetail: (state: string, params: SearchWidgetVO) =>
    apiClient.get<WorkStatusDetailItem[]>(`/widget/widget37/${state}${toSearchParams(params)}`),

  /**
   * 작업 일정표 월간 조회 (widget42)
   * GET /widget/widget42
   */
  monthlySchedule: (params: SearchWidgetVO) =>
    apiClient.get<ScheduleItem[]>(`/widget/widget42${toSearchParams(params)}`),

  /**
   * 작업 일정표 주간 조회 (widget43)
   * GET /widget/widget43
   */
  weeklySchedule: (params: SearchWidgetVO) =>
    apiClient.get<ScheduleItem[]>(`/widget/widget43${toSearchParams(params)}`),
};
