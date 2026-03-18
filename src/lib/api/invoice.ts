/**
 * 청구서(Invoice) API 클라이언트
 *
 * csp-was InvoiceController 연동
 */

import { apiClient } from "./client";
import type {
  SearchServiceChargeVO,
  ServiceChargeDTO,
  ServiceChargeVO,
  ServiceChargeListResponse,
} from "@/lib/types/invoice";

// ============================================================================
// 청구서 목록/조회
// ============================================================================

/**
 * 서비스 요금 청구서 목록 조회 (페이지네이션)
 */
export async function getServiceChargeList(
  params: SearchServiceChargeVO
): Promise<ServiceChargeListResponse> {
  const searchParams = new URLSearchParams();
  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  const qs = searchParams.toString();
  return apiClient.get<ServiceChargeListResponse>(
    `/api/invoice/serviceChargeList${qs ? "?" + qs : ""}`
  );
}

/**
 * 서비스 요금 청구서 상세 조회
 */
export async function getServiceChargeView(id: number): Promise<ServiceChargeDTO> {
  return apiClient.get<ServiceChargeDTO>(`/api/invoice/serviceChargeView/${id}`);
}

// ============================================================================
// 청구서 등록/수정/삭제
// ============================================================================

/**
 * 서비스 요금 청구서 등록 (JSON body)
 */
export async function addServiceCharge(data: ServiceChargeVO): Promise<void> {
  return apiClient.post<void>("/api/invoice/serviceChargeAdd", data);
}

/**
 * 서비스 요금 청구서 수정 (JSON body)
 */
export async function editServiceCharge(data: ServiceChargeVO & { id: number }): Promise<void> {
  return apiClient.put<void>("/api/invoice/serviceChargeEdit", data);
}

/**
 * 서비스 요금 청구서 삭제
 */
export async function deleteServiceCharge(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/invoice/serviceChargeEdit/${id}`);
}
