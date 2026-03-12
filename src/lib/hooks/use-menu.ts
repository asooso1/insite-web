/**
 * 메뉴(Menu) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  getMenuTree,
  getAllMenus,
  getMenuPageInfo,
  evictMenuCache,
  getMenuMappings,
  saveMenuMapping,
  deleteMenuMapping,
  getMenuOverrides,
  saveMenuOverride,
  deleteMenuOverride,
} from "@/lib/api/menu";
import { enrichMenuWithStatus } from "@/lib/utils/menu-status-mapper";
import type {
  MenuDTO,
  MenuWithStatus,
  PageInfoDTO,
  MenuUrlMappingStore,
  MenuOverride,
  MenuOverrideStore,
} from "@/lib/types/menu";

// ============================================================================
// Query Keys
// ============================================================================

export const menuKeys = {
  all: ["menus"] as const,
  list: () => [...menuKeys.all, "list"] as const,
  allMenus: () => [...menuKeys.all, "all"] as const,
  byBuilding: (buildingId: string) =>
    [...menuKeys.all, "building", buildingId] as const,
  pageInfo: (pageInfoId: number) => ["pageInfo", pageInfoId] as const,
  mappings: () => [...menuKeys.all, "mappings"] as const,
  overrides: () => [...menuKeys.all, "overrides"] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 빌딩별 메뉴 트리 조회 훅
 * staleTime: 5분
 */
export function useMenuTree(buildingId: string | undefined) {
  return useQuery({
    queryKey: menuKeys.byBuilding(buildingId ?? ""),
    queryFn: () => getMenuTree(buildingId!),
    enabled: !!buildingId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 전체 메뉴 목록 조회 훅 (관리자용)
 * staleTime: 5분
 */
export function useAllMenus() {
  return useQuery({
    queryKey: menuKeys.allMenus(),
    queryFn: getAllMenus,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 페이지 정보 조회 훅
 * staleTime: 5분
 * enabled: pageInfoId > 0일 때만 실행
 */
export function useMenuPageInfo(pageInfoId: number) {
  return useQuery({
    queryKey: menuKeys.pageInfo(pageInfoId),
    queryFn: () => getMenuPageInfo(pageInfoId),
    enabled: pageInfoId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 메뉴 URL 매핑 조회 훅
 * staleTime: Infinity (거의 변경 없음)
 */
export function useMenuMappings() {
  return useQuery({
    queryKey: menuKeys.mappings(),
    queryFn: getMenuMappings,
    staleTime: Infinity,
  });
}

/**
 * 메뉴 오버라이드 조회 훅
 * staleTime: Infinity (거의 변경 없음)
 */
export function useMenuOverrides() {
  return useQuery({
    queryKey: menuKeys.overrides(),
    queryFn: getMenuOverrides,
    staleTime: Infinity,
  });
}

/**
 * 메뉴 + 연결 상태 조회 훅
 * useAllMenus + useMenuMappings + useMenuOverrides 조합
 * 메뉴를 상태 정보와 함께 반환
 */
export function useMenuWithStatus() {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const menusQuery = useAllMenus();
  const mappingsQuery = useMenuMappings();
  const overridesQuery = useMenuOverrides();

  // 인증 초기화 전이거나 로딩 중이면 로딩 상태 반환
  if (!isInitialized || menusQuery.isLoading || mappingsQuery.isLoading || overridesQuery.isLoading) {
    return {
      menus: [],
      isLoading: true,
      isError: false,
      error: null,
    };
  }

  if (menusQuery.isError) {
    return {
      menus: [],
      isLoading: false,
      isError: true,
      error: menusQuery.error,
    };
  }

  if (mappingsQuery.isError) {
    return {
      menus: [],
      isLoading: false,
      isError: true,
      error: mappingsQuery.error,
    };
  }

  if (overridesQuery.isError) {
    return {
      menus: [],
      isLoading: false,
      isError: true,
      error: overridesQuery.error,
    };
  }

  const menus = menusQuery.data || [];
  const mappingStore = mappingsQuery.data || { mappings: [], lastUpdated: "" };
  const overrideStore = overridesQuery.data || { overrides: [], lastUpdated: "" };

  const enrichedMenus = enrichMenuWithStatus(
    menus,
    mappingStore.mappings,
    overrideStore.overrides
  );

  return {
    menus: enrichedMenus,
    isLoading: false,
    isError: false,
    error: null,
  };
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 메뉴 캐시 초기화 훅
 * 성공 시 menuKeys.list() 무효화
 */
export function useEvictMenuCache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evictMenuCache,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.allMenus() });
    },
  });
}

/**
 * 메뉴 URL 매핑 저장 훅
 * 성공 시 menuKeys.mappings() 무효화
 */
export function useSaveMenuMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      menuId,
      menuName,
      cspWasUrl,
      insiteWebUrl,
    }: {
      menuId: number;
      menuName: string;
      cspWasUrl: string;
      insiteWebUrl: string;
    }) => saveMenuMapping(menuId, menuName, cspWasUrl, insiteWebUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.mappings() });
    },
  });
}

/**
 * 메뉴 URL 매핑 삭제 훅
 * 성공 시 menuKeys.mappings() 무효화
 */
export function useDeleteMenuMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (menuId: number) => deleteMenuMapping(menuId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.mappings() });
    },
  });
}

/**
 * 메뉴 오버라이드 저장 훅
 * 성공 시 menuKeys.overrides() + allMenus() 무효화
 */
export function useSaveMenuOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (override: Omit<MenuOverride, "updatedAt">) =>
      saveMenuOverride(override),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.overrides() });
      queryClient.invalidateQueries({ queryKey: menuKeys.allMenus() });
    },
  });
}

/**
 * 메뉴 오버라이드 삭제 훅
 * 성공 시 menuKeys.overrides() + allMenus() 무효화
 */
export function useDeleteMenuOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (menuId: number) => deleteMenuOverride(menuId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.overrides() });
      queryClient.invalidateQueries({ queryKey: menuKeys.allMenus() });
    },
  });
}
