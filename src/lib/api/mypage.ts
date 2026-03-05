/**
 * 마이페이지 API 클라이언트
 *
 * csp-was MyPageController 연동
 */

import { apiClient } from "./client";
import type { MyInfoDTO, MyInfoVO, PasswordChangeVO } from "@/lib/types/mypage";

// ============================================================================
// 내 정보 조회/수정
// ============================================================================

/**
 * 내 정보 조회
 */
export async function getMyInfo(): Promise<MyInfoDTO> {
  return apiClient.get<MyInfoDTO>("/api/mypage/myInfoView");
}

/**
 * 내 정보 수정
 */
export async function updateMyInfo(data: MyInfoVO): Promise<MyInfoDTO> {
  return apiClient.put<MyInfoDTO>("/api/mypage/myInfoEdit", data);
}

/**
 * 비밀번호 변경
 * (현재는 미구현 - csp-was에 엔드포인트 추가 필요)
 */
export async function changePassword(data: PasswordChangeVO): Promise<void> {
  return apiClient.put<void>("/api/mypage/passwordChange", data);
}
