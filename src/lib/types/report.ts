/**
 * 보고서(Report) 관련 타입 정의
 *
 * csp-was ReportController, ReportDTO 기반
 */

import type { PageResponse } from "./facility";

// ============================================================================
// Enums
// ============================================================================

/**
 * 보고서 상태
 */
export const ReportState = {
  DRAFT: "DRAFT",
  REPORT: "REPORT",
  APPROVE: "APPROVE",
} as const;

export type ReportState = (typeof ReportState)[keyof typeof ReportState];

export const ReportStateLabel: Record<ReportState, string> = {
  DRAFT: "임시저장",
  REPORT: "보고",
  APPROVE: "승인",
};

export const ReportStateStyle: Record<ReportState, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  REPORT: "bg-blue-100 text-blue-700",
  APPROVE: "bg-green-100 text-green-700",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 월간보고서 DTO
 */
export interface MonthlyReportDTO {
  id: number;
  companyId: number;
  companyName: string;
  baseAreaId: number;
  baseAreaName: string;
  buildingId: number;
  buildingName: string;
  workYear: string;
  workMonth: string;
  state: ReportState;
  writerName: string;
  writeDate: string;
  reportDate: string;
  monthlyReceptAccounts: string;
  firstViewDate: string;
  receptIds: number[];
}

/**
 * 주간보고서 DTO
 */
export interface WeeklyReportDTO {
  id: number;
  companyId: number;
  companyName: string;
  buildingId: number;
  buildingName: string;
  workDateFrom: string;
  workDateTo: string;
  state: ReportState;
  writerName: string;
  writeDate: string;
  reportDate: string;
  weeklyReceptAccounts: string;
  firstViewDate: string;
  receptIds: number[];
}

/**
 * 업무일지(일간보고서) DTO
 */
export interface DailyReportDTO {
  id: number;
  companyId: number;
  companyName: string;
  buildingId: number;
  buildingName: string;
  workDate: string;
  workDateFrom: string;
  workDateTo: string;
  state: ReportState;
  writerName: string;
  writeDate: string;
  reportDate: string;
  dailyReceptAccounts: string;
  firstViewDate: string;
  receptIds: number[];
}

// ============================================================================
// Search VO
// ============================================================================

/**
 * 보고서 검색 조건
 */
export interface SearchReportVO {
  companyId?: number;
  baseAreaId?: number;
  buildingId?: number;
  writerId?: number;
  dateFrom?: string;
  dateTo?: string;
  workYear?: string;
  workMonth?: string;
  state?: ReportState;
  page?: number;
  size?: number;
}

// ============================================================================
// Request VO
// ============================================================================

/**
 * 보고서 등록/수정 VO
 */
export interface ReportVO {
  info: {
    reportId?: number;
    companyId: number;
    baseAreaId?: number;
    buildingId: number;
    workYear?: string;
    workMonth?: string;
    workDate?: string;
    workDateFrom?: string;
    workDateTo?: string;
    state: ReportState;
    receptIds: number[];
    sendPush: boolean;
  };
  building?: string;
  person?: string;
  organization?: string;
  invoice?: string;
  attendance?: string;
  workOrder?: string;
  material?: string;
  patrol?: string;
  energy?: string;
  plan?: string;
  etc?: string;
}

// ============================================================================
// API Response
// ============================================================================

export type MonthlyReportListResponse = PageResponse<MonthlyReportDTO>;
export type WeeklyReportListResponse = PageResponse<WeeklyReportDTO>;
export type DailyReportListResponse = PageResponse<DailyReportDTO>;
