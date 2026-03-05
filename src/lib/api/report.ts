/**
 * 보고서(Report) API 클라이언트
 *
 * csp-was ReportController 연동
 */

import { apiClient } from "./client";
import type {
  MonthlyReportDTO,
  WeeklyReportDTO,
  DailyReportDTO,
  SearchReportVO,
  ReportVO,
  MonthlyReportListResponse,
  WeeklyReportListResponse,
  DailyReportListResponse,
} from "@/lib/types/report";

// ============================================================================
// 공통 검색 파라미터 빌더
// ============================================================================

function buildSearchParams(params: SearchReportVO): string {
  const searchParams = new URLSearchParams();
  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.baseAreaId) searchParams.set("baseAreaId", String(params.baseAreaId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.writerId) searchParams.set("writerId", String(params.writerId));
  if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
  if (params.dateTo) searchParams.set("dateTo", params.dateTo);
  if (params.workYear) searchParams.set("workYear", params.workYear);
  if (params.workMonth) searchParams.set("workMonth", params.workMonth);
  if (params.state) searchParams.set("state", params.state);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  return searchParams.toString();
}

// ============================================================================
// 월간보고서
// ============================================================================

/**
 * 월간보고서 목록 조회
 */
export async function getMonthlyReportList(
  params: SearchReportVO
): Promise<MonthlyReportListResponse> {
  const qs = buildSearchParams(params);
  return apiClient.get<MonthlyReportListResponse>(
    `/api/report/reportMonthList${qs ? "?" + qs : ""}`
  );
}

/**
 * 월간보고서 상세 조회
 */
export async function getMonthlyReport(id: number): Promise<MonthlyReportDTO> {
  return apiClient.get<MonthlyReportDTO>(`/api/report/reportMonthInfo/${id}/view`);
}

/**
 * 월간보고서 등록
 */
export async function addMonthlyReport(data: ReportVO): Promise<void> {
  return apiClient.post<void>("/api/report/reportMonth", data);
}

/**
 * 월간보고서 수정
 */
export async function editMonthlyReport(data: ReportVO): Promise<void> {
  return apiClient.put<void>("/api/report/reportMonth", data);
}

/**
 * 월간보고서 삭제
 */
export async function deleteMonthlyReport(reportId: number): Promise<void> {
  return apiClient.delete<void>(`/api/report/reportMonth/${reportId}`);
}

// ============================================================================
// 주간보고서
// ============================================================================

/**
 * 주간보고서 목록 조회
 */
export async function getWeeklyReportList(
  params: SearchReportVO
): Promise<WeeklyReportListResponse> {
  const qs = buildSearchParams(params);
  return apiClient.get<WeeklyReportListResponse>(
    `/api/report/reportWeekList${qs ? "?" + qs : ""}`
  );
}

/**
 * 주간보고서 상세 조회
 */
export async function getWeeklyReport(id: number): Promise<WeeklyReportDTO> {
  return apiClient.get<WeeklyReportDTO>(`/api/report/reportWeekInfo/${id}/view`);
}

/**
 * 주간보고서 등록
 */
export async function addWeeklyReport(data: ReportVO): Promise<void> {
  return apiClient.post<void>("/api/report/reportWeek", data);
}

/**
 * 주간보고서 수정
 */
export async function editWeeklyReport(data: ReportVO): Promise<void> {
  return apiClient.put<void>("/api/report/reportWeek", data);
}

/**
 * 주간보고서 삭제
 */
export async function deleteWeeklyReport(reportId: number): Promise<void> {
  return apiClient.delete<void>(`/api/report/reportWeek/${reportId}`);
}

// ============================================================================
// 업무일지
// ============================================================================

/**
 * 업무일지 목록 조회
 */
export async function getWorkLogList(
  params: SearchReportVO
): Promise<DailyReportListResponse> {
  const qs = buildSearchParams(params);
  return apiClient.get<DailyReportListResponse>(
    `/api/report/workLogList${qs ? "?" + qs : ""}`
  );
}

/**
 * 업무일지 상세 조회
 */
export async function getWorkLog(id: number): Promise<DailyReportDTO> {
  return apiClient.get<DailyReportDTO>(`/api/report/reportWorkLogInfo/${id}/view`);
}

/**
 * 업무일지 등록
 */
export async function addWorkLog(data: ReportVO): Promise<void> {
  return apiClient.post<void>("/api/report/workLog", data);
}

/**
 * 업무일지 수정
 */
export async function editWorkLog(data: ReportVO): Promise<void> {
  return apiClient.put<void>("/api/report/workLog", data);
}

/**
 * 업무일지 삭제
 */
export async function deleteWorkLog(reportId: number): Promise<void> {
  return apiClient.delete<void>(`/api/report/workLog/${reportId}`);
}
