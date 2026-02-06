/**
 * React Query 캐시 키 정의
 * - 일관된 캐시 키 관리
 * - 타입 안전성 보장
 */
export const CACHE_KEYS = {
  // ==================== 정적 데이터 (24시간) ====================
  /** 메뉴 트리 */
  MENUS: ["menus"] as const,
  /** 역할 목록 */
  ROLES: ["roles"] as const,
  /** 페이지 정보 */
  PAGE_INFOS: ["page-infos"] as const,

  // ==================== 설정 데이터 (1시간) ====================
  /** 설정 그룹 */
  CONFIG: (group: string) => ["config", group] as const,
  /** 사용자 설정 */
  SETTINGS: ["settings"] as const,

  // ==================== 사용자 데이터 (5분) ====================
  /** 작업 목록 */
  WORK_ORDERS: (params?: Record<string, unknown>) =>
    params ? (["work-orders", params] as const) : (["work-orders"] as const),
  /** 작업 상세 */
  WORK_ORDER: (id: string) => ["work-order", id] as const,
  /** 빌딩 목록 */
  BUILDINGS: (accountId?: string) =>
    accountId ? (["buildings", accountId] as const) : (["buildings"] as const),
  /** 시설 목록 */
  FACILITIES: (params?: Record<string, unknown>) =>
    params ? (["facilities", params] as const) : (["facilities"] as const),
  /** 사용자 목록 */
  USERS: (params?: Record<string, unknown>) =>
    params ? (["users", params] as const) : (["users"] as const),

  // ==================== 대시보드 ====================
  /** 대시보드 설정 */
  DASHBOARD: (type: string, buildingId?: string) =>
    buildingId
      ? (["dashboard", type, buildingId] as const)
      : (["dashboard", type] as const),
  /** 위젯 데이터 */
  WIDGET_DATA: (widgetId: string, params?: Record<string, unknown>) =>
    params
      ? (["widget-data", widgetId, params] as const)
      : (["widget-data", widgetId] as const),

  // ==================== 실시간 데이터 (캐시 안함) ====================
  /** 위치 정보 (SSE) */
  LOCATIONS: ["locations"] as const,
  /** 알림 */
  NOTIFICATIONS: ["notifications"] as const,
} as const;

/**
 * staleTime 옵션
 */
export const QUERY_STALE_TIMES = {
  /** 정적 데이터: 24시간 */
  STATIC: 1000 * 60 * 60 * 24,
  /** 설정 데이터: 1시간 */
  CONFIG: 1000 * 60 * 60,
  /** 동적 데이터: 5분 */
  DYNAMIC: 1000 * 60 * 5,
  /** 실시간: 캐시 안함 */
  REALTIME: 0,
} as const;
