/**
 * 분석(Analysis) React Query 훅
 */

import { useQuery } from "@tanstack/react-query";
import {
  getUsageStatus,
  getStatisticsA,
  getStatisticsB,
  getStatisticsC,
  getFmsTrendList,
  getFmsTrendDetail,
  getFmsTrendData,
  getFmsItemHistory,
  getFmsLabor,
  getFmsTeam,
} from "@/lib/api/analysis";
import type {
  AnalysisYearMonthVO,
  SearchTrendVO,
} from "@/lib/types/analysis";

// ============================================================================
// Query Keys
// ============================================================================

export const analysisKeys = {
  all: ["analysis"] as const,
  usage: (params: object) => [...analysisKeys.all, "usage", params] as const,
  statisticsA: (params: object) =>
    [...analysisKeys.all, "statsA", params] as const,
  statisticsB: (params: object) =>
    [...analysisKeys.all, "statsB", params] as const,
  statisticsC: (params: object) =>
    [...analysisKeys.all, "statsC", params] as const,
  fmsTrendList: (params: object) =>
    [...analysisKeys.all, "fmsTrendList", params] as const,
  fmsTrendDetail: (id: number) =>
    [...analysisKeys.all, "fmsTrendDetail", id] as const,
  fmsTrendData: (params: object) =>
    [...analysisKeys.all, "fmsTrendData", params] as const,
  fmsItemHistory: (params: object) =>
    [...analysisKeys.all, "fmsItemHistory", params] as const,
  fmsLabor: (params: object) => [...analysisKeys.all, "fmsLabor", params] as const,
  fmsTeam: (params: object) => [...analysisKeys.all, "fmsTeam", params] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 사용 현황 조회 훅
 */
export function useUsageStatus(params: {
  searchYear: number;
  searchMonth: number;
  chargeDepartment?: string;
  excludeFromAnalysis?: boolean;
}) {
  return useQuery({
    queryKey: analysisKeys.usage(params),
    queryFn: () => getUsageStatus(params),
  });
}

/**
 * 통계 A 조회 훅
 */
export function useStatisticsA(params: {
  searchDateFr: string;
  searchDateTo: string;
}) {
  return useQuery({
    queryKey: analysisKeys.statisticsA(params),
    queryFn: () => getStatisticsA(params),
  });
}

/**
 * 통계 B 조회 훅
 */
export function useStatisticsB(params: {
  searchDateFr: string;
  searchDateTo: string;
}) {
  return useQuery({
    queryKey: analysisKeys.statisticsB(params),
    queryFn: () => getStatisticsB(params),
  });
}

/**
 * 통계 C 조회 훅
 */
export function useStatisticsC(params: {
  searchDateFr: string;
  searchDateTo: string;
  isRMS?: boolean;
  chargeDepartment?: string;
}) {
  return useQuery({
    queryKey: analysisKeys.statisticsC(params),
    queryFn: () => getStatisticsC(params),
  });
}

/**
 * FMS 트렌드 목록 조회 훅
 */
export function useFmsTrendList(
  params: SearchTrendVO & { page: number; size: number }
) {
  return useQuery({
    queryKey: analysisKeys.fmsTrendList(params),
    queryFn: () => getFmsTrendList(params),
  });
}

/**
 * FMS 트렌드 상세 조회 훅
 */
export function useFmsTrendDetail(controlPointId: number) {
  return useQuery({
    queryKey: analysisKeys.fmsTrendDetail(controlPointId),
    queryFn: () => getFmsTrendDetail(controlPointId),
    enabled: controlPointId > 0,
  });
}

/**
 * FMS 트렌드 데이터 조회 훅
 */
export function useFmsTrendData(params: {
  controlPointId: number;
  startDate: string;
  endDate: string;
  compareControlPointId?: number;
}) {
  return useQuery({
    queryKey: analysisKeys.fmsTrendData(params),
    queryFn: () => getFmsTrendData(params),
    enabled: params.controlPointId > 0,
  });
}

/**
 * 자재 입출고 분석 조회 훅
 */
export function useFmsItemHistory(params: AnalysisYearMonthVO) {
  return useQuery({
    queryKey: analysisKeys.fmsItemHistory(params),
    queryFn: () => getFmsItemHistory(params),
  });
}

/**
 * 투입 인력 분석 조회 훅
 */
export function useFmsLabor(params: AnalysisYearMonthVO) {
  return useQuery({
    queryKey: analysisKeys.fmsLabor(params),
    queryFn: () => getFmsLabor(params),
  });
}

/**
 * 작업 현황 분석 조회 훅
 */
export function useFmsTeam(params: AnalysisYearMonthVO) {
  return useQuery({
    queryKey: analysisKeys.fmsTeam(params),
    queryFn: () => getFmsTeam(params),
  });
}
