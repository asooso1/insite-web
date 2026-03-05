/**
 * 현장작업지시(Field Work Order) 관련 타입 정의
 *
 * csp-was FieldWorkOrderController, FieldWorkOrderDTO 기반
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * 현장작업지시 상태
 */
export const FieldWorkOrderStatus = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type FieldWorkOrderStatus =
  (typeof FieldWorkOrderStatus)[keyof typeof FieldWorkOrderStatus];

/**
 * 현장작업지시 상태 한글 라벨
 */
export const FieldWorkOrderStatusLabel: Record<FieldWorkOrderStatus, string> = {
  PENDING: "대기중",
  ASSIGNED: "배정됨",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
  CANCELLED: "취소",
};

/**
 * 현장작업지시 상태 스타일 (StatusBadge용)
 */
export const FieldWorkOrderStatusStyle: Record<
  FieldWorkOrderStatus,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  PENDING: "pending",
  ASSIGNED: "inProgress",
  IN_PROGRESS: "inProgress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

/**
 * 현장작업지시 우선순위
 */
export const FieldWorkOrderPriority = {
  URGENT: "URGENT",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
} as const;

export type FieldWorkOrderPriority =
  (typeof FieldWorkOrderPriority)[keyof typeof FieldWorkOrderPriority];

/**
 * 현장작업지시 우선순위 한글 라벨
 */
export const FieldWorkOrderPriorityLabel: Record<
  FieldWorkOrderPriority,
  string
> = {
  URGENT: "긴급",
  HIGH: "높음",
  MEDIUM: "보통",
  LOW: "낮음",
};

/**
 * 현장작업지시 우선순위 스타일 (StatusBadge용)
 */
export const FieldWorkOrderPriorityStyle: Record<
  FieldWorkOrderPriority,
  "urgent" | "high" | "medium" | "low"
> = {
  URGENT: "urgent",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 현장작업지시 목록 아이템 DTO
 */
export interface FieldWorkOrderDTO {
  id: number;
  projectId: number;
  projectName: string;
  title: string;
  description?: string;
  priority: FieldWorkOrderPriority;
  status: FieldWorkOrderStatus;
  startDateTime?: string;
  endDateTime?: string;
  mainAssigneeId?: number;
  mainAssigneeName?: string;
  assigneeCount: number;
  poiId?: number;
  poiName?: string;
}

/**
 * 현장작업지시 상세 DTO
 */
export interface FieldWorkOrderDetailDTO extends FieldWorkOrderDTO {
  assignees: FieldWorkOrderAssigneeDTO[];
  files: FieldWorkOrderFileDTO[];
  comments: FieldWorkOrderCommentDTO[];
}

/**
 * 현장작업지시 담당자 DTO
 */
export interface FieldWorkOrderAssigneeDTO {
  id: number;
  accountId: number;
  accountName: string;
  isMainAssignee: boolean;
}

/**
 * 현장작업지시 파일 DTO
 */
export interface FieldWorkOrderFileDTO {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
}

/**
 * 현장작업지시 댓글 DTO
 */
export interface FieldWorkOrderCommentDTO {
  id: number;
  accountId: number;
  accountName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  deleted: boolean;
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 현장작업지시 검색 조건
 */
export interface SearchFieldWorkOrderVO {
  buildingId?: number;
  projectId?: number;
  keyword?: string;
  status?: FieldWorkOrderStatus;
  priority?: FieldWorkOrderPriority;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 현장작업지시 등록/수정 VO
 */
export interface FieldWorkOrderCreateVO {
  projectId: number;
  title: string;
  description?: string;
  priority: FieldWorkOrderPriority;
  startDateTime?: string;
  endDateTime?: string;
  poiId?: number;
  assigneeAccountIds?: number[];
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
 * 현장작업지시 목록 응답
 */
export type FieldWorkOrderListResponse = PageResponse<FieldWorkOrderDTO>;
