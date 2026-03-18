/**
 * 당직 관리(Duty) 관련 타입 정의
 *
 * csp-was DutyController, DutyTypeDTO 기반
 */

// ============================================================================
// DTOs
// ============================================================================

/**
 * 당직 유형 DTO
 */
export interface DutyTypeDTO {
  id: number;
  name: string;
  color: string;
  description: string;
  buildingName: string;
}

/**
 * 당직 배정 DTO
 */
export interface DutyAssignmentDTO {
  accountDutyId: number;
  accountId: number;
  accountName: string;
  date: string;
  dutyTypeId: number;
  dutyTypeName: string;
  dutyTypeColor: string;
}

/**
 * 당직 목록 응답
 */
export interface DutyListResponse {
  content: DutyTypeDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * 당직 배정 목록 응답
 */
export interface DutyAssignmentListResponse {
  content: DutyAssignmentDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 당직 검색 조건
 */
export interface SearchDutyVO {
  year?: number;
  month?: number;
  page?: number;
  size?: number;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 당직 유형 등록/수정 VO
 */
export interface DutyTypeVO {
  id?: number;
  name: string;
  color: string;
  description: string;
}

/**
 * 당직 배정 VO
 */
export interface DutyAssignmentVO {
  accountId: number;
  date: string;
  dutyTypeId: number;
}

/**
 * 당직 배정 수정 VO
 */
export interface DutyAssignmentUpdateVO {
  accountDutyId: number;
  dutyTypeId: number;
}
