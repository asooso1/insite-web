/**
 * 당직 관리(Duty) API 클라이언트
 *
 * csp-was DutyController 연동
 */

import { apiClient } from "./client";
import type {
  DutyTypeDTO,
  DutyAssignmentDTO,
  DutyListResponse,
  DutyAssignmentListResponse,
  SearchDutyVO,
  DutyTypeVO,
  DutyAssignmentVO,
  DutyAssignmentUpdateVO,
} from "@/lib/types/duty";

// ============================================================================
// 당직 유형 조회
// ============================================================================

/**
 * 당직 유형 목록 조회
 */
export async function getDuties(
  params: SearchDutyVO & { page?: number; size?: number } = {}
): Promise<DutyListResponse> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<DutyListResponse>(
    `/api/duties?${searchParams.toString()}`
  );
}

// ============================================================================
// 당직 유형 등록/수정
// ============================================================================

/**
 * 당직 유형 등록
 */
export async function addDutyType(data: DutyTypeVO): Promise<DutyTypeDTO> {
  return apiClient.post<DutyTypeDTO>("/api/duties", data);
}

/**
 * 당직 유형 수정
 */
export async function updateDutyType(data: DutyTypeVO): Promise<DutyTypeDTO> {
  return apiClient.put<DutyTypeDTO>("/api/duties", data);
}

// ============================================================================
// 당직 배정 조회
// ============================================================================

/**
 * 계정별 당직 배정 조회
 */
export async function getAccountDuties(
  year: number,
  month: number,
  params: { page?: number; size?: number } = {}
): Promise<DutyAssignmentListResponse> {
  const searchParams = new URLSearchParams();

  searchParams.set("year", String(year));
  searchParams.set("month", String(month));
  searchParams.set("type", "table");

  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<DutyAssignmentListResponse>(
    `/api/duties/accounts?${searchParams.toString()}`
  );
}

// ============================================================================
// 당직 배정 등록/수정/삭제
// ============================================================================

/**
 * 당직 배정
 */
export async function assignDuty(data: DutyAssignmentVO): Promise<DutyAssignmentDTO> {
  return apiClient.post<DutyAssignmentDTO>("/api/duties/accounts", data);
}

/**
 * 당직 배정 수정
 */
export async function updateAssignedDuty(
  data: DutyAssignmentUpdateVO
): Promise<DutyAssignmentDTO> {
  return apiClient.put<DutyAssignmentDTO>("/api/duties/accounts", data);
}

/**
 * 당직 배정 삭제
 */
export async function deleteAssignedDuty(accountDutyId: number): Promise<void> {
  const searchParams = new URLSearchParams();
  searchParams.set("accountDutyId", String(accountDutyId));

  return apiClient.delete<void>(
    `/api/duties/accounts?${searchParams.toString()}`
  );
}
