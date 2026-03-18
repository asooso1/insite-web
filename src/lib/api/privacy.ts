/**
 * 개인정보정책 API 클라이언트
 *
 * csp-was PrivacyController 연동
 * - 정책 조회/수정/삭제
 */

import { apiClient } from "./client";
import type { PrivacyDTO, PrivacyVO } from "@/lib/types/privacy";

// ============================================================================
// 정책 조회
// ============================================================================

/**
 * 개인정보정책 조회
 */
export async function getPrivacyPolicy(): Promise<PrivacyDTO> {
  return apiClient.get<PrivacyDTO>("/api/privacy/policyView");
}

// ============================================================================
// 정책 CRUD
// ============================================================================

/**
 * 개인정보정책 수정
 */
export async function editPrivacyPolicy(data: PrivacyVO): Promise<PrivacyDTO> {
  return apiClient.post<PrivacyDTO>("/api/privacy/policyEdit", data);
}

/**
 * 개인정보정책 삭제
 */
export async function deletePrivacyPolicy(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/privacy/policyEdit?id=${id}`);
}
