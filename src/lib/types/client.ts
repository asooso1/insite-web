/**
 * 클라이언트(Client/Company) 관련 타입 정의
 *
 * csp-was ClientController, CompanyDTO 기반
 */

import type { PageResponse } from "./facility";
import type { BuildingDTO } from "./facility";

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
 * 클라이언트(회사) DTO
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
  weatherX: string;
  weatherY: string;
  zipCode: string;
  address: string;
  addressRoad: string;
  addressDetail: string;
  state: CompanyState;
  note: string;
  writerId: number;
  writerName: string;
  writerCompanyName: string;
  writeDate: string | null;
  lastModifyDate: string | null;
  buildingCnt: number;
  serviceExpire: boolean;
  contractDate: string | null;
  buildingList: BuildingDTO[];
  baseAreaList: BaseAreaDTO[];
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 클라이언트 검색 조건
 */
export interface SearchClientVO {
  companyId?: number;
  accountId?: number;
  writeDateFrom?: string;
  writeDateTo?: string;
  searchCode?: "companyName" | "businessNo";
  searchKeyword?: string;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 클라이언트 등록 VO (FormData로 전송)
 */
export interface ClientAddVO {
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
  weatherX?: string;
  weatherY?: string;
  zipCode: string;
  address: string;
  addressRoad?: string;
  addressDetail: string;
  files?: File[];
}

/**
 * 클라이언트 수정 VO (FormData로 전송)
 */
export interface ClientEditVO {
  id: number;
  name: string;
  phone: string;
  fax?: string;
  officerName: string;
  officerPhone: string;
  officerMobile?: string;
  officerEmail?: string;
  state: CompanyState;
  note?: string;
  weatherX?: string;
  weatherY?: string;
  zipCode: string;
  address: string;
  addressRoad?: string;
  addressDetail: string;
  files?: File[];
}

/**
 * 거점 등록 VO
 */
export interface ClientBaseAreaAddVO {
  companyId: number;
  baseAreaName: string;
}

/**
 * 거점 상태 변경 VO
 */
export interface BaseAreaVO {
  baseAreas: Array<{
    id: number;
    name: string;
    state: string;
  }>;
}

// ============================================================================
// API Response
// ============================================================================

/**
 * 클라이언트 목록 응답
 */
export type ClientListResponse = PageResponse<CompanyDTO>;
