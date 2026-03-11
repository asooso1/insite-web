/**
 * 메뉴(Menu) API 클라이언트
 *
 * csp-was 메뉴 API 연동
 */

import { apiClient } from "./client";
import type {
  MenuDTO,
  PageInfoDTO,
  MenuUrlMappingStore,
} from "@/lib/types/menu";

/**
 * 빌딩별 메뉴 트리 조회
 */
export async function getMenuTree(buildingId: string): Promise<MenuDTO[]> {
  return apiClient.get<MenuDTO[]>(
    `/api/services/menus?buildingId=${buildingId}`
  );
}

/**
 * 전체 메뉴 목록 조회 (관리자용)
 * 빌딩 기준 필터링 없이 모든 메뉴 조회
 * csp-was /api/faq/menus 프록시 통해 호출
 */
export async function getAllMenus(): Promise<MenuDTO[]> {
  return apiClient.get<MenuDTO[]>("/api/faq/menus");
}

/**
 * 페이지 정보 조회
 * csp-was /api/faq/getMenuPage/{pageInfoId} 프록시 통해 호출
 */
export async function getMenuPageInfo(pageInfoId: number): Promise<PageInfoDTO> {
  return apiClient.get<PageInfoDTO>(`/api/faq/menus/${pageInfoId}`);
}

/**
 * 메뉴 캐시 초기화
 * csp-was /api/admin/caches/evict 프록시 통해 호출
 */
export async function evictMenuCache(): Promise<void> {
  await apiClient.post("/api/admin/caches/evict", {
    cacheName: "menuCache",
  });
}

/**
 * 로컬 URL 매핑 조회
 * 수동으로 저장된 메뉴 매핑 정보 로드
 */
export async function getMenuMappings(): Promise<MenuUrlMappingStore> {
  return apiClient.get<MenuUrlMappingStore>("/api/settings/menu-mapping");
}

/**
 * 메뉴 URL 매핑 저장/수정
 * 메뉴 ID에 대한 insite-web URL 수동 매핑 저장
 */
export async function saveMenuMapping(
  menuId: number,
  menuName: string,
  cspWasUrl: string,
  insiteWebUrl: string
): Promise<void> {
  await apiClient.post("/api/settings/menu-mapping", {
    menuId,
    menuName,
    cspWasUrl,
    insiteWebUrl,
  });
}

/**
 * 메뉴 URL 매핑 삭제
 */
export async function deleteMenuMapping(menuId: number): Promise<void> {
  await apiClient.delete(`/api/settings/menu-mapping/${menuId}`);
}
