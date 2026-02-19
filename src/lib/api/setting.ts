/**
 * 설정(Setting) API 클라이언트
 *
 * csp-was SettingController 연동
 */

import { apiClient } from "./client";
import type {
  ConfigGroupDTO,
  ConfigDTO,
  ConfigVO,
  SearchKeywordVO,
  FacilityCategoryTreeDTO,
  FacilityCategoryVO,
  FacilityMasterListResponse,
  FacilityMasterDTO,
  SearchFacilityMasterVO,
  FacilityMasterVO,
} from "@/lib/types/setting";

// ============================================================================
// 기본 코드
// ============================================================================

/**
 * 기본 코드 그룹 목록 조회
 */
export async function getConfigGroupList(
  params?: SearchKeywordVO
): Promise<ConfigGroupDTO[]> {
  const searchParams = new URLSearchParams();
  if (params?.searchCode) searchParams.set("searchCode", params.searchCode);
  if (params?.searchKeyword) searchParams.set("searchKeyword", params.searchKeyword);

  return apiClient.get<ConfigGroupDTO[]>(
    `/api/setting/configGroupList?${searchParams.toString()}`
  );
}

/**
 * 기본 코드 상세 조회
 */
export async function getConfig(configId: number): Promise<ConfigDTO> {
  return apiClient.get<ConfigDTO>(`/api/setting/config/${configId}`);
}

/**
 * 기본 코드 수정
 */
export async function editConfig(data: ConfigVO): Promise<ConfigDTO> {
  return apiClient.put<ConfigDTO>("/api/setting/config", data);
}

// ============================================================================
// 설비 분류
// ============================================================================

/**
 * 설비 분류 트리 목록 조회
 */
export async function getFacilityCategoryTreeList(): Promise<FacilityCategoryTreeDTO[]> {
  return apiClient.get<FacilityCategoryTreeDTO[]>(
    "/api/setting/facilityCategoryTreeList"
  );
}

/**
 * 설비 분류 상세 조회
 */
export async function getFacilityCategory(id: number): Promise<FacilityCategoryTreeDTO> {
  return apiClient.get<FacilityCategoryTreeDTO>(
    `/api/setting/getFacilityCategory/${id}`
  );
}

/**
 * 설비 분류 등록
 */
export async function addFacilityCategory(
  data: FacilityCategoryVO
): Promise<void> {
  return apiClient.post<void>("/api/setting/addFacilityCategory", data);
}

/**
 * 설비 분류 수정
 */
export async function updateFacilityCategory(
  data: FacilityCategoryVO
): Promise<void> {
  return apiClient.put<void>("/api/setting/updateFacilityCategory", data);
}

// ============================================================================
// 표준 설비
// ============================================================================

/**
 * 표준 설비 목록 조회
 */
export async function getFacilityMasterList(
  params: SearchFacilityMasterVO
): Promise<FacilityMasterListResponse> {
  const searchParams = new URLSearchParams();
  if (params.facilityMasterName) searchParams.set("facilityMasterName", params.facilityMasterName);
  if (params.makingCompany) searchParams.set("makingCompany", params.makingCompany);
  if (params.modelName) searchParams.set("modelName", params.modelName);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<FacilityMasterListResponse>(
    `/api/setting/facilityList?${searchParams.toString()}`
  );
}

/**
 * 표준 설비 상세 조회
 */
export async function getFacilityMasterView(id: number): Promise<FacilityMasterDTO> {
  return apiClient.get<FacilityMasterDTO>(
    `/api/setting/facilityView?id=${id}`
  );
}

/**
 * 표준 설비 등록 (FormData)
 */
export async function addFacilityMaster(data: FacilityMasterVO): Promise<FacilityMasterDTO> {
  const formData = new FormData();

  if (data.id) formData.append("facility.id", String(data.id));
  formData.append("facility.name", data.name);
  formData.append("facility.use", data.use);
  if (data.makingCompany) formData.append("facility.makingCompany", data.makingCompany);
  if (data.makingCompanyPhone) formData.append("facility.makingCompanyPhone", data.makingCompanyPhone);
  if (data.modelName) formData.append("facility.modelName", data.modelName);
  if (data.electricityConsumption) formData.append("facility.electricityConsumption", data.electricityConsumption);
  if (data.capacity) formData.append("facility.capacity", data.capacity);
  if (data.fuelType) formData.append("facility.fuelType", data.fuelType);
  formData.append("facility.firstFacilityCategoryId", String(data.firstFacilityCategoryId));
  formData.append("facility.secondFacilityCategoryId", String(data.secondFacilityCategoryId));
  formData.append("facility.thirdFacilityCategoryId", String(data.thirdFacilityCategoryId));

  data.files?.forEach((file) => formData.append("files", file));
  data.imageFiles?.forEach((file) => formData.append("imageFiles", file));

  return apiClient.postForm<FacilityMasterDTO>("/api/setting/facilityAdd", formData);
}

/**
 * 표준 설비 수정 (FormData)
 */
export async function editFacilityMaster(data: FacilityMasterVO): Promise<FacilityMasterDTO> {
  const formData = new FormData();

  if (data.id) formData.append("facility.id", String(data.id));
  formData.append("facility.name", data.name);
  formData.append("facility.use", data.use);
  if (data.makingCompany) formData.append("facility.makingCompany", data.makingCompany);
  if (data.makingCompanyPhone) formData.append("facility.makingCompanyPhone", data.makingCompanyPhone);
  if (data.modelName) formData.append("facility.modelName", data.modelName);
  if (data.electricityConsumption) formData.append("facility.electricityConsumption", data.electricityConsumption);
  if (data.capacity) formData.append("facility.capacity", data.capacity);
  if (data.fuelType) formData.append("facility.fuelType", data.fuelType);
  formData.append("facility.firstFacilityCategoryId", String(data.firstFacilityCategoryId));
  formData.append("facility.secondFacilityCategoryId", String(data.secondFacilityCategoryId));
  formData.append("facility.thirdFacilityCategoryId", String(data.thirdFacilityCategoryId));

  data.files?.forEach((file) => formData.append("files", file));
  data.imageFiles?.forEach((file) => formData.append("imageFiles", file));

  return apiClient.putForm<FacilityMasterDTO>("/api/setting/facilityEdit", formData);
}

/**
 * 표준 설비 복사
 */
export async function copyFacilityMaster(id: number): Promise<FacilityMasterDTO> {
  return apiClient.post<FacilityMasterDTO>(`/api/setting/facilityCopy/${id}`);
}
