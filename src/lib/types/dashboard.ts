/**
 * 대시보드(Dashboard) 타입 정의
 *
 * csp-was DashBoardController, WidgetController 연동
 */

// ============================================================================
// Enum: 대시보드 타입
// ============================================================================

export const DashboardType = {
  MAIN: 'MAIN',
  FMS: 'FMS',
  NCP: 'NCP',
  RMS: 'RMS',
  BIM: 'BIM',
  SENSOR: 'SENSOR',
} as const;
export type DashboardType = typeof DashboardType[keyof typeof DashboardType];

// ============================================================================
// Enum: 대시보드 그룹 타입
// ============================================================================

export const DashboardGroupType = {
  MULTI: 'MULTI',
  SINGLE: 'SINGLE',
} as const;
export type DashboardGroupType = typeof DashboardGroupType[keyof typeof DashboardGroupType];

// ============================================================================
// Enum: 계정 타입
// ============================================================================

export const AccountType = {
  LABS: 'LABS',
  FIELD: 'FIELD',
  CLIENT: 'CLIENT',
} as const;
export type AccountType = typeof AccountType[keyof typeof AccountType];

// ============================================================================
// VO: 위젯 목록 조회 파라미터
// ============================================================================

/** 위젯 설정 VO - 위젯 목록 조회 시 사용 */
export interface WidgetVO {
  accountType?: AccountType;
  dashboardType?: DashboardType;
  groupType?: DashboardGroupType;
}

// ============================================================================
// VO: 위젯 공통 검색 파라미터
// ============================================================================

/** 검색 위젯 VO - 개별 위젯 데이터 조회 시 사용 */
export interface SearchWidgetVO {
  dashboardType?: DashboardType;
  buildingId?: number;
  wideAreaId?: number;
}

// ============================================================================
// DTO: 작업 현황 KPI (widget6)
// ============================================================================

/** 작업 현황 KPI 위젯 데이터 */
export interface WorkOrderStatusWidget {
  /** 전체 작업 수 */
  totalCount?: number;
  /** 대기 중인 작업 수 */
  pendingCount?: number;
  /** 진행 중인 작업 수 */
  inProgressCount?: number;
  /** 완료된 작업 수 */
  completedCount?: number;
  /** 지연된 작업 수 */
  overdueCount?: number;
}

// ============================================================================
// DTO: 공지사항 위젯 아이템 (widget8)
// ============================================================================

/** 공지사항 위젯 목록 아이템 */
export interface NoticeWidgetItem {
  /** 공지사항 ID */
  id?: number;
  /** 제목 */
  title?: string;
  /** 등록 일시 */
  createdAt?: string;
  /** 신규 여부 */
  isNew?: boolean;
  /** 작성자 */
  writerName?: string;
  /** 조회수 */
  viewCount?: number;
}

// ============================================================================
// DTO: 업무 현황 상세 아이템 (widget37)
// ============================================================================

/** 업무 현황 상세 위젯 아이템 */
export interface WorkStatusDetailItem {
  /** 작업 ID */
  id?: number;
  /** 제목 */
  title?: string;
  /** 담당자 이름 */
  assigneeName?: string;
  /** 상태 */
  state?: string;
  /** 마감일 */
  dueDate?: string;
  /** 빌딩 이름 */
  buildingName?: string;
  /** 우선순위 */
  priority?: string;
}

// ============================================================================
// DTO: 일정 아이템 (widget42, widget43)
// ============================================================================

/** 작업 일정표 위젯 아이템 */
export interface ScheduleItem {
  /** 작업 ID */
  id?: number;
  /** 제목 */
  title?: string;
  /** 시작일 */
  startDate?: string;
  /** 종료일 */
  endDate?: string;
  /** 상태 */
  state?: string;
  /** 담당자 이름 */
  assigneeName?: string;
  /** 빌딩 이름 */
  buildingName?: string;
}
