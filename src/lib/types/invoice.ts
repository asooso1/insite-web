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
 * 서비스 요금 청구서 상태 (ServiceCostType)
 */
export const ServiceCostType = {
  CHARGE: "CHARGE",
  PAYED: "PAYED",
  CANCEL: "CANCEL",
} as const;

export type ServiceCostType = (typeof ServiceCostType)[keyof typeof ServiceCostType];

export const ServiceCostTypeLabel: Record<ServiceCostType, string> = {
  CHARGE: "청구",
  PAYED: "결제",
  CANCEL: "취소",
};

/**
 * 서비스 요금 청구서 검색 조건
 */
export interface SearchServiceChargeVO {
  keyword?: string;
  chargeDateFrom?: string;
  chargeDateTo?: string;
  state?: ServiceCostType | "";
  page?: number;
  size?: number;
}

// ============================================================================
// API Response
// ============================================================================

export type ServiceChargeListResponse = PageResponse<ServiceChargeDTO>;
