/**
 * NFC 라운드(NFC Round) API 클라이언트
 *
 * csp-was NfcRoundController 연동
 */

import { apiClient } from "./client";
import type {
  NfcRoundFormDTO,
  NfcRoundDetailDTO,
  NfcRoundIssueDTO,
  NfcRoundCategoryDTO,
  NfcRoundCategoryItemDTO,
  NfcRoundVO,
  SearchNfcRoundVO,
  NfcRoundFormListResponse,
  NfcRoundIssueListResponse,
} from "@/lib/types/nfc-round";

// ============================================================================
// NFC 라운드 양식
// ============================================================================

/**
 * NFC 라운드 양식 목록 조회
 */
export async function getNfcRoundForms(
  params: SearchNfcRoundVO
): Promise<NfcRoundFormListResponse> {
  const searchParams = new URLSearchParams();
  if (params.title) searchParams.set("title", params.title);
  // 빈 문자열 시 TbmState.valueOf("") → Exception → "ALL" 기본값 사용
  searchParams.set("tbmState", params.tbmState || "ALL");
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  const qs = searchParams.toString();
  return apiClient.get<NfcRoundFormListResponse>(
    `/api/nfc-round/forms${qs ? "?" + qs : ""}`
  );
}

/**
 * NFC 라운드 이슈 목록 조회
 */
export async function getNfcRoundIssues(
  params: SearchNfcRoundVO
): Promise<NfcRoundIssueListResponse> {
  const searchParams = new URLSearchParams();
  if (params.title) searchParams.set("title", params.title);
  // 빈 문자열 시 NfcRoundState.valueOf("") → Exception → "ALL" 기본값 사용
  searchParams.set("state", params.state || "ALL");
  if (params.fromDate) searchParams.set("fromDate", params.fromDate);
  if (params.toDate) searchParams.set("toDate", params.toDate);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  const qs = searchParams.toString();
  return apiClient.get<NfcRoundIssueListResponse>(
    `/api/nfc-round/issues${qs ? "?" + qs : ""}`
  );
}

/**
 * NFC 라운드 상세 조회
 */
export async function getNfcRoundDetail(
  id: number
): Promise<NfcRoundDetailDTO> {
  return apiClient.get<NfcRoundDetailDTO>(`/api/nfc-round/${id}`);
}

/**
 * NFC 라운드 수정
 */
export async function updateNfcRound(data: NfcRoundVO): Promise<void> {
  const formData = new FormData();
  formData.append(
    "nfcRoundData",
    new Blob([JSON.stringify(data.nfcRoundData)], {
      type: "application/json",
    })
  );
  return apiClient.putForm<void>("/api/nfc-round", formData);
}

/**
 * NFC 라운드 카테고리 목록 조회
 */
export async function getNfcRoundCategories(): Promise<
  NfcRoundCategoryDTO[]
> {
  return apiClient.get<NfcRoundCategoryDTO[]>(`/api/nfc-round/categories`);
}

/**
 * NFC 라운드 카테고리 항목 목록 조회
 */
export async function getNfcRoundCategoryItems(): Promise<
  NfcRoundCategoryItemDTO[]
> {
  return apiClient.get<NfcRoundCategoryItemDTO[]>(
    `/api/nfc-round/categories/items`
  );
}

/**
 * 작업지시 생성
 */
export async function createWorkOrderFromNfcRound(
  nfcRoundId: number
): Promise<void> {
  return apiClient.post<void>("/api/nfc-round/work-orders", {
    nfcRoundId,
  });
}
