/**
 * 게시판(Board) API 클라이언트
 *
 * csp-was BoardController 연동
 * - 공지사항(Notice) CRUD + 댓글
 * - 자료실(ReferenceData) CRUD
 */

import { apiClient } from "./client";
import type {
  NoticeListResponse,
  NoticeDTO,
  SearchNoticeVO,
  NoticeVO,
  NoticeCommentVO,
  ReferenceDataListResponse,
  ReferenceDataDTO,
  SearchReferenceDataVO,
  ReferenceDataVO,
} from "@/lib/types/board";

// ============================================================================
// 공지사항
// ============================================================================

/**
 * 공지사항 목록 조회
 */
export async function getNoticeList(
  params: SearchNoticeVO
): Promise<NoticeListResponse> {
  const searchParams = new URLSearchParams();

  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.writeDateFrom) searchParams.set("writeDateFrom", params.writeDateFrom);
  if (params.writeDateTo) searchParams.set("writeDateTo", params.writeDateTo);
  if (params.noticeType) searchParams.set("noticeType", params.noticeType);
  if (params.publishState) searchParams.set("publishState", params.publishState);
  if (params.searchKeyword) searchParams.set("searchKeyword", params.searchKeyword);
  if (params.isAllCompany !== undefined) searchParams.set("isAllCompany", String(params.isAllCompany));
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<NoticeListResponse>(
    `/api/board/noticeList?${searchParams.toString()}`
  );
}

/**
 * 공지사항 상세 조회
 */
export async function getNoticeView(id: number): Promise<NoticeDTO> {
  return apiClient.get<NoticeDTO>(`/api/board/noticeView/${id}`);
}

/**
 * 공지사항 등록 (FormData)
 */
export async function addNotice(data: NoticeVO): Promise<NoticeDTO> {
  const formData = new FormData();

  if (data.id) formData.append("noticeVo.id", String(data.id));
  formData.append("noticeVo.allCompany", String(data.allCompany));
  if (data.companyId) formData.append("noticeVo.companyId", String(data.companyId));
  if (data.buildingId) formData.append("noticeVo.buildingId", String(data.buildingId));
  formData.append("noticeVo.postTermStart", data.postTermStart);
  formData.append("noticeVo.postTermEnd", data.postTermEnd);
  formData.append("noticeVo.noticeType", data.noticeType);
  formData.append("noticeVo.isAlert", String(data.isAlert));
  formData.append("noticeVo.title", data.title);
  formData.append("noticeVo.contents", data.contents);
  formData.append("noticeVo.commentEnabled", String(data.commentEnabled));
  formData.append("noticeVo.isMajor", String(data.isMajor));
  data.targetGroups.forEach((group) => formData.append("noticeVo.targetGroups", group));

  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.postForm<NoticeDTO>("/api/board/addNotice", formData);
}

/**
 * 공지사항 수정 (FormData)
 */
export async function editNotice(data: NoticeVO): Promise<NoticeDTO> {
  const formData = new FormData();

  if (data.id) formData.append("noticeVo.id", String(data.id));
  formData.append("noticeVo.allCompany", String(data.allCompany));
  if (data.companyId) formData.append("noticeVo.companyId", String(data.companyId));
  if (data.buildingId) formData.append("noticeVo.buildingId", String(data.buildingId));
  formData.append("noticeVo.postTermStart", data.postTermStart);
  formData.append("noticeVo.postTermEnd", data.postTermEnd);
  formData.append("noticeVo.noticeType", data.noticeType);
  formData.append("noticeVo.isAlert", String(data.isAlert));
  formData.append("noticeVo.title", data.title);
  formData.append("noticeVo.contents", data.contents);
  formData.append("noticeVo.commentEnabled", String(data.commentEnabled));
  formData.append("noticeVo.isMajor", String(data.isMajor));
  data.targetGroups.forEach((group) => formData.append("noticeVo.targetGroups", group));

  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.putForm<NoticeDTO>("/api/board/editNotice", formData);
}

/**
 * 공지사항 삭제
 */
export async function deleteNotice(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/board/deleteNotice/${id}`);
}

// ============================================================================
// 공지사항 댓글
// ============================================================================

/**
 * 댓글 등록
 */
export async function addComment(
  noticeId: number,
  data: NoticeCommentVO
): Promise<void> {
  return apiClient.post<void>(`/api/board/addComment/${noticeId}`, data);
}

/**
 * 댓글 수정
 */
export async function editComment(
  commentId: number,
  data: NoticeCommentVO
): Promise<void> {
  return apiClient.request<void>(`/api/board/editComment/${commentId}`, {
    method: "PATCH",
    body: data,
  });
}

/**
 * 댓글 삭제
 */
export async function deleteComment(commentId: number): Promise<void> {
  return apiClient.delete<void>(`/api/board/deleteComment/${commentId}`);
}

// ============================================================================
// 자료실
// ============================================================================

/**
 * 자료실 목록 조회
 */
export async function getReferenceDataList(
  params: SearchReferenceDataVO
): Promise<ReferenceDataListResponse> {
  const searchParams = new URLSearchParams();

  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.writeDateFrom) searchParams.set("writeDateFrom", params.writeDateFrom);
  if (params.writeDateTo) searchParams.set("writeDateTo", params.writeDateTo);
  if (params.searchKeyword) searchParams.set("searchKeyword", params.searchKeyword);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<ReferenceDataListResponse>(
    `/api/board/dataList?${searchParams.toString()}`
  );
}

/**
 * 자료실 상세 조회
 */
export async function getReferenceDataView(id: number): Promise<ReferenceDataDTO> {
  return apiClient.get<ReferenceDataDTO>(`/api/board/dataView/${id}`);
}

/**
 * 자료실 등록 (FormData)
 */
export async function addReferenceData(data: ReferenceDataVO): Promise<ReferenceDataDTO> {
  const formData = new FormData();

  if (data.id) formData.append("referenceDataVo.id", String(data.id));
  formData.append("referenceDataVo.allCompany", String(data.allCompany));
  if (data.companyId) formData.append("referenceDataVo.companyId", String(data.companyId));
  if (data.buildingId) formData.append("referenceDataVo.buildingId", String(data.buildingId));
  formData.append("referenceDataVo.title", data.title);
  formData.append("referenceDataVo.contents", data.contents);

  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.postForm<ReferenceDataDTO>("/api/board/addData", formData);
}

/**
 * 자료실 수정 (FormData)
 */
export async function editReferenceData(data: ReferenceDataVO): Promise<ReferenceDataDTO> {
  const formData = new FormData();

  if (data.id) formData.append("referenceDataVo.id", String(data.id));
  formData.append("referenceDataVo.allCompany", String(data.allCompany));
  if (data.companyId) formData.append("referenceDataVo.companyId", String(data.companyId));
  if (data.buildingId) formData.append("referenceDataVo.buildingId", String(data.buildingId));
  formData.append("referenceDataVo.title", data.title);
  formData.append("referenceDataVo.contents", data.contents);

  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.putForm<ReferenceDataDTO>("/api/board/editData", formData);
}

/**
 * 자료실 삭제
 */
export async function deleteReferenceData(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/board/deleteData/${id}`);
}
