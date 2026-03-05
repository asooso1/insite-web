/**
 * 자격증(License) API 클라이언트
 *
 * csp-was LicenseController 연동
 */

import { apiClient } from "./client";
import type {
  SearchLicenseVO,
  LicenseInfoDTO,
  LicenseUserDTO,
  LicenseCategoryDTO,
  LicenseListResponse,
  LicenseUserListResponse,
} from "@/lib/types/license";

// ============================================================================
// 자격증 목록/조회
// ============================================================================

/**
 * 자격증 목록 조회 (페이지네이션)
 */
export async function getLicenseList(
  params: SearchLicenseVO
): Promise<LicenseListResponse> {
  const searchParams = new URLSearchParams();
  if (params.accountId) searchParams.set("accountId", String(params.accountId));
  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.wideAreaId) searchParams.set("wideAreaId", String(params.wideAreaId));
  if (params.baseAreaId) searchParams.set("baseAreaId", String(params.baseAreaId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.firstCategoryId) searchParams.set("firstCategoryId", String(params.firstCategoryId));
  if (params.secondCategoryId) searchParams.set("secondCategoryId", String(params.secondCategoryId));
  if (params.thirdCategoryId) searchParams.set("thirdCategoryId", String(params.thirdCategoryId));
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  const qs = searchParams.toString();
  return apiClient.get<LicenseListResponse>(
    `/api/license/licenseList${qs ? "?" + qs : ""}`
  );
}

/**
 * 자격증 상세 조회
 */
export async function getLicenseView(id: number): Promise<LicenseInfoDTO> {
  return apiClient.get<LicenseInfoDTO>(`/api/license/licenseView?id=${id}`);
}

/**
 * 자격증 보유자 목록 조회
 */
export async function getLicenseUserList(
  params: SearchLicenseVO
): Promise<LicenseUserListResponse> {
  const searchParams = new URLSearchParams();
  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  const qs = searchParams.toString();
  return apiClient.get<LicenseUserListResponse>(
    `/api/license/licenseUserList${qs ? "?" + qs : ""}`
  );
}

/**
 * 자격증 분류 목록 조회
 */
export async function getLicenseCategoryList(): Promise<LicenseCategoryDTO[]> {
  return apiClient.get<LicenseCategoryDTO[]>("/open/license/licenseCategoryList");
}

/**
 * 자격증 번호 중복 확인
 */
export async function checkLicenseNo(licenseNo: string): Promise<boolean> {
  return apiClient.get<boolean>(
    `/api/license/licenseAdd/licenseNo?licenseNo=${encodeURIComponent(licenseNo)}`
  );
}

// ============================================================================
// 자격증 등록/수정/상태변경
// ============================================================================

/**
 * 자격증 등록 (FormData)
 */
export async function addLicense(formData: FormData): Promise<void> {
  return apiClient.postForm<void>("/api/license/licenseAdd", formData);
}

/**
 * 자격증 수정 (FormData)
 */
export async function editLicense(formData: FormData): Promise<void> {
  return apiClient.putForm<void>("/api/license/licenseEdit", formData);
}

/**
 * 자격증 상태 변경
 */
export async function editLicenseState(licenseId: number): Promise<void> {
  return apiClient.put<void>("/api/license/licenseStateEdit", { licenseId });
}
