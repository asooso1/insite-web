/**
 * 개인 작업지시(Personal Work Order) API 클라이언트
 *
 * csp-was PersonalWorkOrderController 연동
 */

import { apiClient } from "./client";
import type {
  PersonalWorkOrderListResponse,
  PersonalWorkOrderDetailDTO,
  SearchPersonalWorkOrderVO,
  PersonalWorkOrderVO,
  PersonalWorkOrderUpdateVO,
  PersonalWorkOrderConfirmVO,
} from "@/lib/types/personal-work-order";

// ============================================================================
// 개인 작업 목록/조회
// ============================================================================

/**
 * 개인 작업 목록 조회
 */
export async function getPersonalWorkOrderList(
  params: SearchPersonalWorkOrderVO & { page?: number; size?: number }
): Promise<PersonalWorkOrderListResponse> {
  const searchParams = new URLSearchParams();

  // 필터
  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.baseAreaId)
    searchParams.set("baseAreaId", String(params.baseAreaId));
  if (params.buildingId)
    searchParams.set("buildingId", String(params.buildingId));
  if (params.buildingUserGroupId)
    searchParams.set("buildingUserGroupId", String(params.buildingUserGroupId));
  if (params.writerId) searchParams.set("writerId", String(params.writerId));

  // 기간 검색
  if (params.type) searchParams.set("type", params.type);
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);

  // 상태
  if (params.state) searchParams.set("state", params.state);

  // 검색어
  if (params.searchCode) searchParams.set("searchCode", params.searchCode);
  if (params.keyword) searchParams.set("keyword", params.keyword);

  // 페이지네이션
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<PersonalWorkOrderListResponse>(
    `/api/personal/work-order?${searchParams.toString()}`
  );
}

/**
 * 개인 작업 상세 조회
 */
export async function getPersonalWorkOrderDetail(
  id: number
): Promise<PersonalWorkOrderDetailDTO> {
  return apiClient.get<PersonalWorkOrderDetailDTO>(
    `/api/personal/work-order/${id}`
  );
}

// ============================================================================
// 개인 작업 등록/수정
// ============================================================================

/**
 * 개인 작업 등록
 */
export async function createPersonalWorkOrder(
  data: PersonalWorkOrderVO
): Promise<{ personalWorkOrderId: number }> {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("confirmAccountId", String(data.confirmAccountId));
  formData.append("isAlertPush", String(data.isAlertPush));

  if (data.buildingId)
    formData.append("buildingId", String(data.buildingId));
  if (data.buildingFloorZoneId)
    formData.append("buildingFloorZoneId", String(data.buildingFloorZoneId));
  if (data.facilityId)
    formData.append("facilityId", String(data.facilityId));
  if (data.buildingUserGroupId)
    formData.append("buildingUserGroupId", String(data.buildingUserGroupId));

  data.files?.forEach((file) => formData.append("images", file));

  return apiClient.postForm<{ personalWorkOrderId: number }>(
    `/api/personal/work-order?type=create`,
    formData
  );
}

/**
 * 개인 작업 수정
 */
export async function updatePersonalWorkOrder(
  data: PersonalWorkOrderUpdateVO
): Promise<PersonalWorkOrderDetailDTO> {
  const formData = new FormData();

  formData.append("id", String(data.id));
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("confirmAccountId", String(data.confirmAccountId));
  formData.append("isAlertPush", String(data.isAlertPush));

  if (data.buildingId)
    formData.append("buildingId", String(data.buildingId));
  if (data.buildingFloorZoneId)
    formData.append("buildingFloorZoneId", String(data.buildingFloorZoneId));
  if (data.facilityId)
    formData.append("facilityId", String(data.facilityId));
  if (data.buildingUserGroupId)
    formData.append("buildingUserGroupId", String(data.buildingUserGroupId));

  data.additionalImages?.forEach((file) =>
    formData.append("additionalImages", file)
  );

  return apiClient.putForm<PersonalWorkOrderDetailDTO>(
    `/api/personal/work-order?type=update`,
    formData
  );
}

// ============================================================================
// 개인 작업 상태 변경
// ============================================================================

/**
 * 개인 작업 확인
 */
export async function confirmPersonalWorkOrder(
  data: PersonalWorkOrderConfirmVO
): Promise<PersonalWorkOrderDetailDTO> {
  return apiClient.post<PersonalWorkOrderDetailDTO>(
    `/api/personal/work-order?type=confirm`,
    data
  );
}
