/**
 * 청소 관리(Cleaning) 관련 타입 정의
 *
 * csp-was CleaningController, CleanInfoDTO 기반
 */

// ============================================================================
// DTOs
// ============================================================================

/**
 * 청소업체 정보 DTO
 */
export interface CleanInfoDTO {
  id: number;
  companyName: string;
  contactName: string;
  phone: string;
  contractStart: string;
  contractEnd: string;
  area: string;
  buildingName: string;
  createdAt: string;
}

/**
 * 청소업체 목록 응답
 */
export interface CleanInfoListResponse {
  content: CleanInfoDTO[];
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
 * 청소업체 검색 조건
 */
export interface SearchCleanVO {
  keyword?: string;
  page?: number;
  size?: number;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 청소업체 등록/수정 VO
 */
export interface CleanInfoVO {
  id?: number;
  companyName: string;
  contactName: string;
  phone: string;
  contractStart: string;
  contractEnd: string;
  area: string;
}
