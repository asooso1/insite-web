/**
 * 사용자(User) 관련 타입 정의
 *
 * csp-was UserController, Account 엔티티 기반
 */

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
 * 역할 DTO
 */
export interface RoleDTO {
  id: number;
  code: string;
  name: string;
  state: "USE" | "STOP";
  type: AccountType;
  typeString: string;
}

/**
 * 사용자 DTO (상세)
 */
export interface AccountDTO {
  id: number;
  userId: string;
  name: string;
  companyId: number;
  companyName: string;
  type: AccountType;
  typeName: string;
  department: string;
  position: string;
  officePhone: string;
  mobile: string;
  email: string;
  birthDate: string | null;
  gender: "M" | "F";
  hiredDate: string | null;
  retiredDate: string | null;
  state: AccountState;
  stateName: string;
  note: string;
  roles: RoleDTO[];
  buildingCnt: number;
  writeDate: string;
  writerName: string;
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 사용자 검색 조건
 */
export interface SearchUserVO {
  companyId?: number;
  buildingId?: number;
  state?: AccountState;
  roleId?: number;
  searchCode?: "name" | "userId" | "mobile";
  searchKeyword?: string;
  startDate?: string;
  endDate?: string;
  dateType?: "writeDate" | "hiredDate" | "retiredDate";
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
  mobile: string;
  birthDate: string;
  gender: "M" | "F";
  state: AccountState;
  hiredDate?: string;
  retiredDate?: string;
  roleId: number;
  department?: string;
  officePhone?: string;
  email?: string;
  zipCode?: string;
  address?: string;
  addressDetail?: string;
  note?: string;
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
