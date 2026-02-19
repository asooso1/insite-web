/**
 * 게시판(Board) 관련 타입 정의
 *
 * csp-was BoardController 기반
 * - 공지사항(Notice): 목록/상세/등록/수정/삭제 + 댓글
 * - 자료실(ReferenceData): 목록/상세/등록/수정/삭제
 */

import type { PageResponse } from "./facility";

// ============================================================================
// Enums
// ============================================================================

/**
 * 공지 유형
 */
export const NoticeType = {
  NORMAL: "NORMAL",
  NOTICE: "NOTICE",
} as const;

export type NoticeType = (typeof NoticeType)[keyof typeof NoticeType];

export const NoticeTypeLabel: Record<NoticeType, string> = {
  NORMAL: "일반",
  NOTICE: "공지",
};

/**
 * 공지 대상 그룹
 */
export const NoticeTargetGroup = {
  ISSUER_ADMIN: "ISSUER_ADMIN",
  SITE_MANAGER: "SITE_MANAGER",
  TENANT: "TENANT",
} as const;

export type NoticeTargetGroup =
  (typeof NoticeTargetGroup)[keyof typeof NoticeTargetGroup];

export const NoticeTargetGroupLabel: Record<NoticeTargetGroup, string> = {
  ISSUER_ADMIN: "발주처관리자",
  SITE_MANAGER: "현장운영자",
  TENANT: "입주사",
};

/**
 * 게시 상태
 */
export const PublishState = {
  PUBLISHED: "PUBLISHED",
  SCHEDULED: "SCHEDULED",
  EXPIRED: "EXPIRED",
} as const;

export type PublishState = (typeof PublishState)[keyof typeof PublishState];

export const PublishStateLabel: Record<string, string> = {
  PUBLISHED: "게시중",
  SCHEDULED: "예정",
  EXPIRED: "만료",
};

export const PublishStateStyle: Record<
  string,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  PUBLISHED: "completed",
  SCHEDULED: "pending",
  EXPIRED: "cancelled",
};

// ============================================================================
// 공지사항 DTOs
// ============================================================================

/**
 * 공지사항 파일 DTO
 */
export interface NoticeFileDTO {
  id: number;
  noticeId: number;
  sortNo: number;
  originFileName: string;
  filePath: string;
  size: number;
  writerId: number;
  writerName: string;
  writerUserId: string;
  writeDate: string;
}

/**
 * 공지사항 댓글 DTO
 */
export interface NoticeCommentDTO {
  id: number;
  noticeId: number;
  parentId: number | null;
  content: string;
  userId: string;
  writerId: number;
  writerName: string;
  writerRoleName: string;
  writerCompanyName: string;
  writeDate: string;
  lastModifierId: number;
  lastModifyDate: string;
  buildingIds: number[];
  buildingNames: string[];
  children: NoticeCommentDTO[];
}

/**
 * 공지사항 DTO (상세)
 */
export interface NoticeDTO {
  id: number;
  allCompany: boolean;
  noticeCompanyId: number;
  noticeCompanyName: string;
  noticeWideAreaId: number;
  noticeWideAreaName: string;
  noticeBaseAreaId: number;
  noticeBaseAreaName: string;
  noticeBuildingId: number;
  noticeBuildingName: string;
  postTermStart: string | null;
  postTermEnd: string | null;
  noticeType: string;
  alert: boolean;
  title: string;
  contents: string;
  viewCnt: number;
  isMajor: boolean;
  targetGroups: string[];
  writerId: number;
  writerName: string;
  writerUserId: string;
  writerCompanyName: string;
  writerRoleName: string;
  writeDate: string;
  writeDateTime: string;
  lastModifierId: number;
  lastModifierName: string;
  lastModifierUserId: string;
  lastModifierCompanyName: string;
  lastModifierRoleName: string;
  lastModifyDate: string;
  lastModifyDateTime: string;
  publishState: string;
  noticeFileDTOs: NoticeFileDTO[];
  commentEnabled: boolean;
  noticeCommentDTOs: NoticeCommentDTO[];
}

/**
 * 공지사항 목록 DTO (래퍼)
 */
export interface NoticeListDTO {
  noticeDTO: NoticeDTO;
  noticeCompanyId: number;
  noticeCompanyName: string;
  noticeBuildingId: number;
  noticeBuildingName: string;
  isMajor: boolean;
  targetGroups: string[];
  buildingIds: number[];
}

// ============================================================================
// 자료실 DTOs
// ============================================================================

/**
 * 자료실 파일 DTO
 */
export interface ReferenceDataFileDTO {
  id: number;
  referenceDataId: number;
  sortNo: number;
  originFileName: string;
  filePath: string;
  size: number;
  writerId: number;
  writerName: string;
  writerUserId: string;
  writeDate: string;
}

/**
 * 자료실 DTO (상세)
 */
export interface ReferenceDataDTO {
  id: number;
  allCompany: boolean;
  referenceDataCompanyId: number;
  referenceDataCompanyName: string;
  referenceDataWideAreaId: number;
  referenceDataWideAreaName: string;
  referenceDataBaseAreaId: number;
  referenceDataBaseAreaName: string;
  referenceDataBuildingId: number;
  referenceDataBuildingName: string;
  title: string;
  contents: string;
  viewCnt: number;
  writerId: number;
  writerName: string;
  writerCompanyName: string;
  writerRoleName: string;
  writerUserId: string;
  writeDate: string;
  writeDateTime: string;
  lastModifierId: number;
  lastModifierName: string;
  lastModifierCompanyName: string;
  lastModifierRoleName: string;
  lastModifierUserId: string;
  lastModifyDate: string;
  lastModifyDateTime: string;
  referenceDataFileDTOs: ReferenceDataFileDTO[];
}

/**
 * 자료실 목록 DTO (래퍼)
 */
export interface ReferenceDataListDTO {
  referenceDataDTO: ReferenceDataDTO;
  referenceDataCompanyId: number;
  referenceDataCompanyName: string;
  referenceDataBuildingId: number;
  referenceDataBuildingName: string;
}

// ============================================================================
// Search VOs
// ============================================================================

/**
 * 공지사항 검색 조건
 */
export interface SearchNoticeVO {
  companyId?: number;
  buildingId?: number;
  writeDateFrom?: string;
  writeDateTo?: string;
  accountId?: number;
  noticeType?: NoticeType;
  publishState?: string;
  isAllCompany?: boolean;
  searchKeyword?: string;
  page?: number;
  size?: number;
}

/**
 * 자료실 검색 조건
 */
export interface SearchReferenceDataVO {
  companyId?: number;
  buildingId?: number;
  writeDateFrom?: string;
  writeDateTo?: string;
  accountId?: number;
  searchKeyword?: string;
  page?: number;
  size?: number;
}

// ============================================================================
// Create/Update VOs
// ============================================================================

/**
 * 공지사항 등록/수정 VO
 */
export interface NoticeVO {
  id?: number;
  allCompany: boolean;
  companyId?: number;
  buildingId?: number;
  postTermStart: string;
  postTermEnd: string;
  noticeType: NoticeType;
  isAlert: boolean;
  title: string;
  contents: string;
  commentEnabled: boolean;
  isMajor: boolean;
  targetGroups: string[];
  files?: File[];
}

/**
 * 공지사항 댓글 등록/수정 VO
 */
export interface NoticeCommentVO {
  parentId?: number;
  content: string;
}

/**
 * 자료실 등록/수정 VO
 */
export interface ReferenceDataVO {
  id?: number;
  allCompany: boolean;
  companyId?: number;
  buildingId?: number;
  title: string;
  contents: string;
  files?: File[];
}

// ============================================================================
// API Responses
// ============================================================================

export type NoticeListResponse = PageResponse<NoticeListDTO>;
export type ReferenceDataListResponse = PageResponse<ReferenceDataListDTO>;
