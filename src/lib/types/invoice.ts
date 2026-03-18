/**
 * 청구서(Invoice) 관련 타입 정의
 *
 * csp-was InvoiceController, ServiceChargeDTO 기반
 */

import type { PageResponse } from "./facility";

// ============================================================================
// DTOs
// ============================================================================

/**
 * 서비스 요금 청구서 DTO
 */
export interface ServiceChargeDTO {
  id: number;
  title: string;
  amount: number;
  month: string;
  note: string;
  buildingName: string;
  createdAt: string;
}

// ============================================================================
// VOs (Create/Update)
// ============================================================================

/**
 * 서비스 요금 청구서 등록/수정 VO
 */
export interface ServiceChargeVO {
  title: string;
  amount: number;
  month: string;
  note: string;
}

// ============================================================================
// Search VO
// ============================================================================

/**
 * 서비스 요금 청구서 검색 조건
 */
export interface SearchServiceChargeVO {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

// ============================================================================
// API Response
// ============================================================================

export type ServiceChargeListResponse = PageResponse<ServiceChargeDTO>;
