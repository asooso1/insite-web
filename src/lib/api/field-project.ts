/**
 * 현장프로젝트(Field Project) API 클라이언트
 *
 * csp-was FieldProjectController 연동
 */

import { apiClient } from "./client";
import type {
  FieldProjectDTO,
  FieldProjectCreateVO,
  FieldProjectAccountDTO,
  SearchFieldProjectVO,
  PageResponse,
} from "@/lib/types/field-project";

// ============================================================================
// 현장프로젝트 목록/조회
// ============================================================================

/**
 * 현장프로젝트 목록 조회 (페이지네이션)
 */
export async function getFieldProjectList(
  params: SearchFieldProjectVO & { page: number; size: number }
): Promise<PageResponse<FieldProjectDTO>> {
  const query = new URLSearchParams();

  if (params.buildingId) query.set("buildingId", String(params.buildingId));
  if (params.status) query.set("status", params.status);
  if (params.keyword) query.set("keyword", params.keyword);
  query.set("page", String(params.page));
  query.set("size", String(params.size));

  const res = await apiClient.get<PageResponse<FieldProjectDTO>>(
    `/api/field/projects?${query}`
  );
  return res;
}

/**
 * 현장프로젝트 상세 조회
 */
export async function getFieldProject(id: number): Promise<FieldProjectDTO> {
  const res = await apiClient.get<FieldProjectDTO>(
    `/api/field/projects/${id}`
  );
  return res;
}

/**
 * 현장프로젝트 등록
 */
export async function createFieldProject(
  data: FieldProjectCreateVO
): Promise<{ id: number }> {
  const res = await apiClient.post<{ id: number }>(
    "/api/field/projects",
    data
  );
  return res;
}

/**
 * 현장프로젝트 수정
 */
export async function updateFieldProject(
  id: number,
  data: Partial<FieldProjectCreateVO>
): Promise<void> {
  await apiClient.put(`/api/field/projects/${id}`, data);
}

/**
 * 현장프로젝트 삭제
 */
export async function deleteFieldProject(id: number): Promise<void> {
  await apiClient.delete(`/api/field/projects/${id}`);
}

/**
 * 현장프로젝트 참여자 목록 조회
 */
export async function getFieldProjectAccounts(
  projectId: number
): Promise<FieldProjectAccountDTO[]> {
  const res = await apiClient.get<FieldProjectAccountDTO[]>(
    `/api/field/projects/${projectId}/accounts`
  );
  return res;
}
