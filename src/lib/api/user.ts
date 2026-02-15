/**
 * 사용자(User) API 클라이언트
 *
 * csp-was UserController 연동
 */

import { apiClient } from "./client";
import type {
  AccountDTO,
  RoleDTO,
  SearchUserVO,
  UserVO,
  PageResponse,
} from "@/lib/types/user";

// ============================================================================
// 사용자 목록/조회
// ============================================================================

/**
 * 사용자 목록 조회 (페이지네이션)
 */
export async function getUserList(
  params: SearchUserVO & { page?: number; size?: number }
): Promise<PageResponse<AccountDTO>> {
  const searchParams = new URLSearchParams();

  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.state) searchParams.set("state", params.state);
  if (params.roleId) searchParams.set("roleId", String(params.roleId));
  if (params.searchCode) searchParams.set("searchCode", params.searchCode);
  if (params.searchKeyword) searchParams.set("searchKeyword", params.searchKeyword);
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.dateType) searchParams.set("dateType", params.dateType);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<PageResponse<AccountDTO>>(
    `/api/user/userList?${searchParams.toString()}`
  );
}

/**
 * 사용자 상세 조회
 */
export async function getUserView(id: number): Promise<AccountDTO> {
  return apiClient.get<AccountDTO>(`/api/user/userView?id=${id}`);
}

/**
 * 아이디 중복 확인
 */
export async function checkUserId(userId: string): Promise<boolean> {
  return apiClient.get<boolean>(
    `/api/user/userAdd/isUserId?userId=${encodeURIComponent(userId)}`
  );
}

// ============================================================================
// 사용자 등록/수정/삭제
// ============================================================================

/**
 * 사용자 등록
 */
export async function addUser(data: UserVO): Promise<void> {
  return apiClient.post<void>("/api/user/userAdd", data);
}

/**
 * 사용자 수정
 */
export async function updateUser(data: UserVO): Promise<void> {
  return apiClient.put<void>("/api/user/userEdit", data);
}

/**
 * 사용자 삭제
 */
export async function deleteUser(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/user/userEdit?id=${id}`);
}

/**
 * 비밀번호 초기화
 */
export async function resetPassword(id: number): Promise<void> {
  return apiClient.put<void>("/api/user/userEdit/password", { id });
}

// ============================================================================
// 역할
// ============================================================================

/**
 * 역할 목록 조회
 */
export async function getRoleList(): Promise<RoleDTO[]> {
  return apiClient.get<RoleDTO[]>("/open/user/roleList");
}
