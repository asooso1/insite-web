/**
 * 개인정보정책(Privacy Policy) 관련 타입 정의
 *
 * csp-was PrivacyController 기반
 * - 정책 조회/수정/삭제
 * - 빌딩별 정책 관리
 */

// ============================================================================
// DTOs
// ============================================================================

/**
 * 개인정보정책 DTO
 */
export interface PrivacyDTO {
  id: number;
  content: string;
  effectiveDate: string;
  buildingName?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

// ============================================================================
// Create/Update VOs
// ============================================================================

/**
 * 개인정보정책 등록/수정 VO
 */
export interface PrivacyVO {
  id?: number;
  content: string;
  effectiveDate: string;
}
