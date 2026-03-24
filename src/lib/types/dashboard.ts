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
// DTO: 업무 현황 상세 (widget37)
// ============================================================================

/** widget37 개별 업무 아이템 (백엔드 Widget37DTO.Widget37 매핑) */
export interface WorkStatusDetailItem {
  /** 작업 ID */
  id?: number;
  /** 업무명 */
  name?: string;
  /** 대분류 */
  firstClassName?: string;
  /** 소분류 */
  secondClassName?: string;
  /** 담당 그룹 */
  buildingUserGroupName?: string;
}

/** widget37 전체 응답 (백엔드 Widget37DTO 매핑) */
export interface Widget37DTO {
  writeCnt?: number;
  issueCnt?: number;
  viewCnt?: number;
  startCnt?: number;
  doneCnt?: number;
  addResultCnt?: number;
  reqCompleteCnt?: number;
  approveCnt?: number;
  rejectCnt?: number;
  cancelCnt?: number;
  workOrderDTOs?: WorkStatusDetailItem[];
}

// ============================================================================
// DTO: 시설 현황 KPI (커스텀 위젯)
// ============================================================================

/** 시설 현황 KPI 위젯 데이터 */
export interface FacilityStatusWidget {
  /** 전체 시설 수 */
  totalCount?: number;
  /** 운영 중인 시설 수 */
  operatingCount?: number;
  /** 점검 중인 시설 수 */
  checkingCount?: number;
  /** 공사 중인 시설 수 */
  constructingCount?: number;
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
