/**
 * 제어(Control) API 클라이언트
 *
 * csp-was ControlController 연동
 */

import { apiClient } from "./client";
import type {
  ControlListResponse,
  ControlDTO,
  ControlVO,
  ControlRequestVO,
  SearchControlVO,
} from "@/lib/types/control";

// ============================================================================
// 제어 목록/조회
// ============================================================================

/**
 * 제어 목록 조회 (페이지네이션)
 */
export async function getControlList(
  params: SearchControlVO & { page?: number; size?: number }
): Promise<ControlListResponse> {
  const searchParams = new URLSearchParams();

  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.state) searchParams.set("state", params.state);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<ControlListResponse>(
    `/api/control/controlList?${searchParams.toString()}`
  );
}

/**
 * 제어 상세 조회
 */
export async function getControlView(id: number): Promise<ControlDTO> {
  return apiClient.get<ControlDTO>(`/api/control/controlView/${id}`);
}

// ============================================================================
// 제어 등록/수정
// ============================================================================

/**
 * 제어 등록
 */
export async function addControl(data: ControlVO): Promise<ControlDTO> {
  return apiClient.post<ControlDTO>("/api/control/controlAdd", data);
}

/**
 * 제어 수정
 */
export async function updateControl(data: ControlVO): Promise<ControlDTO> {
  return apiClient.put<ControlDTO>("/api/control/controlEdit", data);
}

// ============================================================================
// 제어 요청/취소/삭제
// ============================================================================

/**
 * 제어 요청 전송
 */
export async function sendControlRequest(data: ControlRequestVO): Promise<void> {
  return apiClient.put("/api/control/sendRequest", data);
}

/**
 * 제어 요청 취소
 */
export async function cancelControlRequest(data: ControlRequestVO): Promise<void> {
  return apiClient.put("/api/control/cancelRequest", data);
}

/**
 * 제어 삭제
 */
export async function deleteControlRequest(id: number): Promise<void> {
  return apiClient.delete(`/api/control/deleteRequest/${id}`);
}
