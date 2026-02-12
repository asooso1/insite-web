/**
 * 작업지시(Work Order) 관련 타입 정의
 *
 * csp-was WorkOrderController, WorkOrderDTO 기반
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * 작업지시 상태
 */
export const WorkOrderState = {
  WRITE: "WRITE",
  ISSUE: "ISSUE",
  PROCESSING: "PROCESSING",
  REQ_COMPLETE: "REQ_COMPLETE",
  COMPLETE: "COMPLETE",
  CANCEL: "CANCEL",
} as const;

export type WorkOrderState = (typeof WorkOrderState)[keyof typeof WorkOrderState];

/**
 * 작업지시 상태 한글 라벨
 */
export const WorkOrderStateLabel: Record<WorkOrderState, string> = {
  WRITE: "작성",
  ISSUE: "발행",
  PROCESSING: "처리중",
  REQ_COMPLETE: "완료요청",
  COMPLETE: "완료",
  CANCEL: "취소",
};

/**
 * 작업지시 상태 스타일 (StatusBadge용)
 */
export const WorkOrderStateStyle: Record<
  WorkOrderState,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  WRITE: "pending",
  ISSUE: "pending",
  PROCESSING: "inProgress",
  REQ_COMPLETE: "inProgress",
  COMPLETE: "completed",
  CANCEL: "cancelled",
};

/**
 * 작업지시 유형
 */
export const WorkOrderType = {
  GENERAL: "GENERAL",
  TBM: "TBM",
  ALARM: "ALARM",
} as const;

export type WorkOrderType = (typeof WorkOrderType)[keyof typeof WorkOrderType];

/**
 * 작업지시 유형 한글 라벨
 */
export const WorkOrderTypeLabel: Record<WorkOrderType, string> = {
  GENERAL: "일반",
  TBM: "정기",
  ALARM: "긴급",
};

/**
 * 작업 액션 유형
 */
export const WorkOrderActionType = {
  WRITE: "WRITE",
  ISSUE: "ISSUE",
  VIEW: "VIEW",
  START: "START",
  DONE: "DONE",
  REQ_COMPLETE: "REQ_COMPLETE",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  CANCEL: "CANCEL",
} as const;

export type WorkOrderActionType =
  (typeof WorkOrderActionType)[keyof typeof WorkOrderActionType];

// ============================================================================
// DTOs
// ============================================================================

/**
 * 작업 액션 일시 DTO
 */
export interface WorkOrderActionDateDTO {
  id: number;
  type: WorkOrderActionType;
  workOrderActionDate: string;
  actorAccountId: number;
  actorAccountName: string;
  actorAccountCompanyName: string;
  actorAccountRoleName: string;
}

/**
 * 작업지시 파일 DTO
 */
export interface WorkOrderFileDTO {
  id: number;
  workOrderId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

/**
 * 작업지시 결과 DTO
 */
export interface WorkOrderResultDTO {
  id: number;
  workOrderId: number;
  description: string;
  resultState: string;
  actionStatus: string;
  createDate: string;
  files: WorkOrderResultFileDTO[];
}

/**
 * 작업지시 결과 파일 DTO
 */
export interface WorkOrderResultFileDTO {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

/**
 * 담당자 계정 DTO
 */
export interface WorkOrderAccountDTO {
  id: number;
  accountId: number;
  accountName: string;
  accountUserId: string;
  companyName: string;
  roleName: string;
}

/**
 * 빌딩 DTO (간략)
 */
export interface BuildingDTO {
  id: number;
  name: string;
  address?: string;
  companyId?: number;
  companyName?: string;
}

/**
 * 작업지시 DTO (상세)
 */
export interface WorkOrderDTO {
  id: number;
  name: string;

  // 작업 분류
  firstClassId: number;
  firstClassName: string;
  secondClassId: number;
  secondClassName: string;
  secondClassCategoryName: string;

  // 작업 유형
  type: WorkOrderType;
  typeName: string;
  tbmType: string | null;

  // 설정
  autoConfirm: boolean;
  movieLinkUrl: string | null;

  // 일정
  planStartDate: string;
  planEndDate: string;
  deadline: number;
  reqCompleteDate: string;
  doneDate: string | null;

  // 내용
  description: string;

  // 상태
  state: WorkOrderState;
  stateName: string;
  stateStyle: string;

  // 작업팀
  buildingUserGroupId: number;
  buildingUserGroupName: string;

  // 알림 설정
  sendPush: boolean;
  vocSendPush: boolean;
  autoIssued: boolean;

  // 작성자
  writerId: number;
  writerName: string;
  writerCompanyName: string;
  writerRoleName: string;
  writerUserId: string;
  writeDate: string;

  // 수정자
  lastModifierId: number;
  lastModifierName: string;
  lastModifierCompanyName: string;
  lastModifierRoleName: string;
  lastModifierUserId: string;
  lastModifyDate: string;

  // 위치
  buildingId: number;
  buildingName: string;
  buildingFloorId: number;
  buildingFloorName: string;
  buildingFloorZoneId: number;
  buildingFloorZoneName: string;
  facilityId: number;
  facilityName: string;

  // 관련 데이터
  templateId: number;
  workOrderFileDTOs: WorkOrderFileDTO[];
  workOrderResultDTOs: WorkOrderResultDTO[];
  workOrderChargeAccountDTOs: WorkOrderAccountDTO[];
  workOrderCcAccountDTOs: WorkOrderAccountDTO[];
  workOrderApproveAccountDTOs: WorkOrderAccountDTO[];
  workOrderActionDateDTOs: WorkOrderActionDateDTO[];
}

/**
 * 작업지시 목록 아이템 DTO
 */
export interface WorkOrderListDTO {
  workOrderDTO: WorkOrderDTO;
  buildingDTO: BuildingDTO;
  workOrderWriteUserDateDTO: WorkOrderActionDateDTO | null;
  workOrderIssueUserDateDTO: WorkOrderActionDateDTO | null;
  workOrderViewUserDateDTO: WorkOrderActionDateDTO | null;
  workOrderStartUserDateDTO: WorkOrderActionDateDTO | null;
  workOrderDoneUserDateDTO: WorkOrderActionDateDTO | null;
  workOrderReqCompleteUserDateDTO: WorkOrderActionDateDTO | null;
  workOrderApproveUserDateDTO: WorkOrderActionDateDTO | null;
  workOrderRejectUserDateDTO: WorkOrderActionDateDTO | null;
  workOrderCancelUserDateDTO: WorkOrderActionDateDTO | null;
}

/**
 * 작업지시 상세 뷰 DTO
 */
export interface WorkOrderViewDTO {
  workOrderDTO: WorkOrderDTO;
  buildingDTO: BuildingDTO;
  workOrderItemListDTOs: WorkOrderItemListDTO[];
}

/**
 * 점검항목 목록 DTO
 */
export interface WorkOrderItemListDTO {
  id: number;
  workOrderId: number;
  orderNum: number;
  name: string;
  description: string;
  type: string;
  typeName: string;
  facilityId: number;
  facilityName: string;
  resultType: string;
  resultTypeName: string;
  completed: boolean;
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 작업지시 검색 조건
 */
export interface SearchWorkOrderVO {
  // 기간
  startDate?: string;
  endDate?: string;

  // 필터
  companyId?: number;
  regionId?: number;
  buildingId?: number;
  buildingFloorId?: number;

  // 상태
  state?: WorkOrderState;
  states?: WorkOrderState[];

  // 유형
  type?: WorkOrderType;
  types?: WorkOrderType[];

  // 분류
  firstClassId?: number;
  secondClassId?: number;

  // 담당
  chargeAccountId?: number;
  buildingUserGroupId?: number;

  // 검색어
  keyword?: string;
  searchType?: "name" | "description" | "writer";

  // 정렬
  sort?: string;
  direction?: "ASC" | "DESC";
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 작업지시 등록/수정 VO
 */
export interface WorkOrderVO {
  id?: number;
  name: string;
  description: string;

  // 분류
  firstClassId: number;
  secondClassId: number;

  // 유형
  type: WorkOrderType;
  autoConfirm: boolean;

  // 일정
  planStartDate: string;
  planEndDate: string;
  deadline: number;

  // 위치
  buildingId: number;
  buildingFloorId?: number;
  buildingFloorZoneId?: number;
  facilityId?: number;

  // 담당
  buildingUserGroupId: number;
  chargeAccountIds: number[];
  ccAccountIds?: number[];
  approveAccountIds?: number[];

  // 알림
  sendPush: boolean;
  vocSendPush: boolean;

  // 기타
  movieLinkUrl?: string;
  templateId?: number;

  // 파일
  files?: File[];
}

/**
 * 작업지시 결과 등록/수정 VO
 */
export interface WorkOrderResultVO {
  workOrderId: number;
  description: string;
  files?: File[];
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
 * 작업지시 목록 응답
 */
export type WorkOrderListResponse = PageResponse<WorkOrderListDTO>;
