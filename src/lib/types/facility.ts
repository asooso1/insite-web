/**
 * 시설(Facility) 관련 타입 정의
 *
 * csp-was FacilityController, FacilityDTO 기반
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * 시설 상태
 */
export const FacilityState = {
  BEFORE_CONSTRUCT: "BEFORE_CONSTRUCT",
  ONGOING_CONSTRUCT: "ONGOING_CONSTRUCT",
  END_CONSTRUCT: "END_CONSTRUCT",
  BEFORE_OPERATING: "BEFORE_OPERATING",
  ONGOING_OPERATING: "ONGOING_OPERATING",
  END_OPERATING: "END_OPERATING",
  DISCARD: "DISCARD",
  NOW_CHECK: "NOW_CHECK",
} as const;

export type FacilityState = (typeof FacilityState)[keyof typeof FacilityState];

/**
 * 시설 상태 한글 라벨
 */
export const FacilityStateLabel: Record<FacilityState, string> = {
  BEFORE_CONSTRUCT: "시공전",
  ONGOING_CONSTRUCT: "시공중",
  END_CONSTRUCT: "시공완료",
  BEFORE_OPERATING: "운영전",
  ONGOING_OPERATING: "운영중",
  END_OPERATING: "운영완료",
  DISCARD: "폐기",
  NOW_CHECK: "점검중",
};

/**
 * 시설 상태 스타일 (StatusBadge용)
 */
export const FacilityStateStyle: Record<
  FacilityState,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  BEFORE_CONSTRUCT: "pending",
  ONGOING_CONSTRUCT: "inProgress",
  END_CONSTRUCT: "completed",
  BEFORE_OPERATING: "pending",
  ONGOING_OPERATING: "inProgress",
  END_OPERATING: "completed",
  DISCARD: "cancelled",
  NOW_CHECK: "inProgress",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 시설 파일 DTO
 */
export interface FacilityFileDTO {
  id: number;
  facilityId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

/**
 * 시설 QR/NFC DTO
 */
export interface FacilityQrNfcDTO {
  id: number;
  facilityId: number;
  type: string;
  code: string;
}

/**
 * 시설 관제점 DTO
 */
export interface FacilityControlPointDTO {
  id: number;
  facilityId: number;
  controlPointId: number;
  controlPointName: string;
}

/**
 * 시설 마스터 DTO
 */
export interface FacilityMasterDTO {
  id: number;
  name: string;
  makingCompany: string;
  modelName: string;
  capacity: string;
  electricityConsumption: string;
  fuelType: string;
  fuelTypeName: string;
}

/**
 * 시설 분류 DTO
 */
export interface FacilityCategoryDTO {
  id: number;
  name: string;
  parentId: number;
  depth: number;
  firstFacilityCategoryId?: number;
  firstFacilityCategoryName?: string;
  secondFacilityCategoryId?: number;
  secondFacilityCategoryName?: string;
}

/**
 * 빌딩 층 구역 DTO
 */
export interface BuildingFloorZoneDTO {
  id: number;
  name: string;
  buildingFloorId: number;
}

/**
 * 빌딩 층 DTO
 */
export interface BuildingFloorDTO {
  id: number;
  name: string;
  buildingId: number;
  orderNum: number;
}

/**
 * 빌딩 DTO (간략)
 */
export interface BuildingDTO {
  id: number;
  name: string;
  address?: string;
  companyId?: number;
  companyName?: string;
}

/**
 * 시설 DTO (상세)
 */
export interface FacilityDTO {
  id: number;
  name: string;
  facilityNo: string;
  use: string;

  // 위치
  buildingFloorZoneId: number;
  buildingFloorZoneName: string;
  buildingFloorId: number;
  buildingFloorName: string;

  // 분류
  facilityMasterId: number;

  // 상태
  state: FacilityState;
  stateName: string;

  // 제조/납품
  makeDate: string | null;
  sellCompany: string;
  sellCompanyPhone: string;

  // 스펙
  cop: string;
  snNo: string;
  installDate: string | null;
  startRunDate: string | null;

  // 담당
  chargerId: number;
  chargerName: string;
  chargerUserId: string;
  buildingUserGroupId: number;
  buildingUserGroupName: string;

  // 구매/보증
  purchaseUnitPrice: string | null;
  guaranteeExpireDate: string | null;
  persistPeriod: number;

  // 작성자
  writerId: number;
  writerName: string;
  writerUserId: string;
  writeDate: string;

  // 수정자
  lastModifierId: number;
  lastModifierName: string;
  lastModifierUserId: string;
  lastModifyDate: string;

  // 관련 데이터
  facilityQrNfcDTOs: FacilityQrNfcDTO[];
  facilityFileDTOs: FacilityFileDTO[];
  facilityControlPointDTOs: FacilityControlPointDTO[];
}

/**
 * 시설 목록 아이템 DTO
 */
export interface FacilityListDTO {
  facilityDTO: FacilityDTO;
  facilityMasterDTO: FacilityMasterDTO;
  facilityCategoryDTO: FacilityCategoryDTO;
  secondFacilityCategory: FacilityCategoryDTO | null;
  firstFacilityCategory: FacilityCategoryDTO | null;
  buildingFloorZoneDTO: BuildingFloorZoneDTO;
  buildingFloorDTO: BuildingFloorDTO;
  buildingDTO: BuildingDTO;
  orderByBuildingName: string;
  orderByFirstCategoryName: string;
  orderBySecondCategoryName: string;
  orderByThirdCategoryName: string;
  orderByFacilityName: string;
  hasHistory: boolean;
  facilityIdBefore: number;
  facilityIdNext: number;
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 시설 검색 조건
 */
export interface SearchFacilityVO {
  // 기간
  startDate?: string;
  endDate?: string;

  // 위치
  companyId?: number;
  regionId?: number;
  buildingId?: number;
  buildingFloorId?: number;

  // 분류
  firstFacilityCategoryId?: number;
  secondFacilityCategoryId?: number;
  thirdFacilityCategoryId?: number;

  // 상태
  state?: FacilityState;

  // 관제점
  controlPointId?: number;

  // 이력
  hasHistory?: boolean;

  // 검색어
  keyword?: string;
  locationCode?: string;
  locationKeyword?: string;
  categoryName?: string;

  // 정렬
  sort?: string;
  direction?: "ASC" | "DESC";
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 시설 등록/수정 VO
 */
export interface FacilityVO {
  id?: number;

  // 위치
  companyId: number;
  buildingId: number;
  buildingFloorId: number;
  buildingFloorZoneId?: number;

  // 분류
  facilityMasterId: number;

  // 기본 정보
  facilityNo: string;
  facilityName: string;
  use: string;
  state: FacilityState;

  // 제조/납품
  makingCompany?: string;
  makeDate?: string;
  sellCompany?: string;
  sellCompanyPhone?: string;

  // 스펙
  capacity?: string;
  electricityConsumption?: string;
  cop?: string;
  modelName?: string;
  snNo?: string;
  installDate?: string;
  startRunDate?: string;

  // 담당
  chargerId?: number;
  buildingUserGroupId: number;

  // 구매/보증
  purchaseUnitPrice?: string;
  fuelType?: string;
  guaranteeExpireDate?: string;
  persistPeriod?: number;

  // 파일
  imgFiles?: File[];
  files?: File[];
}

// ============================================================================
// API Response
// ============================================================================

/**
 * 페이지네이션 응답
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * 시설 목록 응답
 */
export type FacilityListResponse = PageResponse<FacilityListDTO>;
