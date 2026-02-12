/**
 * 시설(Facility) API 클라이언트
 *
 * csp-was FacilityController 연동
 */

import { apiClient } from "./client";
import type {
  FacilityListResponse,
  FacilityDTO,
  FacilityListDTO,
  SearchFacilityVO,
  FacilityVO,
} from "@/lib/types/facility";

// ============================================================================
// 시설 목록/조회
// ============================================================================

/**
 * 시설 목록 조회 (페이지네이션)
 */
export async function getFacilityList(
  params: SearchFacilityVO & { page?: number; size?: number }
): Promise<FacilityListResponse> {
  const searchParams = new URLSearchParams();

  // 기간
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);

  // 위치
  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.regionId) searchParams.set("regionId", String(params.regionId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.buildingFloorId)
    searchParams.set("buildingFloorId", String(params.buildingFloorId));

  // 분류
  if (params.firstFacilityCategoryId)
    searchParams.set("firstFacilityCategoryId", String(params.firstFacilityCategoryId));
  if (params.secondFacilityCategoryId)
    searchParams.set("secondFacilityCategoryId", String(params.secondFacilityCategoryId));
  if (params.thirdFacilityCategoryId)
    searchParams.set("thirdFacilityCategoryId", String(params.thirdFacilityCategoryId));

  // 상태
  if (params.state) searchParams.set("state", params.state);

  // 관제점
  if (params.controlPointId)
    searchParams.set("controlPointId", String(params.controlPointId));

  // 이력
  if (params.hasHistory !== undefined)
    searchParams.set("hasHistory", String(params.hasHistory));

  // 검색어
  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.locationCode) searchParams.set("locationCode", params.locationCode);
  if (params.locationKeyword) searchParams.set("locationKeyword", params.locationKeyword);
  if (params.categoryName) searchParams.set("categoryName", params.categoryName);

  // 정렬
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.direction) searchParams.set("direction", params.direction);

  // 페이지네이션
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<FacilityListResponse>(
    `/api/facility/facilityList?${searchParams.toString()}`
  );
}

/**
 * 빌딩별 시설 목록 조회 (전체)
 */
export async function getFacilityListByBuilding(
  buildingId: number
): Promise<FacilityListDTO[]> {
  return apiClient.get<FacilityListDTO[]>(
    `/api/facility/facilityList/${buildingId}`
  );
}

/**
 * 시설 상세 조회
 */
export async function getFacilityView(id: number): Promise<FacilityDTO> {
  return apiClient.get<FacilityDTO>(`/api/facility/facilityView/${id}`);
}

/**
 * 시설 장비 번호 목록 조회 (중복 체크용)
 */
export async function getFacilityNos(buildingId: number): Promise<string[]> {
  return apiClient.get<string[]>(`/api/facility/facilityNos/${buildingId}`);
}

// ============================================================================
// 시설 등록/수정
// ============================================================================

/**
 * 시설 등록
 */
export async function addFacility(data: FacilityVO): Promise<FacilityDTO> {
  const formData = new FormData();

  // facilityVo 객체로 전송
  formData.append("facilityVo.companyId", String(data.companyId));
  formData.append("facilityVo.buildingId", String(data.buildingId));
  formData.append("facilityVo.buildingFloorId", String(data.buildingFloorId));
  if (data.buildingFloorZoneId)
    formData.append("facilityVo.buildingFloorZoneId", String(data.buildingFloorZoneId));
  formData.append("facilityVo.facilityMasterId", String(data.facilityMasterId));
  formData.append("facilityVo.facilityNo", data.facilityNo);
  formData.append("facilityVo.facilityName", data.facilityName);
  formData.append("facilityVo.use", data.use);
  formData.append("facilityVo.state", data.state);
  formData.append("facilityVo.buildingUserGroupId", String(data.buildingUserGroupId));

  // 옵션 필드
  if (data.makingCompany) formData.append("facilityVo.makingCompany", data.makingCompany);
  if (data.makeDate) formData.append("facilityVo.makeDate", data.makeDate);
  if (data.sellCompany) formData.append("facilityVo.sellCompany", data.sellCompany);
  if (data.sellCompanyPhone)
    formData.append("facilityVo.sellCompanyPhone", data.sellCompanyPhone);
  if (data.capacity) formData.append("facilityVo.capacity", data.capacity);
  if (data.electricityConsumption)
    formData.append("facilityVo.electricityConsumption", data.electricityConsumption);
  if (data.cop) formData.append("facilityVo.cop", data.cop);
  if (data.modelName) formData.append("facilityVo.modelName", data.modelName);
  if (data.snNo) formData.append("facilityVo.snNo", data.snNo);
  if (data.installDate) formData.append("facilityVo.installDate", data.installDate);
  if (data.startRunDate) formData.append("facilityVo.startRunDate", data.startRunDate);
  if (data.chargerId) formData.append("facilityVo.chargerId", String(data.chargerId));
  if (data.purchaseUnitPrice)
    formData.append("facilityVo.purchaseUnitPrice", data.purchaseUnitPrice);
  if (data.fuelType) formData.append("facilityVo.fuelType", data.fuelType);
  if (data.guaranteeExpireDate)
    formData.append("facilityVo.guaranteeExpireDate", data.guaranteeExpireDate);
  if (data.persistPeriod)
    formData.append("facilityVo.persistPeriod", String(data.persistPeriod));

  // 파일
  data.imgFiles?.forEach((file) => formData.append("imgFiles", file));
  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.postForm<FacilityDTO>("/api/facility/addFacility", formData);
}

/**
 * 시설 수정
 */
export async function updateFacility(data: FacilityVO): Promise<FacilityDTO> {
  const formData = new FormData();

  if (data.id) formData.append("facilityVo.id", String(data.id));
  formData.append("facilityVo.companyId", String(data.companyId));
  formData.append("facilityVo.buildingId", String(data.buildingId));
  formData.append("facilityVo.buildingFloorId", String(data.buildingFloorId));
  if (data.buildingFloorZoneId)
    formData.append("facilityVo.buildingFloorZoneId", String(data.buildingFloorZoneId));
  formData.append("facilityVo.facilityMasterId", String(data.facilityMasterId));
  formData.append("facilityVo.facilityNo", data.facilityNo);
  formData.append("facilityVo.facilityName", data.facilityName);
  formData.append("facilityVo.use", data.use);
  formData.append("facilityVo.state", data.state);
  formData.append("facilityVo.buildingUserGroupId", String(data.buildingUserGroupId));

  if (data.makingCompany) formData.append("facilityVo.makingCompany", data.makingCompany);
  if (data.makeDate) formData.append("facilityVo.makeDate", data.makeDate);
  if (data.sellCompany) formData.append("facilityVo.sellCompany", data.sellCompany);
  if (data.sellCompanyPhone)
    formData.append("facilityVo.sellCompanyPhone", data.sellCompanyPhone);
  if (data.capacity) formData.append("facilityVo.capacity", data.capacity);
  if (data.electricityConsumption)
    formData.append("facilityVo.electricityConsumption", data.electricityConsumption);
  if (data.cop) formData.append("facilityVo.cop", data.cop);
  if (data.modelName) formData.append("facilityVo.modelName", data.modelName);
  if (data.snNo) formData.append("facilityVo.snNo", data.snNo);
  if (data.installDate) formData.append("facilityVo.installDate", data.installDate);
  if (data.startRunDate) formData.append("facilityVo.startRunDate", data.startRunDate);
  if (data.chargerId) formData.append("facilityVo.chargerId", String(data.chargerId));
  if (data.purchaseUnitPrice)
    formData.append("facilityVo.purchaseUnitPrice", data.purchaseUnitPrice);
  if (data.fuelType) formData.append("facilityVo.fuelType", data.fuelType);
  if (data.guaranteeExpireDate)
    formData.append("facilityVo.guaranteeExpireDate", data.guaranteeExpireDate);
  if (data.persistPeriod)
    formData.append("facilityVo.persistPeriod", String(data.persistPeriod));

  data.imgFiles?.forEach((file) => formData.append("imgFiles", file));
  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.putForm<FacilityDTO>("/api/facility/updateFacility", formData);
}

// ============================================================================
// 엑셀 다운로드
// ============================================================================

/**
 * 시설 목록 엑셀 다운로드
 */
export async function downloadFacilityListExcel(
  params: SearchFacilityVO
): Promise<Blob> {
  const searchParams = new URLSearchParams();

  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.state) searchParams.set("state", params.state);
  if (params.keyword) searchParams.set("keyword", params.keyword);

  return apiClient.getBlob(
    `/api/facility/facilityListExcelDownload?${searchParams.toString()}`
  );
}

// ============================================================================
// 시설 작업 이력
// ============================================================================

/**
 * 시설 작업지시 이력 조회
 */
export async function getFacilityWorkOrderList(params: {
  facilityId: number;
  page?: number;
  size?: number;
}): Promise<PageResponse<unknown>> {
  const searchParams = new URLSearchParams();

  searchParams.set("facilityId", String(params.facilityId));
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<PageResponse<unknown>>(
    `/api/facility/workOrderList?${searchParams.toString()}`
  );
}

/**
 * 시설 이력 목록 조회
 */
export async function getFacilityHistoryList(
  params: SearchFacilityVO & { page?: number; size?: number }
): Promise<PageResponse<unknown>> {
  const searchParams = new URLSearchParams();

  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<PageResponse<unknown>>(
    `/api/facility/facilityHistoryList?${searchParams.toString()}`
  );
}

// PageResponse import를 위해 타입 재정의
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
