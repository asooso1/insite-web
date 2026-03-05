/**
 * 현장프로젝트(Field Project) 관련 타입 정의
 *
 * csp-was FieldProjectController, FieldProjectDTO 기반
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * 현장프로젝트 상태
 */
export const FieldProjectStatus = {
  PLANNING: "PLANNING",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type FieldProjectStatus =
  (typeof FieldProjectStatus)[keyof typeof FieldProjectStatus];

/**
 * 현장프로젝트 상태 한글 라벨
 */
export const FieldProjectStatusLabel: Record<FieldProjectStatus, string> = {
  PLANNING: "계획중",
  ACTIVE: "진행중",
  INACTIVE: "일시중지",
  COMPLETED: "완료",
  CANCELLED: "취소",
};

/**
 * 현장프로젝트 상태 스타일 (StatusBadge용)
 */
export const FieldProjectStatusStyle: Record<
  FieldProjectStatus,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  PLANNING: "pending",
  ACTIVE: "inProgress",
  INACTIVE: "inProgress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 현장프로젝트 DTO
 */
export interface FieldProjectDTO {
  id: number;
  projectName: string;
  buildingId: number;
  buildingName: string;
  status: FieldProjectStatus;
  startDate: string;
  endDate: string;
  description?: string;
  address?: string;
  addressDetail?: string;
  latitude?: number;
  longitude?: number;
  geofenceRadius?: number;
}

/**
 * 현장프로젝트 참여자 DTO
 */
export interface FieldProjectAccountDTO {
  id: number;
  projectId: number;
  accountId: number;
  accountName: string;
  accountEmail: string;
  role: string;
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 현장프로젝트 검색 조건
 */
export interface SearchFieldProjectVO {
  buildingId?: number;
  status?: FieldProjectStatus;
  keyword?: string;
  page?: number;
  size?: number;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 현장프로젝트 등록/수정 VO
 */
export interface FieldProjectCreateVO {
  projectName: string;
  buildingId: number;
  status: FieldProjectStatus;
  startDate: string;
  endDate: string;
  description?: string;
  address?: string;
  addressDetail?: string;
  latitude?: number;
  longitude?: number;
  geofenceRadius?: number;
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
 * 현장프로젝트 목록 응답
 */
export type FieldProjectListResponse = PageResponse<FieldProjectDTO>;
