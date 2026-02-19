/**
 * 사용자(User/Account) 관련 타입 정의
 *
 * csp-was UserController, AccountDTO, UserVO 기반
 */

import type { PageResponse } from "./facility";

// ============================================================================
// Enums
// ============================================================================

/**
 * 계정 상태
 */
export const AccountState = {
  HIRED: "HIRED",
  LEAVE: "LEAVE",
  RETIRED: "RETIRED",
  TEMPORAL: "TEMPORAL",
  DEL: "DEL",
} as const;

export type AccountState = (typeof AccountState)[keyof typeof AccountState];

/**
 * 계정 상태 한글 라벨
 */
export const AccountStateLabel: Record<AccountState, string> = {
  HIRED: "재직중",
  LEAVE: "휴직",
  RETIRED: "퇴사",
  TEMPORAL: "임시",
  DEL: "삭제",
};

/**
 * 계정 상태 스타일 (StatusBadge용)
 */
export const AccountStateStyle: Record<
  AccountState,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  HIRED: "completed",
  LEAVE: "pending",
  RETIRED: "cancelled",
  TEMPORAL: "inProgress",
  DEL: "cancelled",
};

/**
 * 계정 유형
 */
export const AccountType = {
  LABS: "LABS",
  FIELD: "FIELD",
  DAILY: "DAILY",
  CLIENT: "CLIENT",
  GUEST: "GUEST",
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

/**
 * 계정 유형 한글 라벨
 */
export const AccountTypeLabel: Record<AccountType, string> = {
  LABS: "본사인력",
  FIELD: "현장인력",
  DAILY: "일용직",
  CLIENT: "고객사",
  GUEST: "민원인",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 사용자 건물 배정 DTO
 */
export interface BuildingAccountDTO {
  id: number;
  buildingId: number;
  buildingName: string;
  companyName: string;
  jobType: string;
  jobTypeName: string;
}

/**
 * 사용자 자격증 DTO
 */
export interface AccountLicenseDTO {
  id: number;
  licenseName: string;
  licenseNo: string;
  issueDate: string | null;
  expireDate: string | null;
}

/**
 * 역할 DTO
 */
export interface RoleDTO {
  id: number;
  code: string;
  name: string;
  state: "USE" | "STOP";
  stateName: string;
  sortNo: number;
  type: string;
  typeString: string;
}

/**
 * 사용자 DTO (목록/상세)
 */
export interface AccountDTO {
  id: number;
  userId: string;
  name: string;
  companyId: number;
  companyName: string;
  department: string;
  position: string;
  type: string;
  workerType: string | null;
  mobile: string;
  birthDate: string | null;
  gender: string;
  hiredDate: string | null;
  retiredDate: string | null;
  state: AccountState;
  stateValue: string;
  note: string;
  writeEmbedded: string | null;
  writeDate: string | null;
  buildingCnt: number;
  roleId: number;
  roleName: string;
  roleSite: boolean;
  isAgreePrivacy: boolean | null;
  jobTypeValue: string | null;
  isFromErp: boolean;
  accountLicenseDTO: AccountLicenseDTO[];
  buildingAccountDTO: BuildingAccountDTO[];
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 사용자 검색 조건
 */
export interface SearchUserVO {
  companyId?: number;
  wideAreaId?: number;
  baseAreaId?: number;
  buildingId?: number;
  writeDateFrom?: string;
  writeDateTo?: string;
  searchCode?: "name" | "userId" | "mobile";
  searchKeyword?: string;
  roleId?: number;
  idle?: boolean;
  assigned?: boolean;
  accountState?: AccountState;
  mobile?: string;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 사용자 등록/수정 VO
 */
export interface UserVO {
  id?: number;
  userId: string;
  name: string;
  companyId: number;
  wideAreaId?: number;
  baseAreaId?: number;
  buildingId?: number;
  department?: string;
  position?: string;
  type?: string;
  workerType?: string;
  officePhone?: string;
  mobile: string;
  email?: string;
  birthDate?: string;
  gender: "M" | "F";
  hiredDate?: string;
  retiredDate?: string;
  state: AccountState;
  note?: string;
  isInitPassword?: boolean;
  zipCode?: string;
  address?: string;
  addressRoad?: string;
  addressDetail?: string;
  roleId: number;
  writeId?: number;
}

// ============================================================================
// API Response
// ============================================================================

/**
 * 사용자 목록 응답
 */
export type UserListResponse = PageResponse<AccountDTO>;
