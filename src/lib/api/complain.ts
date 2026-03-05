/**
 * 민원(Complain/VOC) API 클라이언트
 *
 * csp-was WorkOrderController 연동
 */

import { apiClient } from "./client";
import type {
  VocListResponse,
  VocDTO,
  SearchVocVO,
  VocVO,
} from "@/lib/types/complain";

// ============================================================================
// 민원 목록/조회
// ============================================================================

/**
 * 민원 목록 조회
 */
export async function getComplainList(
  params: SearchVocVO & { page?: number; size?: number }
): Promise<VocListResponse> {
  const searchParams = new URLSearchParams();

  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.buildingFloorId)
    searchParams.set("buildingFloorId", String(params.buildingFloorId));
  if (params.buildingFloorZoneId)
    searchParams.set("buildingFloorZoneId", String(params.buildingFloorZoneId));
  if (params.state) searchParams.set("state", params.state);
  if (params.searchCode) searchParams.set("searchCode", params.searchCode);
  if (params.searchKeyword) searchParams.set("searchKeyword", params.searchKeyword);
  if (params.writeDateFrom) searchParams.set("writeDateFrom", params.writeDateFrom);
  if (params.writeDateTo) searchParams.set("writeDateTo", params.writeDateTo);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<VocListResponse>(
    `/api/workOrder/complainList?${searchParams.toString()}`
  );
}

/**
 * 민원 상세 조회
 */
export async function getComplainView(id: number): Promise<VocDTO> {
  return apiClient.get<VocDTO>(`/api/workOrder/complainView/${id}`);
}

// ============================================================================
// 민원 등록
// ============================================================================

/**
 * 민원 등록
 */
export async function createComplain(
  data: VocVO
): Promise<{ vocId: number }> {
  const formData = new FormData();

  // 기본 필드
  formData.append("buildingId", String(data.buildingId));
  formData.append("buildingFloorId", String(data.buildingFloorId));
  formData.append("buildingFloorZoneId", String(data.buildingFloorZoneId));
  formData.append("vocUserName", data.vocUserName);
  formData.append("vocUserPhone", data.vocUserPhone);
  formData.append("vocDate", data.vocDate);
  formData.append("title", data.title);
  formData.append("requestContents", data.requestContents);

  // 파일
  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.postForm<{ vocId: number }>(
    "/api/workOrder/addComplain",
    formData
  );
}
