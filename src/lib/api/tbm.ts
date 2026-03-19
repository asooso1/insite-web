/**
 * TBM(작업전미팅) API 클라이언트
 *
 * csp-was WorkOrderController 연동
 */

import { apiClient } from "./client";
import type {
  TbmDTO,
  TbmListResponse,
  SearchTbmVO,
  TbmVO,
} from "@/lib/types/tbm";

// ============================================================================
// TBM 목록/조회
// ============================================================================

/**
 * TBM 목록 조회
 */
export async function getTbmList(
  params: SearchTbmVO & { page?: number; size?: number }
): Promise<TbmListResponse> {
  const searchParams = new URLSearchParams();

  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  // tbmType/tbmState/tbmUnit은 null이면 백엔드 NPE 발생 → "all" 기본값 전송
  searchParams.set("tbmType", params.tbmType || "all");
  searchParams.set("tbmState", params.tbmState || "all");
  searchParams.set("tbmUnit", "all"); // 프론트엔드에서 사용하지 않으나 백엔드 NPE 방지
  if (params.buildingUserGroupId)
    searchParams.set("buildingUserGroupId", String(params.buildingUserGroupId));
  // searchCode는 searchKeyword가 있을 때만 전송 (백엔드 NPE 방지)
  if (params.searchKeyword) {
    if (params.searchCode) searchParams.set("searchCode", params.searchCode);
    searchParams.set("searchKeyword", params.searchKeyword);
  }

  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<TbmListResponse>(
    `/api/workOrder/tbmList?${searchParams.toString()}`
  );
}

/**
 * TBM 상세 조회
 */
export async function getTbmView(id: number): Promise<TbmDTO> {
  return apiClient.get<TbmDTO>(`/api/workOrder/viewTbm/${id}`);
}

// ============================================================================
// TBM 등록/수정
// ============================================================================

/**
 * TBM 등록
 */
export async function createTbm(
  data: TbmVO
): Promise<{ tbmId: number }> {
  return apiClient.post<{ tbmId: number }>("/api/workOrder/addTbm", data);
}

/**
 * TBM 수정
 */
export async function updateTbm(
  id: number,
  data: TbmVO
): Promise<TbmDTO> {
  return apiClient.put<TbmDTO>("/api/workOrder/editTbm", {
    id,
    ...data,
  });
}
