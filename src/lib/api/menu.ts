/**
 * 메뉴(Menu) API 클라이언트
 *
 * csp-was 메뉴 API 연동
 */

import { apiClient } from "./client";
import type { MenuDTO } from "@/lib/types/menu";

/**
 * 빌딩별 메뉴 트리 조회
 */
export async function getMenuTree(buildingId: string): Promise<MenuDTO[]> {
  return apiClient.get<MenuDTO[]>(
    `/api/services/menus?buildingId=${buildingId}`
  );
}
