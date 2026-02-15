/**
 * 사용자(User) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserList,
  getUserView,
  checkUserId,
  addUser,
  updateUser,
  deleteUser,
  resetPassword,
  getRoleList,
} from "@/lib/api/user";
import type { SearchUserVO, UserVO } from "@/lib/types/user";

// ============================================================================
// Query Keys
// ============================================================================

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: SearchUserVO & { page?: number; size?: number }) =>
    [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  checkUserId: (userId: string) =>
    [...userKeys.all, "checkUserId", userId] as const,
  roles: () => [...userKeys.all, "roles"] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 사용자 목록 조회 훅 (페이지네이션)
 */
export function useUserList(
  params: SearchUserVO & { page?: number; size?: number }
) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUserList(params),
  });
}

/**
 * 사용자 상세 조회 훅
 */
export function useUserView(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserView(id),
    enabled: id > 0,
  });
}

/**
 * 아이디 중복 확인 훅
 */
export function useCheckUserId(userId: string) {
  return useQuery({
    queryKey: userKeys.checkUserId(userId),
    queryFn: () => checkUserId(userId),
    enabled: userId.length >= 4,
  });
}

/**
 * 역할 목록 조회 훅
 */
export function useRoleList() {
  return useQuery({
    queryKey: userKeys.roles(),
    queryFn: () => getRoleList(),
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 사용자 등록 훅
 */
export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserVO) => addUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

/**
 * 사용자 수정 훅
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserVO) => updateUser(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: userKeys.detail(variables.id),
        });
      }
    },
  });
}

/**
 * 사용자 삭제 훅
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

/**
 * 비밀번호 초기화 훅
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (id: number) => resetPassword(id),
  });
}
