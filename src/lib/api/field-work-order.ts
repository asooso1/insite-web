/**
 * 현장작업지시(Field Work Order) API 클라이언트
 *
 * csp-was FieldWorkOrderController 연동
 */

import { apiClient } from "./client";
import type {
  FieldWorkOrderDTO,
  FieldWorkOrderDetailDTO,
  FieldWorkOrderCreateVO,
  SearchFieldWorkOrderVO,
  PageResponse,
} from "@/lib/types/field-work-order";

// ============================================================================
// 현장작업지시 목록/조회
// ============================================================================

/**
 * 현장작업지시 목록 조회 (페이지네이션)
 */
export async function getFieldWorkOrderList(
  params: SearchFieldWorkOrderVO & { page: number; size: number }
): Promise<PageResponse<FieldWorkOrderDTO>> {
  const query = new URLSearchParams();

  if (params.projectId) query.set("projectId", String(params.projectId));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.status) query.set("status", params.status);
  if (params.priority) query.set("priority", params.priority);
  if (params.startDate) query.set("startDate", params.startDate);
  if (params.endDate) query.set("endDate", params.endDate);
  query.set("page", String(params.page));
  query.set("size", String(params.size));

  const res = await apiClient.get<PageResponse<FieldWorkOrderDTO>>(
    `/api/field/work-orders/search?${query}`
  );
  return res;
}

/**
 * 현장작업지시 상세 조회
 */
export async function getFieldWorkOrder(
  id: number
): Promise<FieldWorkOrderDetailDTO> {
  const res = await apiClient.get<FieldWorkOrderDetailDTO>(
    `/api/field/work-orders/${id}`
  );
  return res;
}

/**
 * 현장작업지시 등록
 */
export async function createFieldWorkOrder(
  data: FieldWorkOrderCreateVO
): Promise<{ id: number }> {
  const res = await apiClient.post<{ id: number }>(
    "/api/field/work-orders",
    data
  );
  return res;
}

/**
 * 현장작업지시 수정
 */
export async function updateFieldWorkOrder(
  id: number,
  data: Partial<FieldWorkOrderCreateVO>
): Promise<void> {
  await apiClient.put(`/api/field/work-orders/${id}`, data);
}

// ============================================================================
// 현장작업지시 댓글
// ============================================================================

/**
 * 현장작업지시 댓글 등록
 */
export async function addFieldWorkOrderComment(
  workOrderId: number,
  content: string
): Promise<void> {
  await apiClient.post(`/api/field/work-orders/${workOrderId}/comments`, {
    content,
  });
}

/**
 * 현장작업지시 댓글 삭제
 */
export async function deleteFieldWorkOrderComment(
  workOrderId: number,
  commentId: number
): Promise<void> {
  await apiClient.delete(
    `/api/field/work-orders/${workOrderId}/comments/${commentId}`
  );
}
