/**
 * 자재(Material) 관련 타입 정의
 *
 * csp-was MaterialController, MaterialDTO 기반
 */

import type { PageResponse, BuildingFloorDTO, BuildingFloorZoneDTO } from "./facility";

// ============================================================================
// Enums
// ============================================================================

/**
 * 자재 유형
 */
export const MaterialType = {
  RAW: "RAW",
  PARTS: "PARTS",
  SUPPLIES: "SUPPLIES",
  TOOL: "TOOL",
  FUEL: "FUEL",
  STORED: "STORED",
  PROCESS: "PROCESS",
  HALF_FINISHED: "HALF_FINISHED",
  PRODUCT: "PRODUCT",
  GOODS: "GOODS",
} as const;

export type MaterialType = (typeof MaterialType)[keyof typeof MaterialType];

export const MaterialTypeLabel: Record<MaterialType, string> = {
  RAW: "원자재",
  PARTS: "부분품",
  SUPPLIES: "소모품",
  TOOL: "공구",
  FUEL: "연료",
  STORED: "저장품",
  PROCESS: "공정품",
  HALF_FINISHED: "반제품",
  PRODUCT: "상품",
  GOODS: "제품",
};

/**
 * 자재 상태
 */
export const MaterialState = {
  PREPARE: "PREPARE",
  OPERATING: "OPERATING",
  DISCARD: "DISCARD",
} as const;

export type MaterialState = (typeof MaterialState)[keyof typeof MaterialState];

export const MaterialStateLabel: Record<MaterialState, string> = {
  PREPARE: "준비",
  OPERATING: "운영",
  DISCARD: "폐기",
};

export const MaterialStateStyle: Record<
  MaterialState,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  PREPARE: "pending",
  OPERATING: "completed",
  DISCARD: "cancelled",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 빌딩 사용자 그룹 DTO
 */
export interface BuildingUserGroupDTO {
  id: number;
  name: string;
  buildingId: number;
}

/**
 * 자재 파일 DTO
 */
export interface MaterialFileDTO {
  id: number;
  materialId: number;
  fileType: string;
  fileTypeName: string;
  sortNo: number;
  originFileName: string;
  filePath: string;
  size: number;
  writerId: number;
  writerName: string;
  writeDate: string;
}

/**
 * 자재 입출고 DTO
 */
export interface MaterialInOutDTO {
  date: string;
  type: string;
  method: string;
  unitPrice: string;
  cnt: number;
  stockCnt: number;
  reason: string;
  etc: string;
  writerName: string;
  writeDate: string;
}

/**
 * 자재 DTO
 */
export interface MaterialDTO {
  id: number;
  name: string;
  privateCode: string;
  type: MaterialType;
  typeName: string;
  standard: string;
  unit: string;
  state: MaterialState;
  stateName: string;
  stateStyle: string;
  suitableStock: number;
  connectWorkOrder: boolean;
  connectWorkOrderName: string;
  description: string;
  stockCnt: number;

  writerId: number;
  writerName: string;
  writerUserId: string;
  writeDate: string;

  lastModifierId: number;
  lastModifierName: string;
  lastModifierUserId: string;
  lastModifyDate: string;

  buildingFloorId: number;
  buildingFloors: BuildingFloorDTO[];

  buildingFloorZoneId: number;
  buildingFloorZoneDTO: BuildingFloorZoneDTO | null;
  buildingFloorZones: BuildingFloorZoneDTO[];

  userGroupId: number;
  buildingUserGroupDTO: BuildingUserGroupDTO | null;
  userGroups: BuildingUserGroupDTO[];

  materialFileDTOs: MaterialFileDTO[];
  materialInOutDTOs: MaterialInOutDTO[];

  companyName: string;
  baseAreaName: string;
  buildingName: string;
  estimateUseCnt: string;
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 자재 검색 조건
 */
export interface SearchMaterialVO {
  companyId?: number;
  baseAreaId?: number;
  buildingId?: number;
  buildingFloorId?: number;
  buildingFloorZoneId?: number;
  userGroupId?: number;
  searchCode?: string;
  searchKeyword?: string;
  name?: string;
  suitableStock?: string;
  type?: MaterialType;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 자재 등록/수정 VO
 */
export interface MaterialVO {
  id?: number;
  buildingFloorZoneId: number;
  userGroupId: number;
  name: string;
  privateCode?: string;
  standard?: string;
  unit?: string;
  suitableStock?: number;
  connectWorkOrder?: boolean;
  stockCnt?: number;
  description?: string;
  type: MaterialType;
  state: MaterialState;
  files?: File[];
}

/**
 * 자재 재고 조정 VO
 */
export interface MaterialStockVO {
  materialId: number;
  materialInId?: number;
  type: "IN" | "OUT";
  date: string;
  unitPrice?: number;
  cnt: number;
  reason?: string;
  etc?: string;
  method?: string;
  workOrderItemId?: number;
}

// ============================================================================
// API Response
// ============================================================================

export type MaterialListResponse = PageResponse<MaterialDTO>;
