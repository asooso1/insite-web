/**
 * 민원(VOC/Complain) 관련 타입 정의
 *
 * csp-was WorkOrderController, VocDTO 기반
 */

import type { PageResponse } from "./work-order";

// ============================================================================
// Enums
// ============================================================================

/**
 * 민원 상태
 */
export const VocState = {
  ASK: "ASK",
  PROCESS: "PROCESS",
  FINISH: "FINISH",
  REJECT: "REJECT",
} as const;

export type VocState = (typeof VocState)[keyof typeof VocState];

/**
 * 민원 상태 한글 라벨
 */
export const VocStateLabel: Record<VocState, string> = {
  ASK: "접수",
  PROCESS: "처리중",
  FINISH: "완료",
  REJECT: "반려",
};

/**
 * 민원 상태 스타일 (StatusBadge용)
 */
export const VocStateStyle: Record<
  VocState,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  ASK: "pending",
  PROCESS: "inProgress",
  FINISH: "completed",
  REJECT: "cancelled",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 민원 파일 DTO
 */
export interface VocFileDTO {
  id: number;
  vocId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

/**
 * 민원과 연결된 작업지시 DTO
 */
export interface WorkOrderVocDTO {
  workOrderId: number;
  workOrderName: string;
}

/**
 * 빌딩 간략 DTO
 */
export interface BuildingSimpleDTO {
  id: number;
  name: string;
}

/**
 * 빌딩 층 간략 DTO
 */
export interface BuildingFloorSimpleDTO {
  id: number;
  name: string;
}

/**
 * 빌딩 층 구역 간략 DTO
 */
export interface BuildingFloorZoneSimpleDTO {
  id: number;
  name: string;
}

/**
 * 민원 DTO (상세)
 */
export interface VocDTO {
  id: number;
  buildingId: number;
  buildingFloorId: number;
  buildingFloorZoneId: number;
  vocUserName: string;
  vocUserPhone: string;
  vocDate: string;
  title: string;
  state: VocState;
  requestContents: string;

  buildingDTO: BuildingSimpleDTO;
  buildingFloorDTO: BuildingFloorSimpleDTO;
  buildingFloorZoneDTO: BuildingFloorZoneSimpleDTO;
  workOrderVocDTOs: WorkOrderVocDTO[];
  files: VocFileDTO[];
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 민원 검색 조건
 */
export interface SearchVocVO {
  buildingId?: number;
  buildingFloorId?: number;
  buildingFloorZoneId?: number;
  state?: VocState;
  searchCode?: string;
  searchKeyword?: string;
  writeDateFrom?: string;
  writeDateTo?: string;
  page?: number;
  size?: number;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 민원 등록/수정 VO
 */
export interface VocVO {
  buildingId: number;
  buildingFloorId: number;
  buildingFloorZoneId: number;
  vocUserName: string;
  vocUserPhone: string;
  vocDate: string;
  title: string;
  requestContents: string;
  files?: File[];
}

// ============================================================================
// API Response
// ============================================================================

/**
 * 민원 목록 응답
 */
export type VocListResponse = PageResponse<VocDTO>;
