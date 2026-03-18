/**
 * 분석(Analysis) API 클라이언트
 *
 * csp-was AnalysisController 연동
 */

import { apiClient } from "./client";
import type {
  UsageStatusDTO,
  StatisticsADTO,
  StatisticsBDTO,
  StatisticsCItemDTO,
  TrendFMSListItemDTO,
  TrendControlPointDTO,
  TrendDataDTO,
  SearchTrendVO,
  AnalysisYearMonthVO,
  FmsItemHistoryDTO,
  FmsLaborDTO,
  FmsTeamDTO,
  RmsDTO,
} from "@/lib/types/analysis";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ============================================================================
// 사용 현황
// ============================================================================

/**
 * 사용 현황 조회
 */
export async function getUsageStatus(params: {
  searchYear: number;
  searchMonth: number;
  chargeDepartment?: string;
  excludeFromAnalysis?: boolean;
}): Promise<UsageStatusDTO> {
  const query = new URLSearchParams();
  query.set("searchYear", String(params.searchYear));
  query.set("searchMonth", String(params.searchMonth));
  if (params.chargeDepartment)
    query.set("chargeDepartment", params.chargeDepartment);
  if (params.excludeFromAnalysis !== undefined)
    query.set("excludeFromAnalysis", String(params.excludeFromAnalysis));

  return apiClient.get<UsageStatusDTO>(`/api/analysis/workOrderUsage?${query}`);
}

// ============================================================================
// 통계 분석
// ============================================================================

/**
 * 통계 A 조회 (기능별 순위)
 */
export async function getStatisticsA(params: {
  searchDateFr: string;
  searchDateTo: string;
}): Promise<StatisticsADTO> {
  const query = new URLSearchParams({
    searchDateFr: params.searchDateFr,
    searchDateTo: params.searchDateTo,
  });
  return apiClient.get<StatisticsADTO>(`/api/analysis/serviceUsage?${query}`);
}

/**
 * 통계 B 조회 (직무별 분포)
 */
export async function getStatisticsB(params: {
  searchDateFr: string;
  searchDateTo: string;
}): Promise<StatisticsBDTO> {
  const query = new URLSearchParams({
    searchDateFr: params.searchDateFr,
    searchDateTo: params.searchDateTo,
  });
  return apiClient.get<StatisticsBDTO>(
    `/api/analysis/serviceUsageByJobType?${query}`
  );
}

/**
 * 통계 C 조회 (부서별 상세)
 */
export async function getStatisticsC(params: {
  searchDateFr: string;
  searchDateTo: string;
  isRMS?: boolean;
  chargeDepartment?: string;
}): Promise<StatisticsCItemDTO[]> {
  const query = new URLSearchParams({
    searchDateFr: params.searchDateFr,
    searchDateTo: params.searchDateTo,
  });
  if (params.isRMS !== undefined) query.set("isRMS", String(params.isRMS));
  if (params.chargeDepartment)
    query.set("chargeDepartment", params.chargeDepartment);

  return apiClient.get<StatisticsCItemDTO[]>(
    `/api/analysis/serviceUsageC?${query}`
  );
}

// ============================================================================
// FMS 트렌드
// ============================================================================

/**
 * FMS 트렌드 목록 조회
 */
export async function getFmsTrendList(
  params: SearchTrendVO & { page: number; size: number }
): Promise<PageResponse<TrendFMSListItemDTO>> {
  const query = new URLSearchParams();
  if (params.firstFacilityCategoryId)
    query.set("firstFacilityCategoryId", String(params.firstFacilityCategoryId));
  if (params.secondFacilityCategoryId)
    query.set(
      "secondFacilityCategoryId",
      String(params.secondFacilityCategoryId)
    );
  if (params.thirdFacilityCategoryId)
    query.set("thirdFacilityCategoryId", String(params.thirdFacilityCategoryId));
  if (params.searchCode) query.set("searchCode", params.searchCode);
  if (params.searchKeyword) query.set("searchKeyword", params.searchKeyword);
  query.set("page", String(params.page));
  query.set("size", String(params.size));

  return apiClient.get<PageResponse<TrendFMSListItemDTO>>(
    `/api/analysis/fmsTrendList?${query}`
  );
}

/**
 * FMS 트렌드 상세 조회
 */
export async function getFmsTrendDetail(
  controlPointId: number
): Promise<TrendControlPointDTO> {
  return apiClient.get<TrendControlPointDTO>(
    `/api/analysis/trendControlPoint/${controlPointId}`
  );
}

/**
 * FMS 트렌드 데이터 조회
 */
export async function getFmsTrendData(params: {
  controlPointId: number;
  startDate: string;
  endDate: string;
  compareControlPointId?: number;
}): Promise<TrendDataDTO[]> {
  const query = new URLSearchParams({
    controlPointId: String(params.controlPointId),
    startDate: params.startDate,
    endDate: params.endDate,
  });
  if (params.compareControlPointId)
    query.set(
      "compareControlPointId",
      String(params.compareControlPointId)
    );

  return apiClient.get<TrendDataDTO[]>(`/api/analysis/trendFMS?${query}`);
}

// ============================================================================
// 자재 분석
// ============================================================================

/**
 * 자재 입출고 분석 조회
 */
export async function getFmsItemHistory(
  params: AnalysisYearMonthVO
): Promise<FmsItemHistoryDTO> {
  const query = new URLSearchParams({
    searchYear: String(params.searchYear),
    searchMonth: String(params.searchMonth),
  });
  if (params.buildingId) query.set("buildingId", String(params.buildingId));

  return apiClient.get<FmsItemHistoryDTO>(
    `/api/analysis/fmsItemHistory?${query}`
  );
}

// ============================================================================
// 인력 분석
// ============================================================================

/**
 * 투입 인력 분석 조회
 */
export async function getFmsLabor(
  params: AnalysisYearMonthVO
): Promise<FmsLaborDTO> {
  const query = new URLSearchParams({
    searchYear: String(params.searchYear),
    searchMonth: String(params.searchMonth),
  });
  if (params.buildingId) query.set("buildingId", String(params.buildingId));

  return apiClient.get<FmsLaborDTO>(`/api/analysis/fmsLabor?${query}`);
}

// ============================================================================
// 팀 작업 분석
// ============================================================================

/**
 * 작업 현황 분석 조회
 */
export async function getFmsTeam(
  params: AnalysisYearMonthVO
): Promise<FmsTeamDTO> {
  const query = new URLSearchParams({
    searchYear: String(params.searchYear),
    searchMonth: String(params.searchMonth),
  });
  if (params.buildingId) query.set("buildingId", String(params.buildingId));

  return apiClient.get<FmsTeamDTO>(`/api/analysis/fmsTeam?${query}`);
}

// ============================================================================
// RMS 분석
// ============================================================================

/**
 * RMS 분석 조회
 */
export async function getRms(
  params: AnalysisYearMonthVO
): Promise<RmsDTO> {
  const query = new URLSearchParams({
    searchYear: String(params.searchYear),
    searchMonth: String(params.searchMonth),
  });
  if (params.buildingId) query.set("buildingId", String(params.buildingId));

  return apiClient.get<RmsDTO>(`/api/analysis/rms?${query}`);
}
