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
