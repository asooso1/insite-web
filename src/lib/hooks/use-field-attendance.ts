/**
 * 현장 출퇴근(Field Attendance) React Query 훅
 */

import { useQuery } from "@tanstack/react-query";
import { getFieldAttendanceList } from "@/lib/api/field-attendance";
import type { SearchFieldAttendanceVO } from "@/lib/types/field-attendance";

// ============================================================================
// Query Keys
// ============================================================================

export const fieldAttendanceKeys = {
  all: ["fieldAttendance"] as const,
  lists: () => [...fieldAttendanceKeys.all, "list"] as const,
  list: (params: SearchFieldAttendanceVO & { page: number; size: number }) =>
    [...fieldAttendanceKeys.lists(), params] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 현장 출퇴근 목록 조회 훅 (페이지네이션)
 */
export function useFieldAttendanceList(
  params: SearchFieldAttendanceVO & { page: number; size: number }
) {
  return useQuery({
    queryKey: fieldAttendanceKeys.list(params),
    queryFn: () => getFieldAttendanceList(params),
  });
}
