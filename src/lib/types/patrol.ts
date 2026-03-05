/**
 * 순찰(Patrol) 관련 타입 정의
 *
 * csp-was PatrolController, PatrolDTO 기반
 */

import type { PageResponse } from "./facility";

// ============================================================================
// Enums
// ============================================================================

/**
 * 순찰 계획 유형
 */
export const PatrolPlanType = {
  NONSCHEDULED: "NONSCHEDULED",
  SCHEDULED: "SCHEDULED",
} as const;

export type PatrolPlanType = (typeof PatrolPlanType)[keyof typeof PatrolPlanType];

export const PatrolPlanTypeLabel: Record<PatrolPlanType, string> = {
  NONSCHEDULED: "수시",
  SCHEDULED: "정기",
};

/**
 * 순찰 계획 상태
 */
export const PatrolPlanState = {
  ONGOING: "ONGOING",
  PRE_GOING: "PRE_GOING",
  COMPLETE_UNDO: "COMPLETE_UNDO",
  COMPLETE_DO: "COMPLETE_DO",
} as const;

export type PatrolPlanState = (typeof PatrolPlanState)[keyof typeof PatrolPlanState];

export const PatrolPlanStateLabel: Record<PatrolPlanState, string> = {
  ONGOING: "진행중",
  PRE_GOING: "진행 예정",
  COMPLETE_UNDO: "종료(미수행)",
  COMPLETE_DO: "종료(수행)",
};

export const PatrolPlanStateStyle: Record<PatrolPlanState, string> = {
  ONGOING: "bg-blue-100 text-blue-700",
  PRE_GOING: "bg-yellow-100 text-yellow-700",
  COMPLETE_UNDO: "bg-gray-100 text-gray-600",
  COMPLETE_DO: "bg-green-100 text-green-700",
};

/**
 * 순찰 팀 상태
 */
export const PatrolTeamState = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type PatrolTeamState = (typeof PatrolTeamState)[keyof typeof PatrolTeamState];

export const PatrolTeamStateLabel: Record<PatrolTeamState, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
};

export const PatrolTeamStateStyle: Record<PatrolTeamState, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-600",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 순찰 계획 담당자 DTO
 */
export interface PatrolPlanAccountDTO {
  id: number;
  accountId: number;
  accountName: string;
}

/**
 * 순찰 계획 건물 DTO
 */
export interface PatrolPlanBuildingDTO {
  id: number;
  buildingId: number;
  buildingName: string;
  state: string;
  stateName: string;
}

/**
 * 순찰 계획 DTO
 */
export interface PatrolPlanDTO {
  id: number;
  patrolTeamId: number;
  patrolTeamName: string;
  planType: PatrolPlanType;
  planTypeName: string;
  startDate: string | null;
  endDate: string | null;
  name: string;
  state: PatrolPlanState;
  stateName: string;
  stateStyle: string;
  writerId: number;
  writeDate: string;
  carNo: string;
  patrolPlanAccounts: PatrolPlanAccountDTO[];
  patrolPlanBuildings: PatrolPlanBuildingDTO[];
}

/**
 * 순찰 팀 담당자 DTO
 */
export interface PatrolTeamAccountDTO {
  id: number;
  accountId: number;
  accountName: string;
}

/**
 * 순찰 팀 건물 DTO
 */
export interface PatrolTeamBuildingDTO {
  id: number;
  buildingId: number;
  buildingName: string;
}

/**
 * 순찰 팀 DTO
 */
export interface PatrolTeamDTO {
  id: number;
  carId: number;
  carNo: string;
  name: string;
  state: PatrolTeamState;
  stateName: string;
  stateStyle: string;
  patrolTeamAccounts: PatrolTeamAccountDTO[];
  patrolTeamBuildings: PatrolTeamBuildingDTO[];
  writerId: number;
  writeDate: string;
}

// ============================================================================
// Search VOs
// ============================================================================

/**
 * 순찰 계획 검색 조건
 */
export interface SearchPatrolPlanVO {
  companyId?: number;
  buildingId?: number;
  teamId?: number;
  planType?: PatrolPlanType;
  page?: number;
  size?: number;
}

/**
 * 순찰 팀 검색 조건
 */
export interface SearchPatrolTeamVO {
  companyId?: number;
  buildingId?: number;
  teamId?: number;
  teamState?: PatrolTeamState;
  page?: number;
  size?: number;
}

// ============================================================================
// Request VOs
// ============================================================================

/**
 * 순찰 계획 등록/수정 VO
 */
export interface PatrolPlanVO {
  id?: number;
  patrolTeamId: number;
  planType: PatrolPlanType;
  startDate: string;
  endDate: string;
  name: string;
  patrolPlanBuildings: { buildingId: number }[];
  patrolPlanAccounts: { accountId: number }[];
}

/**
 * 순찰 팀 등록/수정 VO
 */
export interface PatrolTeamVO {
  id?: number;
  name: string;
  state: PatrolTeamState;
  carId: number;
  carNo: string;
  patrolTeamBuildings: { buildingId: number }[];
  patrolTeamAccounts: { accountId: number }[];
}

// ============================================================================
// API Response
// ============================================================================

export type PatrolPlanListResponse = PageResponse<PatrolPlanDTO>;
export type PatrolTeamListResponse = PageResponse<PatrolTeamDTO>;
