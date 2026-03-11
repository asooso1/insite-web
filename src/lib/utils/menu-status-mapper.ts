/**
 * 메뉴 연결 상태 매핑 유틸리티
 *
 * csp-was 메뉴를 insite-web 페이지와 매칭하여
 * 연결 상태(connected/unmapped/not_implemented)를 판단
 */

import { mapMenuUrl } from "./menu-url-mapper";
import type {
  MenuDTO,
  MenuConnectionStatus,
  MenuUrlMapping,
  MenuWithStatus,
} from "@/lib/types/menu";

/**
 * 구현된 insite-web 페이지 목록 (정적)
 * leaf 메뉴(children이 없는 항목)만 카운트함
 */
const IMPLEMENTED_PAGES = new Set([
  "/work-orders",
  "/work-orders/sop",
  "/work-orders/tbm",
  "/work-orders/complain",
  "/facilities",
  "/users",
  "/clients",
  "/materials",
  "/boards",
  "/boards/notices",
  "/boards/data",
  "/settings",
  "/settings/facility-masters",
  "/settings/menu-management",
  "/patrols",
  "/licenses",
  "/reports",
  "/fieldwork",
  "/analysis",
  "/mypage",
  "/dashboard",
]);

/**
 * 메뉴의 연결 상태 판단
 *
 * 1. 수동 매핑에 menuId가 있으면 그 URL 체크
 * 2. 없으면 mapMenuUrl(menu.url) 결과 체크
 * 3. URL이 IMPLEMENTED_PAGES에 있으면 "connected"
 * 4. URL이 있지만 구현 안되면 "not_implemented"
 * 5. URL 매핑 자체가 없으면 "unmapped"
 */
export function getMenuConnectionStatus(
  menu: MenuDTO,
  mappings: MenuUrlMapping[]
): MenuConnectionStatus {
  // 수동 매핑 확인
  const manualMapping = mappings.find((m) => m.menuId === menu.id);

  let targetUrl: string;
  if (manualMapping?.insiteWebUrl) {
    targetUrl = manualMapping.insiteWebUrl;
  } else {
    // 자동 매핑
    targetUrl = mapMenuUrl(menu.url);
  }

  // URL 검증
  if (!targetUrl || targetUrl === "/dashboard") {
    // 매핑되지 않은 상태
    return "unmapped";
  }

  // 구현 여부 확인
  if (IMPLEMENTED_PAGES.has(targetUrl)) {
    return "connected";
  }

  // 매핑은 있으나 구현 안됨
  return "not_implemented";
}

/**
 * 메뉴 트리에 상태 정보 추가 (재귀)
 * children도 재귀적으로 처리
 */
export function enrichMenuWithStatus(
  menus: MenuDTO[],
  mappings: MenuUrlMapping[]
): MenuWithStatus[] {
  return menus.map((menu) => {
    const status = getMenuConnectionStatus(menu, mappings);
    const manualMapping = mappings.find((m) => m.menuId === menu.id);
    const mappedUrl = manualMapping?.insiteWebUrl ?? mapMenuUrl(menu.url);

    return {
      ...menu,
      status,
      mappedUrl,
      children: enrichMenuWithStatus(menu.children, mappings),
    };
  });
}

/**
 * 메뉴 트리 통계 계산
 * leaf 메뉴(children 없는 항목)만 카운트
 *
 * @returns { total, connected, unmapped, notImplemented }
 */
export function getMenuTreeStats(
  menus: MenuWithStatus[]
): {
  total: number;
  connected: number;
  unmapped: number;
  notImplemented: number;
} {
  let total = 0;
  let connected = 0;
  let unmapped = 0;
  let notImplemented = 0;

  function traverse(menuList: MenuWithStatus[]): void {
    for (const menu of menuList) {
      // leaf 메뉴만 카운트
      if (!menu.children || menu.children.length === 0) {
        total += 1;

        switch (menu.status) {
          case "connected":
            connected += 1;
            break;
          case "unmapped":
            unmapped += 1;
            break;
          case "not_implemented":
            notImplemented += 1;
            break;
        }
      } else {
        // 자식 메뉴도 재귀 처리
        traverse(menu.children);
      }
    }
  }

  traverse(menus);

  return {
    total,
    connected,
    unmapped,
    notImplemented,
  };
}
