/**
 * 작업지시(Work Order) API 클라이언트
 *
 * csp-was WorkOrderController 연동
 */

import { apiClient } from "./client";
import type {
  WorkOrderListResponse,
  WorkOrderViewDTO,
  SearchWorkOrderVO,
  WorkOrderVO,
  WorkOrderResultVO,
  WorkOrderDTO,
} from "@/lib/types/work-order";

// ============================================================================
// 작업지시 목록/조회
// ============================================================================

/**
 * 작업지시 목록 조회
 */
export async function getWorkOrderList(
  params: SearchWorkOrderVO & { page?: number; size?: number }
): Promise<WorkOrderListResponse> {
  const searchParams = new URLSearchParams();

  // 기간
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);

  // 필터
  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.regionId) searchParams.set("regionId", String(params.regionId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.buildingFloorId)
    searchParams.set("buildingFloorId", String(params.buildingFloorId));

  // 상태
  if (params.state) searchParams.set("state", params.state);
  if (params.states) params.states.forEach((s) => searchParams.append("states", s));

  // 유형
  if (params.type) searchParams.set("type", params.type);
  if (params.types) params.types.forEach((t) => searchParams.append("types", t));

  // 분류
  if (params.firstClassId)
    searchParams.set("firstClassId", String(params.firstClassId));
  if (params.secondClassId)
    searchParams.set("secondClassId", String(params.secondClassId));

  // 담당
  if (params.chargeAccountId)
    searchParams.set("chargeAccountId", String(params.chargeAccountId));
  if (params.buildingUserGroupId)
    searchParams.set("buildingUserGroupId", String(params.buildingUserGroupId));

  // 검색어
  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.searchType) searchParams.set("searchType", params.searchType);

  // 정렬
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.direction) searchParams.set("direction", params.direction);

  // 페이지네이션
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<WorkOrderListResponse>(
    `/api/workOrder/workOrderList?${searchParams.toString()}`
  );
}

/**
 * 작업지시 상세 조회
 */
export async function getWorkOrderView(
  type: "view" | "edit",
  id: number
): Promise<WorkOrderViewDTO> {
  return apiClient.get<WorkOrderViewDTO>(`/api/workOrder/orderView/${type}/${id}`);
}

/**
 * 작업지시 상태별 건수 조회
 */
export async function getWorkOrderStatePerCount(
  params: SearchWorkOrderVO
): Promise<Record<string, number>> {
  const searchParams = new URLSearchParams();

  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));

  return apiClient.get<Record<string, number>>(
    `/open/workOrder/workOrderStatePerCount?${searchParams.toString()}`
  );
}

// ============================================================================
// 작업지시 등록/수정
// ============================================================================

/**
 * 작업지시 등록
 */
export async function createWorkOrder(
  data: WorkOrderVO
): Promise<{ workOrderId: number }> {
  const formData = new FormData();

  // 기본 필드
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("firstClassId", String(data.firstClassId));
  formData.append("secondClassId", String(data.secondClassId));
  formData.append("type", data.type);
  formData.append("autoConfirm", String(data.autoConfirm));
  formData.append("planStartDate", data.planStartDate);
  formData.append("planEndDate", data.planEndDate);
  formData.append("deadline", String(data.deadline));
  formData.append("buildingId", String(data.buildingId));
  formData.append("buildingUserGroupId", String(data.buildingUserGroupId));
  formData.append("sendPush", String(data.sendPush));
  formData.append("vocSendPush", String(data.vocSendPush));

  // 옵션 필드
  if (data.buildingFloorId)
    formData.append("buildingFloorId", String(data.buildingFloorId));
  if (data.buildingFloorZoneId)
    formData.append("buildingFloorZoneId", String(data.buildingFloorZoneId));
  if (data.facilityId) formData.append("facilityId", String(data.facilityId));
  if (data.movieLinkUrl) formData.append("movieLinkUrl", data.movieLinkUrl);
  if (data.templateId) formData.append("templateId", String(data.templateId));

  // 담당자
  data.chargeAccountIds.forEach((id) =>
    formData.append("chargeAccountIds", String(id))
  );
  data.ccAccountIds?.forEach((id) => formData.append("ccAccountIds", String(id)));
  data.approveAccountIds?.forEach((id) =>
    formData.append("approveAccountIds", String(id))
  );

  // 파일
  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.postForm<{ workOrderId: number }>(
    "/api/workOrder/addOrder",
    formData
  );
}

/**
 * 작업지시 수정
 */
export async function updateWorkOrder(data: WorkOrderVO): Promise<WorkOrderDTO> {
  const formData = new FormData();

  if (data.id) formData.append("id", String(data.id));
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("firstClassId", String(data.firstClassId));
  formData.append("secondClassId", String(data.secondClassId));
  formData.append("type", data.type);
  formData.append("autoConfirm", String(data.autoConfirm));
  formData.append("planStartDate", data.planStartDate);
  formData.append("planEndDate", data.planEndDate);
  formData.append("deadline", String(data.deadline));
  formData.append("buildingId", String(data.buildingId));
  formData.append("buildingUserGroupId", String(data.buildingUserGroupId));
  formData.append("sendPush", String(data.sendPush));
  formData.append("vocSendPush", String(data.vocSendPush));

  if (data.buildingFloorId)
    formData.append("buildingFloorId", String(data.buildingFloorId));
  if (data.buildingFloorZoneId)
    formData.append("buildingFloorZoneId", String(data.buildingFloorZoneId));
  if (data.facilityId) formData.append("facilityId", String(data.facilityId));
  if (data.movieLinkUrl) formData.append("movieLinkUrl", data.movieLinkUrl);

  data.chargeAccountIds.forEach((id) =>
    formData.append("chargeAccountIds", String(id))
  );
  data.ccAccountIds?.forEach((id) => formData.append("ccAccountIds", String(id)));
  data.approveAccountIds?.forEach((id) =>
    formData.append("approveAccountIds", String(id))
  );

  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.putForm<WorkOrderDTO>("/api/workOrder/orderEdit", formData);
}

/**
 * 작업지시 복사
 */
export async function copyWorkOrder(workOrderId: number): Promise<WorkOrderDTO> {
  return apiClient.post<WorkOrderDTO>(
    `/api/workOrder/copyWorkOrder/${workOrderId}`,
    {}
  );
}

// ============================================================================
// 작업지시 상태 변경
// ============================================================================

/**
 * 작업지시 발행 (작성 → 발행)
 */
export async function issueWorkOrder(workOrderId: number): Promise<void> {
  return apiClient.put<void>(`/api/workOrder/issueWorkOrder/${workOrderId}`, {});
}

/**
 * 작업지시 완료 요청 (처리중 → 완료요청)
 */
export async function requestCompleteWorkOrder(
  workOrderId: number
): Promise<WorkOrderViewDTO> {
  return apiClient.put<WorkOrderViewDTO>(
    `/api/workOrder/requestComplete/${workOrderId}`,
    {}
  );
}

/**
 * 작업지시 승인 (완료요청 → 완료)
 */
export async function approveWorkOrder(
  data: WorkOrderResultVO
): Promise<WorkOrderViewDTO> {
  return apiClient.put<WorkOrderViewDTO>("/api/workOrder/approveWorkOrder", data);
}

/**
 * 작업지시 반려
 */
export async function denyWorkOrder(
  data: WorkOrderResultVO
): Promise<WorkOrderViewDTO> {
  return apiClient.put<WorkOrderViewDTO>("/api/workOrder/denyWorkOrder", data);
}

/**
 * 다중 완료 승인
 */
export async function approveMultiWorkOrder(
  workOrderIds: number[]
): Promise<void> {
  return apiClient.put<void>("/api/workOrder/updateMultiApprove", {
    workOrderIds,
  });
}

/**
 * 다중 취소
 */
export async function cancelMultiWorkOrder(workOrderIds: number[]): Promise<void> {
  return apiClient.put<void>("/api/workOrder/updateMultiCancel", {
    workOrderIds,
  });
}

// ============================================================================
// 작업지시 결과
// ============================================================================

/**
 * 작업지시 결과 등록
 */
export async function addWorkOrderResult(data: WorkOrderResultVO): Promise<void> {
  const formData = new FormData();

  formData.append("workOrderId", String(data.workOrderId));
  formData.append("description", data.description);
  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.postForm<void>("/api/workOrder/addWorkOrderResult", formData);
}

/**
 * 작업지시 결과 수정
 */
export async function updateWorkOrderResult(
  data: WorkOrderResultVO & { id: number }
): Promise<void> {
  const formData = new FormData();

  formData.append("id", String(data.id));
  formData.append("workOrderId", String(data.workOrderId));
  formData.append("description", data.description);
  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.putForm<void>("/api/workOrder/updateWorkOrderResult", formData);
}

// ============================================================================
// 엑셀 다운로드
// ============================================================================

/**
 * 수시업무 엑셀 다운로드
 */
export async function downloadWorkOrderListExcel(
  params: SearchWorkOrderVO
): Promise<Blob> {
  const searchParams = new URLSearchParams();

  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.state) searchParams.set("state", params.state);
  if (params.type) searchParams.set("type", params.type);

  return apiClient.getBlob(
    `/api/workOrder/workOrderListExcelDownload?${searchParams.toString()}`
  );
}
