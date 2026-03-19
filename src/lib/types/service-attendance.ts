/**
 * 근태 관리(Service Attendance) 관련 타입 정의
 *
 * csp-was AttendanceController 기반
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * 근태 상태
 */
export const AttendanceStatus = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE",
  EARLY_LEAVE: "EARLY_LEAVE",
  ON_VACATION: "ON_VACATION",
} as const;

export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

/**
 * 근태 상태 한글 라벨
 */
export const AttendanceStatusLabel: Record<AttendanceStatus, string> = {
  PRESENT: "정상",
  ABSENT: "결근",
  LATE: "지각",
  EARLY_LEAVE: "조퇴",
  ON_VACATION: "휴가",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 근태 DTO (백엔드 BuildingAccountAttendanceListDTO 매핑)
 */
export interface AttendanceDTO {
  accountDTO?: {
    id?: number;
    name?: string;
    department?: string;
    position?: string;
    companyName?: string;
  };
  buildingAccountAttendanceDTO?: {
    attendanceDate?: string;
    loginTime?: string;
    logoutTime?: string;
    loginMethod?: string;
    loginMethodName?: string;
    logoutMethod?: string;
    logoutMethodName?: string;
  };
  accessDayCnt?: number;
}

/**
 * 근태 목록 응답
 */
export interface AttendanceListResponse {
  content: AttendanceDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 근태 검색 조건
 */
export interface SearchAttendanceVO {
  attendanceDate?: string;
  buildingId?: number;
  page?: number;
  size?: number;
}
