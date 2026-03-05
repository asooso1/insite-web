/**
 * 메뉴(Menu) React Query 훅
 */

import { useQuery } from "@tanstack/react-query";
import { getMenuTree } from "@/lib/api/menu";

// ============================================================================
// Query Keys
// ============================================================================

export const menuKeys = {
  all: ["menus"] as const,
  trees: () => [...menuKeys.all, "tree"] as const,
  tree: (buildingId: string) => [...menuKeys.trees(), buildingId] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 빌딩별 메뉴 트리 조회 훅
 */
export function useMenuTree(buildingId: string | undefined) {
  return useQuery({
    queryKey: menuKeys.tree(buildingId ?? ""),
    queryFn: () => getMenuTree(buildingId!),
    enabled: !!buildingId,
    // 메뉴는 자주 변경되지 않으므로 5분 캐시
    staleTime: 5 * 60 * 1000,
  });
}
