/**
 * 태그(NFC/QR) API 클라이언트
 *
 * csp-was TagController 연동
 */

import { apiClient } from "./client";
import type {
  TagDTO,
  TagDetailDTO,
  QrNfcVO,
  SearchQrNfcVO,
  TagListResponse,
} from "@/lib/types/tag";

// ============================================================================
// 태그 목록/상세
// ============================================================================

/**
 * 태그 목록 조회
 */
export async function getTagList(
  params: SearchQrNfcVO
): Promise<TagListResponse> {
  const searchParams = new URLSearchParams();
  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.tagType) searchParams.set("tagType", params.tagType);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  const qs = searchParams.toString();
  return apiClient.get<TagListResponse>(
    `/api/tag/tagList${qs ? "?" + qs : ""}`
  );
}

/**
 * 태그 상세 조회
 */
export async function getTagDetail(id: number): Promise<TagDetailDTO> {
  return apiClient.get<TagDetailDTO>(`/api/tag/tagView/${id}`);
}

/**
 * 태그 생성
 */
export async function createTag(data: QrNfcVO): Promise<void> {
  return apiClient.post<void>("/api/tag/tagCreateNFCQR", data);
}

/**
 * 태그 수정
 */
export async function updateTag(data: QrNfcVO): Promise<void> {
  return apiClient.put<void>("/api/tag/tagView", data);
}

/**
 * 태그 삭제
 */
export async function deleteTag(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/tag/tagView/${id}`);
}

/**
 * 빌딩 QR 다운로드
 */
export async function downloadQrByFloor(buildingId: number): Promise<Blob> {
  return apiClient.get<Blob>(
    `/api/tag/downloadQr/floor/${buildingId}`
  );
}
