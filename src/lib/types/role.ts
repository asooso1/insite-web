/**
 * 역할(Role) 관련 타입 정의
 *
 * csp-was UserController 기반
 */

// ============================================================================
// DTOs
// ============================================================================

/**
 * 역할 DTO
 */
export interface RoleDTO {
  id: number;
  code: string;
  name: string;
  description: string;
}

/**
 * 역할별 메뉴 권한 DTO
 */
export interface RoleMenuAuthDTO {
  menuId: number;
  menuName: string;
  hasAuth: boolean;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 역할 권한 수정 VO
 */
export interface RoleAuthVO {
  roleId: number;
  menuIds: number[];
}

// ============================================================================
// API Response
// ============================================================================

/**
 * 역할 목록 응답
 */
export type RoleListResponse = RoleDTO[];
