/**
 * 건물(Building) 관련 타입 정의
 *
 * csp-was SiteController, BuildingDTO 기반
 */

import type { PageResponse } from "./facility";

// ============================================================================
// Enums
// ============================================================================

/**
 * 건물 운영 상태
 */
export const BuildingState = {
  BEFORE_CONSTRUCT: "BEFORE_CONSTRUCT",
  ONGOING_CONSTRUCT: "ONGOING_CONSTRUCT",
  END_CONSTRUCT: "END_CONSTRUCT",
  BEFORE_OPERATING: "BEFORE_OPERATING",
  ONGOING_OPERATING: "ONGOING_OPERATING",
  END_OPERATING: "END_OPERATING",
} as const;

export type BuildingState = (typeof BuildingState)[keyof typeof BuildingState];

export const BuildingStateLabel: Record<BuildingState, string> = {
  BEFORE_CONSTRUCT: "시공전",
  ONGOING_CONSTRUCT: "시공중",
  END_CONSTRUCT: "시공완료",
  BEFORE_OPERATING: "운영전",
  ONGOING_OPERATING: "운영중",
  END_OPERATING: "운영종료",
};

export const BuildingStateStyle: Record<
  BuildingState,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  BEFORE_CONSTRUCT: "pending",
  ONGOING_CONSTRUCT: "inProgress",
  END_CONSTRUCT: "completed",
  BEFORE_OPERATING: "pending",
  ONGOING_OPERATING: "inProgress",
  END_OPERATING: "cancelled",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 건물 상세 DTO (csp-was BuildingDTO)
 */
export interface BuildingFullDTO {
  id: number;
  companyId: number;
  companyName: string;
  name: string;
  officePhone: string;
  homePage: string;
  state: BuildingState;
  stateValue: string;
  useType1Id: number;
  useType2Id: number;
  buildingUseType: string;
  productId: number;
  productName: string;
  chargeDepartment: string;
  managerId: number;
  managerName: string;
  managerMobile: string;
  contractTermStart: string | null;
  contractTermEnd: string | null;
  serviceExpire: boolean;
  serviceNcp: boolean;
  serviceFms: boolean;
  serviceRms: boolean;
  serviceEms: boolean;
  serviceBim: boolean;
  servicePatrol: boolean;
  excludeFromAnalysis: boolean;
  note: string;
  rspBuildingId: string;
  constructionCompany: string;
  supervision: string;
  completeDate: string | null;
  constructStartDate: string | null;
  constructEndDate: string | null;
  height: string;
  plottage: string;
  structure: string;
  buildingAreaSize: string;
  floorAreaRatio: string;
  totalFloorAreaSize: string;
  buildingCoverageRatio: string;
  landscapingAreaSize: string;
  exclusiveUseRatio: string;
  addedInfo: string;
  latitude: string;
  longitude: string;
  weatherX: string;
  weatherY: string;
  zipCode: string;
  address: string;
  addressRoad: string;
  addressDetail: string;
  baseAreaId: number;
  baseAreaName: string;
  wideAreaId: number;
  wideAreaName: string;
  nearbyRange: string;
  basementMaxFloor: number;
  groundMaxFloor: number;
  rooftopMaxFloor: number;
  writeEmbedded: string | null;
}

// ============================================================================
// Search VO
// ============================================================================

export interface SearchBuildingVO {
  writeDateFrom?: string;
  writeDateTo?: string;
  buildingState?: BuildingState | "";
  buildingName?: string;
  clientId?: number;
}

// ============================================================================
// Save VO
// ============================================================================

export interface BuildingSaveVO {
  id?: number;
  companyId: number;
  name: string;
  officePhone?: string;
  useType2Id: number;
  productId?: number;
  homePage?: string;
  state: BuildingState;
  chargeDepartment?: string;
  managerId?: number;
  contractTermStart?: string;
  contractTermEnd?: string;
  serviceNcp?: boolean;
  serviceFms?: boolean;
  serviceRms?: boolean;
  serviceEms?: boolean;
  serviceBim?: boolean;
  servicePatrol?: boolean;
  excludeFromAnalysis?: boolean;
  note?: string;
  constructionCompany?: string;
  supervision?: string;
  completeDateStr?: string;
  constructStartDateStr?: string;
  constructEndDateStr?: string;
  height?: string;
  plottage?: string;
  structure?: string;
  buildingAreaSize?: string;
  floorAreaRatio?: string;
  totalFloorAreaSize?: string;
  buildingCoverageRatio?: string;
  landscapingAreaSize?: string;
  exclusiveUseRatio?: string;
  latitude: string;
  longitude: string;
  weatherX?: string;
  weatherY?: string;
  zipCode: string;
  address: string;
  addressRoad?: string;
  addressDetail: string;
  baseAreaId: number;
  wideAreaId: number;
}

// ============================================================================
// API Response
// ============================================================================

export type BuildingListResponse = PageResponse<BuildingFullDTO>;
