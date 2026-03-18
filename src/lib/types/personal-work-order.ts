/**
 * 개인 작업지시(Personal Work Order) 관련 타입 정의
 *
 * csp-was PersonalWorkOrderController 기반
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * 개인 작업 상태
 */
export const PersonalWorkOrderState = {
  WRITE: "WRITE",
  ISSUE: "ISSUE",
  PROCESSING: "PROCESSING",
  REQ_COMPLETE: "REQ_COMPLETE",
  COMPLETE: "COMPLETE",
  CANCEL: "CANCEL",
} as const;

export type PersonalWorkOrderState =
  (typeof PersonalWorkOrderState)[keyof typeof PersonalWorkOrderState];

/**
 * 개인 작업 상태 한글 라벨
 */
export const PersonalWorkOrderStateLabel: Record<PersonalWorkOrderState, string> =
  {
    WRITE: "작성",
    ISSUE: "발행",
    PROCESSING: "처리중",
    REQ_COMPLETE: "완료요청",
    COMPLETE: "완료",
    CANCEL: "취소",
  };

/**
 * 개인 작업 상태 스타일 (StatusBadge용)
 */
export const PersonalWorkOrderStateStyle: Record<
  PersonalWorkOrderState,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  WRITE: "pending",
  ISSUE: "pending",
  PROCESSING: "inProgress",
  REQ_COMPLETE: "inProgress",
  COMPLETE: "completed",
  CANCEL: "cancelled",
};

/**
 * 개인 작업 유형
 */
export const PersonalWorkOrderType = {
  GENERAL: "GENERAL",
  TEMPORARY: "TEMPORARY",
  MAINTENANCE: "MAINTENANCE",
} as const;

export type PersonalWorkOrderType =
  (typeof PersonalWorkOrderType)[keyof typeof PersonalWorkOrderType];

/**
 * 개인 작업 유형 한글 라벨
 */
export const PersonalWorkOrderTypeLabel: Record<PersonalWorkOrderType, string> =
  {
    GENERAL: "일반",
    TEMPORARY: "임시",
    MAINTENANCE: "유지보수",
  };

// ============================================================================
// DTOs
// ============================================================================

/**
 * 작성 정보 DTO
 */
export interface WriteInfoDTO {
  id: number;
  name: string;
  userId: string;
  companyName: string;
  roleName: string;
  writeDate: string;
}

/**
 * 승인 정보 DTO
 */
export interface ConfirmInfoDTO {
  id: number;
  name: string;
  userId: string;
  companyName: string;
  roleName: string;
  confirmDate?: string;
}

/**
 * 개인 작업 파일 DTO
 */
export interface PersonalWorkOrderFileDTO {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

/**
 * 개인 작업 목록 아이템 DTO (PersonalWorkOrderDTO)
 */
export interface PersonalWorkOrderListDTO {
  personalWorkOrderId: number;
  buildingId: number;
  buildingName: string;
  buildingUserGroupId: number;
  teamName: string;
  title: string;
  state: PersonalWorkOrderState;
  writerInfo: WriteInfoDTO;
  confirmInfo: ConfirmInfoDTO;
}

/**
 * 개인 작업 상세 DTO (PersonalWorkOrderDetailDTO)
 */
export interface PersonalWorkOrderDetailDTO extends PersonalWorkOrderListDTO {
  companyId: number;
  companyName: string;
  baseAreaId: number;
  baseArea: string;
  description: string;
  type: PersonalWorkOrderType;
  buildingFloorId: number;
  buildingFloorName: string;
  buildingFloorZoneId: number;
  buildingFloorZoneName: string;
  isAlertPushAlarm: boolean;
  location: string;
  facilityId: number;
  facilityName: string;
  images: PersonalWorkOrderFileDTO[];
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 개인 작업 검색 조건
 */
export interface SearchPersonalWorkOrderVO {
  // 필터
  companyId?: number;
  baseAreaId?: number;
  buildingId?: number;
  buildingUserGroupId?: number;
  writerId?: number;

  // 기간 검색
  type?: "write_date" | "confirm_date";
  from?: string; // yyyy-MM-dd
  to?: string; // yyyy-MM-dd

  // 상태
  state?: PersonalWorkOrderState;

  // 검색어
  searchCode?: "title" | "keyword";
  keyword?: string;

  // 페이지네이션
  page?: number;
  size?: number;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 개인 작업 등록/수정 VO (PersonalWorkOrderVO)
 */
export interface PersonalWorkOrderVO {
  id?: number;
  title: string;
  description: string;
  confirmAccountId: number;
  isAlertPush: boolean;
  buildingId?: number;
  buildingFloorZoneId?: number;
  facilityId?: number;
  buildingUserGroupId?: number;
  files?: File[];
}

/**
 * 개인 작업 수정 VO (PersonalWorkOrderUpdateVO)
 */
export interface PersonalWorkOrderUpdateVO {
  id: number;
  title: string;
  description: string;
  confirmAccountId: number;
  isAlertPush: boolean;
  buildingId?: number;
  buildingFloorZoneId?: number;
  facilityId?: number;
  buildingUserGroupId?: number;
  additionalImages?: File[];
}

/**
 * 개인 작업 확인 요청 VO
 */
export interface PersonalWorkOrderConfirmVO {
  personalWorkOrderId: number;
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
 * 개인 작업 목록 응답
 */
export type PersonalWorkOrderListResponse = PageResponse<PersonalWorkOrderListDTO>;
