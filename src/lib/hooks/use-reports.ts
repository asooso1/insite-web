/**
 * 보고서(Report) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMonthlyReportList,
  getMonthlyReport,
  addMonthlyReport,
  editMonthlyReport,
  deleteMonthlyReport,
  getWeeklyReportList,
  getWeeklyReport,
  addWeeklyReport,
  editWeeklyReport,
  deleteWeeklyReport,
  getWorkLogList,
  getWorkLog,
  addWorkLog,
  editWorkLog,
  deleteWorkLog,
} from "@/lib/api/report";
import type { SearchReportVO, ReportVO } from "@/lib/types/report";

// ============================================================================
// Query Keys
// ============================================================================

export const reportKeys = {
  all: ["reports"] as const,
  // 월간보고서
  monthlyLists: () => [...reportKeys.all, "monthly", "list"] as const,
  monthlyList: (params: SearchReportVO) => [...reportKeys.monthlyLists(), params] as const,
  monthlyDetails: () => [...reportKeys.all, "monthly", "detail"] as const,
  monthlyDetail: (id: number) => [...reportKeys.monthlyDetails(), id] as const,
  // 주간보고서
  weeklyLists: () => [...reportKeys.all, "weekly", "list"] as const,
  weeklyList: (params: SearchReportVO) => [...reportKeys.weeklyLists(), params] as const,
  weeklyDetails: () => [...reportKeys.all, "weekly", "detail"] as const,
  weeklyDetail: (id: number) => [...reportKeys.weeklyDetails(), id] as const,
  // 업무일지
  workLogLists: () => [...reportKeys.all, "workLog", "list"] as const,
  workLogList: (params: SearchReportVO) => [...reportKeys.workLogLists(), params] as const,
  workLogDetails: () => [...reportKeys.all, "workLog", "detail"] as const,
  workLogDetail: (id: number) => [...reportKeys.workLogDetails(), id] as const,
};

// ============================================================================
// 월간보고서 훅
// ============================================================================

export function useMonthlyReportList(params: SearchReportVO) {
  return useQuery({
    queryKey: reportKeys.monthlyList(params),
    queryFn: () => getMonthlyReportList(params),
  });
}

export function useMonthlyReport(id: number) {
  return useQuery({
    queryKey: reportKeys.monthlyDetail(id),
    queryFn: () => getMonthlyReport(id),
    enabled: id > 0,
  });
}

export function useAddMonthlyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReportVO) => addMonthlyReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.monthlyLists() });
    },
  });
}

export function useEditMonthlyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReportVO) => editMonthlyReport(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.monthlyLists() });
      if (variables.info.reportId) {
        queryClient.invalidateQueries({
          queryKey: reportKeys.monthlyDetail(variables.info.reportId),
        });
      }
    },
  });
}

export function useDeleteMonthlyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMonthlyReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.monthlyLists() });
    },
  });
}

// ============================================================================
// 주간보고서 훅
// ============================================================================

export function useWeeklyReportList(params: SearchReportVO) {
  return useQuery({
    queryKey: reportKeys.weeklyList(params),
    queryFn: () => getWeeklyReportList(params),
  });
}

export function useWeeklyReport(id: number) {
  return useQuery({
    queryKey: reportKeys.weeklyDetail(id),
    queryFn: () => getWeeklyReport(id),
    enabled: id > 0,
  });
}

export function useAddWeeklyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReportVO) => addWeeklyReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.weeklyLists() });
    },
  });
}

export function useEditWeeklyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReportVO) => editWeeklyReport(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.weeklyLists() });
      if (variables.info.reportId) {
        queryClient.invalidateQueries({
          queryKey: reportKeys.weeklyDetail(variables.info.reportId),
        });
      }
    },
  });
}

export function useDeleteWeeklyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteWeeklyReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.weeklyLists() });
    },
  });
}

// ============================================================================
// 업무일지 훅
// ============================================================================

export function useWorkLogList(params: SearchReportVO) {
  return useQuery({
    queryKey: reportKeys.workLogList(params),
    queryFn: () => getWorkLogList(params),
  });
}

export function useWorkLog(id: number) {
  return useQuery({
    queryKey: reportKeys.workLogDetail(id),
    queryFn: () => getWorkLog(id),
    enabled: id > 0,
  });
}

export function useAddWorkLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReportVO) => addWorkLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.workLogLists() });
    },
  });
}

export function useEditWorkLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReportVO) => editWorkLog(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.workLogLists() });
      if (variables.info.reportId) {
        queryClient.invalidateQueries({
          queryKey: reportKeys.workLogDetail(variables.info.reportId),
        });
      }
    },
  });
}

export function useDeleteWorkLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteWorkLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.workLogLists() });
    },
  });
}
