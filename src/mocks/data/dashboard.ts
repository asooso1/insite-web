/**
 * 대시보드 Mock 데이터
 */

import type {
  WorkOrderStatusWidget,
  NoticeWidgetItem,
  WorkStatusDetailItem,
  ScheduleItem,
} from "@/lib/types/dashboard";

export const mockWorkOrderStatus: WorkOrderStatusWidget = {
  totalCount: 50,
  pendingCount: 18,
  inProgressCount: 23,
  completedCount: 7,
  overdueCount: 3,
} satisfies WorkOrderStatusWidget;

export const mockNoticeWidgetItems: NoticeWidgetItem[] = [
  {
    id: 1,
    title: "[필독] 2026년 소방시설 법정점검 일정 안내",
    createdAt: "2026-02-20",
    isNew: true,
    writerName: "김철수",
    viewCount: 142,
  },
  {
    id: 2,
    title: "강남파이낸스센터 엘리베이터 정기 점검 예정 공지",
    createdAt: "2026-02-18",
    isNew: true,
    writerName: "이영희",
    viewCount: 89,
  },
  {
    id: 3,
    title: "서울스퀘어 냉각탑 청소 작업 완료 보고",
    createdAt: "2026-02-15",
    isNew: false,
    writerName: "박민준",
    viewCount: 57,
  },
  {
    id: 4,
    title: "2026년 1분기 에너지 사용량 현황 보고",
    createdAt: "2026-02-10",
    isNew: false,
    writerName: "최수정",
    viewCount: 203,
  },
  {
    id: 5,
    title: "비상발전기 정기 부하시험 결과 안내",
    createdAt: "2026-02-05",
    isNew: false,
    writerName: "정대호",
    viewCount: 76,
  },
] satisfies NoticeWidgetItem[];

export const mockWorkStatusDetails: WorkStatusDetailItem[] = [
  {
    id: 1,
    title: "B1층 배전반 정기점검",
    assigneeName: "김철수",
    state: "PROCESSING",
    dueDate: "2026-02-28",
    buildingName: "강남파이낸스센터",
    priority: "HIGH",
  },
  {
    id: 2,
    title: "옥상 공조기 필터 청소",
    assigneeName: "이영희",
    state: "ISSUE",
    dueDate: "2026-03-05",
    buildingName: "서울스퀘어",
    priority: "NORMAL",
  },
  {
    id: 3,
    title: "소화전 방수 시험",
    assigneeName: "박민준",
    state: "PROCESSING",
    dueDate: "2026-02-25",
    buildingName: "삼성타워",
    priority: "HIGH",
  },
  {
    id: 4,
    title: "냉각탑 순환수 수질 검사",
    assigneeName: "최수정",
    state: "REQ_COMPLETE",
    dueDate: "2026-02-23",
    buildingName: "파르나스타워",
    priority: "NORMAL",
  },
  {
    id: 5,
    title: "비상발전기 부하시험",
    assigneeName: "정대호",
    state: "WRITE",
    dueDate: "2026-03-10",
    buildingName: "롯데월드타워",
    priority: "LOW",
  },
] satisfies WorkStatusDetailItem[];

export const mockScheduleItems: ScheduleItem[] = [
  {
    id: 1,
    title: "소방시설 법정점검",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    state: "ISSUE",
    assigneeName: "김철수",
    buildingName: "강남파이낸스센터",
  },
  {
    id: 2,
    title: "냉각탑 연간 청소",
    startDate: "2026-03-10",
    endDate: "2026-03-12",
    state: "WRITE",
    assigneeName: "이영희",
    buildingName: "서울스퀘어",
  },
  {
    id: 3,
    title: "수전설비 정기점검",
    startDate: "2026-03-15",
    endDate: "2026-03-16",
    state: "WRITE",
    assigneeName: "박민준",
    buildingName: "삼성타워",
  },
  {
    id: 4,
    title: "엘리베이터 안전점검",
    startDate: "2026-03-20",
    endDate: "2026-03-20",
    state: "WRITE",
    assigneeName: "최수정",
    buildingName: "파르나스타워",
  },
  {
    id: 5,
    title: "비상발전기 부하시험",
    startDate: "2026-03-25",
    endDate: "2026-03-25",
    state: "WRITE",
    assigneeName: "정대호",
    buildingName: "롯데월드타워",
  },
] satisfies ScheduleItem[];

/** 월별 작업 현황 차트 (12개월) */
export const mockMonthlyWorkOrders: { month: string; total: number; completed: number; cancelled: number }[] = [
  { month: "2025-03", total: 42, completed: 38, cancelled: 2 },
  { month: "2025-04", total: 45, completed: 41, cancelled: 1 },
  { month: "2025-05", total: 38, completed: 35, cancelled: 0 },
  { month: "2025-06", total: 51, completed: 47, cancelled: 3 },
  { month: "2025-07", total: 49, completed: 44, cancelled: 2 },
  { month: "2025-08", total: 55, completed: 50, cancelled: 1 },
  { month: "2025-09", total: 47, completed: 43, cancelled: 2 },
  { month: "2025-10", total: 52, completed: 48, cancelled: 1 },
  { month: "2025-11", total: 44, completed: 40, cancelled: 2 },
  { month: "2025-12", total: 58, completed: 53, cancelled: 2 },
  { month: "2026-01", total: 46, completed: 42, cancelled: 1 },
  { month: "2026-02", total: 50, completed: 7, cancelled: 2 },
];

/** KPI 요약 */
export const mockKpiSummary = {
  workOrderCompletion: 94.2,
  facilityUptime: 99.1,
  overdueRate: 5.8,
  avgResolutionDays: 2.3,
} as const;

export const mockDashboard = {
  workOrderStatus: mockWorkOrderStatus,
  noticeItems: mockNoticeWidgetItems,
  workStatusDetails: mockWorkStatusDetails,
  scheduleItems: mockScheduleItems,
  monthlyWorkOrders: mockMonthlyWorkOrders,
  kpiSummary: mockKpiSummary,
};
