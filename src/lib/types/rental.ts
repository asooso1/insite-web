/**
 * 임차(Rental) 관련 타입 정의
 *
 * csp-was RentalController, RentalDTO 기반
 */

import type { PageResponse } from "./facility";

// ============================================================================
// DTOs
// ============================================================================

/**
 * 임차 관리 DTO
 */
export interface RentalDTO {
  id: number;
  companyName: string;
  tenantName: string;
  floor: string;
  area: number;
  contractStart: string;
  contractEnd: string;
  rentAmount: number;
  buildingName: string;
  createdAt: string;
}

// ============================================================================
// VOs (Create/Update)
// ============================================================================

/**
 * 임차 관리 등록/수정 VO
 */
export interface RentalVO {
  companyName: string;
  tenantName: string;
  floor: string;
  area: number;
  contractStart: string;
  contractEnd: string;
  rentAmount: number;
}

// ============================================================================
// Search VO
// ============================================================================

/**
 * 임차 관리 검색 조건
 */
export interface SearchRentalVO {
  keyword?: string;
  page?: number;
  size?: number;
}

// ============================================================================
// API Response
// ============================================================================

export type RentalListResponse = PageResponse<RentalDTO>;
