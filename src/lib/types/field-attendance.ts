/**
 * 현장 출퇴근(Field Attendance) 관련 타입 정의
 *
 * csp-was FieldAttendanceController, FieldAttendanceDTO 기반
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * 출퇴근 방식
 */
export const LogInLogOutMethod = {
  MOBILE_APP: "MOBILE_APP",
  QR_CODE: "QR_CODE",
  FIELD: "FIELD",
} as const;

export type LogInLogOutMethod =
  (typeof LogInLogOutMethod)[keyof typeof LogInLogOutMethod];

/**
 * 출퇴근 방식 한글 라벨
 */
export const LogInLogOutMethodLabel: Record<LogInLogOutMethod, string> = {
  MOBILE_APP: "모바일 앱",
  QR_CODE: "QR 코드",
  FIELD: "필드",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 현장 출퇴근 DTO
 */
export interface FieldAttendanceDTO {
  id: number;
  workOrderId: number;
  workOrderTitle: string;
  scheduleId?: number;
  accountId: number;
  accountName: string;
  projectId: number;
  projectName: string;
  checkInTime?: string;
  checkOutTime?: string;
  attendanceType: string;
  logInLogOutMethod: LogInLogOutMethod;
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 현장 출퇴근 검색 조건
 */
export interface SearchFieldAttendanceVO {
  projectId?: number;
  startDate?: string;
  endDate?: string;
  accountId?: number;
  page?: number;
  size?: number;
}

// ============================================================================
// API Response
// ============================================================================

/**
 * 페이지네이션 응답
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * 현장 출퇴근 목록 응답
 */
export type FieldAttendanceListResponse = PageResponse<FieldAttendanceDTO>;
