/**
 * SOP(표준운영절차) API 클라이언트
 *
 * csp-was WorkOrderController - sopXxx 엔드포인트 연동
 */

import { apiClient } from "./client";
import type {
  SopListResponse,
  SopDTO,
  SearchSopVO,
  SopVO,
} from "@/lib/types/sop";

// ============================================================================
// SOP 목록/조회
// ============================================================================

/**
 * SOP 목록 조회
 */
export async function getSopList(
  params: SearchSopVO
): Promise<SopListResponse> {
  const searchParams = new URLSearchParams();

  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.facilityCategoryId)
    searchParams.set("facilityCategoryId", String(params.facilityCategoryId));
  if (params.sopState) searchParams.set("sopState", params.sopState);
  if (params.searchCode) searchParams.set("searchCode", params.searchCode);
  if (params.searchKeyword) searchParams.set("searchKeyword", params.searchKeyword);
  if (params.writeDateFrom) searchParams.set("writeDateFrom", params.writeDateFrom);
  if (params.writeDateTo) searchParams.set("writeDateTo", params.writeDateTo);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<SopListResponse>(
    `/api/workOrder/sopList?${searchParams.toString()}`
  );
}

/**
 * SOP 상세 조회
 */
export async function getSopView(id: number): Promise<SopDTO> {
  return apiClient.get<SopDTO>(`/api/workOrder/sopView/${id}`);
}

// ============================================================================
// SOP 등록/수정
// ============================================================================

/**
 * SOP 등록
 */
export async function createSop(
  data: SopVO
): Promise<{ sopId: number }> {
  const formData = new FormData();

  // 기본 필드
  formData.append("title", data.title);
  if (data.explain) formData.append("explain", data.explain);
  formData.append("facilityCategoryId", String(data.facilityCategoryId));
  formData.append("sopState", data.sopState);
  formData.append("sopKeyWord", data.sopKeyWord);
  formData.append("useSopCommonImg", String(data.useSopCommonImg));
  formData.append("buildingId", String(data.buildingId));

  // 작업순서 배열 (JSON 직렬화)
  formData.append("sopJobOrders", JSON.stringify(data.sopJobOrders));

  // 이미지 파일
  if (data.imgFile) {
    formData.append("imgFile", data.imgFile);
  }

  return apiClient.postForm<{ sopId: number }>(
    "/api/workOrder/sopAdd",
    formData
  );
}

/**
 * SOP 수정
 */
export async function updateSop(
  id: number,
  data: SopVO
): Promise<void> {
  const formData = new FormData();

  // ID 포함
  formData.append("id", String(id));

  // 기본 필드
  formData.append("title", data.title);
  if (data.explain) formData.append("explain", data.explain);
  formData.append("facilityCategoryId", String(data.facilityCategoryId));
  formData.append("sopState", data.sopState);
  formData.append("sopKeyWord", data.sopKeyWord);
  formData.append("useSopCommonImg", String(data.useSopCommonImg));
  formData.append("buildingId", String(data.buildingId));

  // 작업순서 배열 (JSON 직렬화)
  formData.append("sopJobOrders", JSON.stringify(data.sopJobOrders));

  // 이미지 파일
  if (data.imgFile) {
    formData.append("imgFile", data.imgFile);
  }

  return apiClient.putForm<void>("/api/workOrder/sopEdit", formData);
}
