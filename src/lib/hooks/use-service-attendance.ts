/**
 * 근태 관리 React Query 훅
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAttendanceDay,
  getAttendanceDayAdmin,
  downloadAttendanceExcel,
} from "@/lib/api/service-attendance";
import type { SearchAttendanceVO } from "@/lib/types/service-attendance";

// ============================================================================
// Query Keys
// ============================================================================

const attendanceKeys = {
  all: ["attendance"] as const,
  lists: () => [...attendanceKeys.all, "list"] as const,
  list: (params: SearchAttendanceVO & { page?: number; size?: number }) =>
    [...attendanceKeys.lists(), params] as const,
};

// ============================================================================
// 근태 조회 쿼리
// ============================================================================

/**
 * 일별 근태 조회
 */
export function useAttendanceDay(
  params: SearchAttendanceVO & { page?: number; size?: number } = {}
) {
  return useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: () => getAttendanceDay(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 관리자 일별 근태 조회
 */
export function useAttendanceDayAdmin(
  params: SearchAttendanceVO & { page?: number; size?: number } = {}
) {
  return useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: () => getAttendanceDayAdmin(params),
    staleTime: 30 * 1000,
  });
}

// ============================================================================
// 근태 뮤테이션
// ============================================================================

/**
 * 근태 엑셀 다운로드
 */
export function useDownloadAttendanceExcel() {
  return useMutation({
    mutationFn: (params: SearchAttendanceVO) => downloadAttendanceExcel(params),
  });
}
