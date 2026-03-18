/**
 * 청소 관리(Cleaning) API 클라이언트
 *
 * csp-was CleaningController 연동
 */

import { apiClient } from "./client";
import type {
  CleanInfoDTO,
  CleanInfoListResponse,
  SearchCleanVO,
  CleanInfoVO,
} from "@/lib/types/cleaning";

// ============================================================================
// 청소업체 조회
// ============================================================================

/**
 * 청소업체 목록 조회
 */
export async function getCleanInfoList(
  params: SearchCleanVO & { page?: number; size?: number } = {}
): Promise<CleanInfoListResponse> {
  const searchParams = new URLSearchParams();

  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<CleanInfoListResponse>(
    `/api/service/cleanInfoList?${searchParams.toString()}`
  );
}

/**
 * 청소업체 상세 조회
 */
export async function getCleaningBimView(id: number): Promise<CleanInfoDTO> {
  return apiClient.get<CleanInfoDTO>(`/api/service/cleaningBimView/${id}`);
}

// ============================================================================
// 청소업체 등록/수정
// ============================================================================

/**
 * 청소업체 등록
 */
export async function addCleaningBim(data: CleanInfoVO): Promise<CleanInfoDTO> {
  return apiClient.post<CleanInfoDTO>("/api/service/cleaningBimAdd", data);
}

/**
 * 청소업체 수정
 */
export async function editCleaningBim(data: CleanInfoVO): Promise<CleanInfoDTO> {
  return apiClient.put<CleanInfoDTO>("/api/service/cleaningBimEdit", data);
}

/**
 * 청소업체 삭제
 */
export async function deleteCleaningBim(cleanInfoId: number): Promise<void> {
  return apiClient.delete<void>(
    `/api/service/cleaningBimDel/${cleanInfoId}`
  );
}
