/**
 * 역할(Role) API 클라이언트
 *
 * csp-was UserController 연동
 */

import { apiClient } from "./client";
import type {
  RoleDTO,
  RoleMenuAuthDTO,
  RoleAuthVO,
  RoleListResponse,
} from "@/lib/types/role";

// ============================================================================
// 역할 목록/조회
// ============================================================================

/**
 * 역할 목록 조회
 */
export async function getRoleDTOList(): Promise<RoleListResponse> {
  return apiClient.get<RoleListResponse>("/api/user/roleDTOList");
}

/**
 * 역할별 메뉴 권한 조회
 */
export async function getRoleMenuAuths(
  roleId: number
): Promise<RoleMenuAuthDTO[]> {
  return apiClient.get<RoleMenuAuthDTO[]>(
    `/api/user/roleMenuAuths/${roleId}`
  );
}

// ============================================================================
// 역할 권한 수정
// ============================================================================

/**
 * 역할 권한 수정
 */
export async function updateRoleAuth(data: RoleAuthVO): Promise<void> {
  return apiClient.put("/api/user/roleAuthEdit", data);
}
