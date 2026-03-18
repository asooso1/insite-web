/**
 * 역할(Role) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoleDTOList,
  getRoleMenuAuths,
  updateRoleAuth,
} from "@/lib/api/role";
import type { RoleAuthVO } from "@/lib/types/role";

// ============================================================================
// Query Keys
// ============================================================================

export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  details: () => [...roleKeys.all, "detail"] as const,
  detail: (id: number) => [...roleKeys.details(), id] as const,
  menuAuths: (roleId: number) =>
    [...roleKeys.all, "menuAuths", roleId] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 역할 목록 조회 훅
 */
export function useRoleList() {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: () => getRoleDTOList(),
    staleTime: 30 * 1000, // 30초 - 목록 쿼리 표준
  });
}

/**
 * 역할별 메뉴 권한 조회 훅
 */
export function useRoleMenuAuths(roleId: number) {
  return useQuery({
    queryKey: roleKeys.menuAuths(roleId),
    queryFn: () => getRoleMenuAuths(roleId),
    enabled: roleId > 0,
    staleTime: 60 * 1000, // 1분 - 상세 쿼리 표준
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 역할 권한 수정 훅
 */
export function useUpdateRoleAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleAuthVO) => updateRoleAuth(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.menuAuths(variables.roleId),
      });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}
