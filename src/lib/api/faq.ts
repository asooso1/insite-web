/**
 * FAQ API 클라이언트
 *
 * csp-was FaqController 연동
 * - FAQ CRUD 조작
 * - 메뉴(카테고리) 조회
 */

import { apiClient } from "./client";
import type {
  FaqListResponse,
  FaqDTO,
  FaqMenuDTO,
  SearchFaqVO,
  FaqVO,
} from "@/lib/types/faq";

// ============================================================================
// FAQ 조회
// ============================================================================

/**
 * FAQ 목록 조회
 */
export async function getFaqList(params: SearchFaqVO): Promise<FaqListResponse> {
  const searchParams = new URLSearchParams();

  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.menuId) searchParams.set("menuId", String(params.menuId));
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<FaqListResponse>(
    `/api/faq/faqList?${searchParams.toString()}`
  );
}

/**
 * FAQ 상세 조회
 */
export async function getFaq(id: number): Promise<FaqDTO> {
  return apiClient.get<FaqDTO>(`/api/faq/getFaq/${id}`);
}

/**
 * FAQ 메뉴(카테고리) 목록 조회
 */
export async function getFaqMenus(): Promise<FaqMenuDTO[]> {
  return apiClient.get<FaqMenuDTO[]>("/api/faq/menus");
}

// ============================================================================
// FAQ CRUD
// ============================================================================

/**
 * FAQ 등록
 */
export async function addFaq(data: FormData): Promise<FaqDTO> {
  return apiClient.postForm<FaqDTO>("/api/faq/addFaq", data);
}

/**
 * FAQ 수정
 */
export async function editFaq(data: FormData): Promise<FaqDTO> {
  return apiClient.putForm<FaqDTO>("/api/faq/editFaq", data);
}

/**
 * FAQ 삭제
 */
export async function deleteFaq(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/faq/deleteFaq/${id}`);
}
