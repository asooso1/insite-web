/**
 * 클라이언트(Client) 관련 타입 정의
 *
 * csp-was ClientController, Company 엔티티 기반
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * 회사 상태
 */
export const CompanyState = {
  USE: "USE",
  STOP: "STOP",
  OUT: "OUT",
  DEL: "DEL",
} as const;

export type CompanyState = (typeof CompanyState)[keyof typeof CompanyState];

/**
 * 회사 상태 한글 라벨
 */
export const CompanyStateLabel: Record<CompanyState, string> = {
  USE: "사용중",
  STOP: "사용중지",
  OUT: "탈퇴",
  DEL: "삭제",
};

/**
 * 회사 상태 스타일 (StatusBadge용)
 */
export const CompanyStateStyle: Record<
  CompanyState,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  USE: "completed",
  STOP: "pending",
  OUT: "cancelled",
  DEL: "cancelled",
};

// ============================================================================
// DTOs
// ============================================================================

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
 * 빌딩 담당자 DTO
 */
export interface BuildingAccountDTO {
  id: number;
  name: string;
  userId: string;
  mobile: string;
}

/**
 * 클라이언트 상세 빌딩 DTO
 */
export interface ClientViewBuildingDTO {
  id: number;
  name: string;
  wideAreaName: string;
  baseAreaName: string;
  contractTermStart: string;
  contractTermEnd: string;
  facilityCount: number;
  controlPointCount: number;
  serviceExpire: boolean;
  buildingAccountList: BuildingAccountDTO[];
}

/**
 * 거점 DTO
 */
export interface BaseAreaDTO {
  id: number;
  name: string;
  state: "USE" | "STOP";
  companyId: number;
  buildingList: BuildingDTO[];
}

/**
 * 회사 로고 DTO
 */
export interface CompanyLogoDTO {
  id: number;
  companyId: number;
  fileName: string;
  fileUrl: string;
}

/**
 * 클라이언트 목록 DTO
 */
export interface CompanyDTO {
  id: number;
  businessNo: string;
  name: string;
  phone: string;
  fax: string;
  officerName: string;
  officerPhone: string;
  officerMobile: string;
  officerEmail: string;
  state: CompanyState;
  stateName: string;
  note: string;
  zipCode: string;
  address: string;
  addressRoad: string;
  addressDetail: string;
  buildingCnt: number;
  buildingList: BuildingDTO[];
  contractDate: string | null;
  serviceExpire: boolean;
  writeDate: string;
  writerName: string;
}

/**
 * 클라이언트 상세 DTO
 */
export interface ClientViewDTO extends CompanyDTO {
  buildingDTO: ClientViewBuildingDTO[];
  baseAreaList: BaseAreaDTO[];
  logoOriginFileName: string;
  companyLogoDTO: CompanyLogoDTO | null;
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 클라이언트 검색 조건
 */
export interface SearchClientVO {
  companyId?: number;
  searchCode?: "companyName" | "businessNo";
  searchKeyword?: string;
  writeDateFrom?: string;
  writeDateTo?: string;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 클라이언트 등록/수정 VO
 */
export interface ClientVO {
  id?: number;
  businessNo: string;
  name: string;
  phone: string;
  fax?: string;
  officerName: string;
  officerPhone: string;
  officerMobile?: string;
  officerEmail?: string;
  state: CompanyState;
  note?: string;
  zipCode: string;
  address: string;
  addressRoad: string;
  addressDetail: string;
  weatherX?: string;
  weatherY?: string;
  files?: File[];
}

/**
 * 거점 등록/수정 VO
 */
export interface BaseAreaVO {
  id?: number;
  name: string;
  companyId: number;
  state?: "USE" | "STOP";
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
