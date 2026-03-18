/**
 * 임차(Rental) API 클라이언트
 *
 * csp-was RentalController 연동
 */

import { apiClient } from "./client";
import type {
  SearchRentalVO,
  RentalDTO,
  RentalVO,
  RentalListResponse,
} from "@/lib/types/rental";

// ============================================================================
// 임차 목록/조회
// ============================================================================

/**
 * 임차 관리 목록 조회 (페이지네이션)
 */
export async function getRentalList(
  params: SearchRentalVO
): Promise<RentalListResponse> {
  const searchParams = new URLSearchParams();
  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  const qs = searchParams.toString();
  return apiClient.get<RentalListResponse>(
    `/api/site/rentalList${qs ? "?" + qs : ""}`
  );
}

/**
 * 임차 관리 상세 조회
 */
export async function getRentalView(id: number): Promise<RentalDTO> {
  return apiClient.get<RentalDTO>(`/api/site/rentalView/${id}`);
}

// ============================================================================
// 임차 등록/수정/삭제
// ============================================================================

/**
 * 임차 관리 등록 (JSON body)
 */
export async function addRental(data: RentalVO): Promise<void> {
  return apiClient.post<void>("/api/site/rentalAdd", data);
}

/**
 * 임차 관리 수정 (JSON body)
 */
export async function editRental(data: RentalVO & { id: number }): Promise<void> {
  return apiClient.put<void>("/api/site/rentalEdit", data);
}

/**
 * 임차 관리 삭제
 */
export async function deleteRental(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/site/rentalEdit/${id}`);
}
