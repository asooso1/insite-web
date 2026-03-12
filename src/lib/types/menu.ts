/**
 * 메뉴 관련 타입 정의
 */

/**
 * 백엔드 메뉴 DTO
 * csp-was MenuDTO 매핑
 */
export interface MenuDTO {
  id: number;
  depth: number;
  sortNo: number;
  parentId: number;
  name: string;
  use: boolean;
  url: string;
  show: boolean;
  icon: string;
  children: MenuDTO[];
}

/**
 * 페이지 기능 DTO
 * csp-was PageFunctionDTO 매핑
 */
export interface PageFunctionDTO {
  id: number;
  name: string;
  code: string;
  apiUrl: string;
  method: string;
  use: boolean;
  deletePossible: boolean;
}

/**
 * 페이지 정보 DTO
 * csp-was PageInfoDTO 매핑
 */
export interface PageInfoDTO {
  id: number;
  name: string;
  pageId: string;
  url: string;
  sortNo: number;
  use: boolean;
  rowId: string;
  videoId?: string;
  pageFunctionDTOs: PageFunctionDTO[];
}

/**
 * 메뉴 연결 상태 (mapping 상태)
 */
export type MenuConnectionStatus = "connected" | "unmapped" | "not_implemented";

/**
 * 메뉴 + 연결 상태 + 오버라이드 정보
 * 목록/통계 조회에 사용
 */
export interface MenuWithStatus extends Omit<MenuDTO, "children"> {
  status: MenuConnectionStatus;
  mappedUrl?: string;
  pageInfo?: PageInfoDTO;
  children: MenuWithStatus[];
  hasOverride?: boolean;
}

/**
 * 메뉴 URL 매핑 (수동 매핑 저장용)
 */
export interface MenuUrlMapping {
  menuId: number;
  menuName: string;
  cspWasUrl: string;
  insiteWebUrl: string;
  updatedAt: string;
}

/**
 * 메뉴 URL 매핑 저장소
 * public/menu-mappings.json 스키마
 */
export interface MenuUrlMappingStore {
  mappings: MenuUrlMapping[];
  lastUpdated: string;
}

/**
 * 메뉴 오버라이드 정보 (편집 기능)
 * public/menu-overrides.json 스키마
 */
export interface MenuOverride {
  menuId: number;
  name?: string;           // 이름 변경
  parentId?: number;       // 상위 메뉴 변경
  sortNo?: number;         // 순서 변경
  isUse?: boolean;         // 사용 여부
  isShow?: boolean;        // 표시 여부
  roles?: string[];        // 접근 가능 역할 목록
  updatedAt: string;
}

/**
 * 메뉴 오버라이드 저장소
 * public/menu-overrides.json 스키마
 */
export interface MenuOverrideStore {
  overrides: MenuOverride[];
  lastUpdated: string;
}
