/**
 * 현장 출퇴근(Field Attendance) API 클라이언트
 *
 * csp-was FieldAttendanceController 연동
 */

import { apiClient } from "./client";
import type {
  FieldAttendanceDTO,
  SearchFieldAttendanceVO,
  PageResponse,
} from "@/lib/types/field-attendance";

// ============================================================================
// 현장 출퇴근 목록/조회
// ============================================================================

/**
 * 현장 출퇴근 목록 조회 (페이지네이션)
 */
export async function getFieldAttendanceList(
  params: SearchFieldAttendanceVO & { page: number; size: number }
): Promise<PageResponse<FieldAttendanceDTO>> {
  const query = new URLSearchParams();

  if (params.projectId) query.set("projectId", String(params.projectId));
  if (params.startDate) query.set("startDate", params.startDate);
  if (params.endDate) query.set("endDate", params.endDate);
  if (params.accountId) query.set("accountId", String(params.accountId));
  query.set("page", String(params.page));
  query.set("size", String(params.size));

  const res = await apiClient.get<PageResponse<FieldAttendanceDTO>>(
    `/api/field/attendance/by-project?${query}`
  );
  return res;
}
