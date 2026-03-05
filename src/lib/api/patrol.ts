/**
 * 순찰(Patrol) API 클라이언트
 *
 * csp-was PatrolController 연동
 */

import { apiClient } from "./client";
import type {
  PatrolPlanDTO,
  PatrolPlanVO,
  PatrolTeamDTO,
  PatrolTeamVO,
  SearchPatrolPlanVO,
  SearchPatrolTeamVO,
  PatrolPlanListResponse,
  PatrolTeamListResponse,
} from "@/lib/types/patrol";

// ============================================================================
// 순찰 계획
// ============================================================================

/**
 * 순찰 계획 목록 조회
 */
export async function getPatrolList(
  params: SearchPatrolPlanVO
): Promise<PatrolPlanListResponse> {
  const searchParams = new URLSearchParams();
  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.teamId) searchParams.set("teamId", String(params.teamId));
  if (params.planType) searchParams.set("planType", params.planType);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  const qs = searchParams.toString();
  return apiClient.get<PatrolPlanListResponse>(
    `/api/patrol/patrolList${qs ? "?" + qs : ""}`
  );
}

/**
 * 순찰 계획 상세 조회
 */
export async function getPatrolPlan(patrolPlanId: number): Promise<PatrolPlanDTO> {
  return apiClient.get<PatrolPlanDTO>(`/api/patrol/patrolPlan/${patrolPlanId}`);
}

/**
 * 순찰 계획 등록
 */
export async function postPatrolPlan(data: PatrolPlanVO): Promise<void> {
  return apiClient.post<void>("/api/patrol/postPatrolPlan", data);
}

/**
 * 순찰 계획 수정
 */
export async function putPatrolPlan(data: PatrolPlanVO): Promise<void> {
  return apiClient.put<void>("/api/patrol/putPatrolPlan", data);
}

/**
 * 순찰 완료 처리
 */
export async function completePatrol(patrolPlanBuildingId: number): Promise<void> {
  return apiClient.put<void>(`/api/patrol/completePatrol/${patrolPlanBuildingId}`, {});
}

/**
 * 순찰 계획 건물 삭제
 */
export async function deletePatrolPlanBuilding(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/patrol/deletePatrolPlanBuilding/${id}`);
}

/**
 * 순찰 계획 담당자 삭제
 */
export async function deletePatrolPlanAccount(
  planId: number,
  accountId: number
): Promise<void> {
  return apiClient.delete<void>(
    `/api/patrol/deletePatrolPlanAccount/${planId}/${accountId}`
  );
}

// ============================================================================
// 순찰 팀
// ============================================================================

/**
 * 순찰 팀 목록 조회
 */
export async function getPatrolTeamList(
  params: SearchPatrolTeamVO
): Promise<PatrolTeamListResponse> {
  const searchParams = new URLSearchParams();
  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.teamState) searchParams.set("teamState", params.teamState);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  const qs = searchParams.toString();
  return apiClient.get<PatrolTeamListResponse>(
    `/api/patrol/patrolTeamList${qs ? "?" + qs : ""}`
  );
}

/**
 * 순찰 팀 상세 조회
 */
export async function getPatrolTeam(teamId: number): Promise<PatrolTeamDTO> {
  return apiClient.get<PatrolTeamDTO>(`/api/patrol/getPatrolTeam/${teamId}`);
}

/**
 * 순찰 팀 등록
 */
export async function postPatrolTeam(data: PatrolTeamVO): Promise<void> {
  return apiClient.post<void>("/api/patrol/postPatrolTeam", data);
}

/**
 * 순찰 팀 수정
 */
export async function putPatrolTeam(data: PatrolTeamVO): Promise<void> {
  return apiClient.put<void>("/api/patrol/putPatrolTeam", data);
}

/**
 * 순찰 팀 건물 삭제
 */
export async function deletePatrolTeamBuilding(
  teamId: number,
  buildingId: number
): Promise<void> {
  return apiClient.delete<void>(
    `/api/patrol/deletePatrolTeamBuilding/${teamId}/${buildingId}`
  );
}
