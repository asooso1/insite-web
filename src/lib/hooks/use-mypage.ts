/**
 * 마이페이지 React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyInfo,
  updateMyInfo,
  changePassword,
} from "@/lib/api/mypage";
import type { MyInfoVO, PasswordChangeVO } from "@/lib/types/mypage";

// ============================================================================
// Query Keys
// ============================================================================

export const mypageKeys = {
  all: ["mypage"] as const,
  details: () => [...mypageKeys.all, "detail"] as const,
  myInfo: () => [...mypageKeys.details(), "myInfo"] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 내 정보 조회 훅
 */
export function useMyInfo() {
  return useQuery({
    queryKey: mypageKeys.myInfo(),
    queryFn: () => getMyInfo(),
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 내 정보 수정 훅
 */
export function useUpdateMyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MyInfoVO) => updateMyInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mypageKeys.myInfo() });
    },
  });
}

/**
 * 비밀번호 변경 훅
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordChangeVO) => changePassword(data),
  });
}
