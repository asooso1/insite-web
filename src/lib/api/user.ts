/**
 * 사용자(User) API 클라이언트
 *
 * csp-was UserController 연동
 */

import { apiClient } from "./client";
import type {
  UserListResponse,
  AccountDTO,
  RoleDTO,
  SearchUserVO,
  UserVO,
} from "@/lib/types/user";

// ============================================================================
// 사용자 목록/조회
// ============================================================================

/**
 * 사용자 목록 조회 (페이지네이션)
 */
export async function getUserList(
  params: SearchUserVO & { page?: number; size?: number }
): Promise<UserListResponse> {
  const searchParams = new URLSearchParams();

  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.wideAreaId) searchParams.set("wideAreaId", String(params.wideAreaId));
  if (params.baseAreaId) searchParams.set("baseAreaId", String(params.baseAreaId));
  if (params.writeDateFrom) searchParams.set("writeDateFrom", params.writeDateFrom);
  if (params.writeDateTo) searchParams.set("writeDateTo", params.writeDateTo);
  if (params.searchCode) searchParams.set("searchCode", params.searchCode);
  if (params.searchKeyword) searchParams.set("searchKeyword", params.searchKeyword);
  if (params.roleId) searchParams.set("roleId", String(params.roleId));
  if (params.accountState) searchParams.set("accountState", params.accountState);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<UserListResponse>(
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
 * 사용자 아이디 중복 확인
 */
export async function checkUserId(userId: string): Promise<boolean> {
  return apiClient.get<boolean>(`/api/user/userAdd/isUserId?userId=${userId}`);
}

// ============================================================================
// 사용자 등록/수정/삭제
// ============================================================================

/**
 * 사용자 등록
 */
export async function addUser(data: UserVO): Promise<AccountDTO> {
  return apiClient.post<AccountDTO>("/api/user/userAdd", data);
}

/**
 * 사용자 수정
 */
export async function editUser(data: UserVO): Promise<AccountDTO> {
  return apiClient.put<AccountDTO>("/api/user/userEdit", data);
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
export async function resetPassword(data: UserVO): Promise<boolean> {
  return apiClient.put<boolean>("/api/user/userEdit/password", data);
}

// ============================================================================
// 역할
// ============================================================================

/**
 * 역할 목록 조회 (전체)
 */
export async function getRoleList(): Promise<RoleDTO[]> {
  return apiClient.get<RoleDTO[]>("/open/user/roleList");
}

/**
 * 사용자 등록 시 선택 가능한 역할 목록
 */
export async function getRegisterRoleList(): Promise<RoleDTO[]> {
  return apiClient.get<RoleDTO[]>("/api/user/userAdd/role-list");
}

// ============================================================================
// 엑셀 다운로드
// ============================================================================

/**
 * 사용자 목록 엑셀 다운로드
 */
export async function downloadUserListExcel(
  params: SearchUserVO
): Promise<Blob> {
  const searchParams = new URLSearchParams();

  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.accountState) searchParams.set("accountState", params.accountState);
  if (params.searchKeyword) searchParams.set("searchKeyword", params.searchKeyword);

  return apiClient.getBlob(
    `/api/user/userListExcelDownload?${searchParams.toString()}`
  );
}
