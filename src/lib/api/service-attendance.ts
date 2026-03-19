/**
 * 근태 관리(Service Attendance) API 클라이언트
 *
 * csp-was AttendanceController 연동
 */

import { apiClient } from "./client";
import type {
  AttendanceListResponse,
  SearchAttendanceVO,
} from "@/lib/types/service-attendance";

// ============================================================================
// 근태 조회
// ============================================================================

/**
 * 일별 근태 조회
 */
export async function getAttendanceDay(
  params: SearchAttendanceVO & { page?: number; size?: number } = {}
): Promise<AttendanceListResponse> {
  const searchParams = new URLSearchParams();

  if (params.attendanceDate) searchParams.set("attendanceDate", params.attendanceDate);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<AttendanceListResponse>(
    `/api/service/attendanceDay?${searchParams.toString()}`
  );
}

/**
 * 관리자 일별 근태 조회
 */
export async function getAttendanceDayAdmin(
  params: SearchAttendanceVO & { page?: number; size?: number } = {}
): Promise<AttendanceListResponse> {
  const searchParams = new URLSearchParams();

  if (params.attendanceDate) searchParams.set("attendanceDate", params.attendanceDate);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<AttendanceListResponse>(
    `/api/service/attendanceDayAdmin?${searchParams.toString()}`
  );
}

// ============================================================================
// 엑셀 다운로드
// ============================================================================

/**
 * 근태 엑셀 다운로드
 */
export async function downloadAttendanceExcel(
  params: SearchAttendanceVO = {}
): Promise<Blob> {
  const searchParams = new URLSearchParams();

  if (params.attendanceDate) searchParams.set("attendanceDate", params.attendanceDate);

  return apiClient.getBlob(
    `/api/service/attendanceDayAdminExcelDownload?${searchParams.toString()}`
  );
}
