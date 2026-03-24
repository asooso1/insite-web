import { apiClient } from "./client";
import type {
  BuildingFullDTO,
  BuildingListResponse,
  BuildingSaveVO,
  SearchBuildingVO,
  BuildingUseTypeDTO,
  WideAreaOptionDTO,
  BaseAreaOptionDTO,
  CompanySelectDTO,
} from "@/lib/types/building";
import type { UserGroupDTO } from "@/lib/types/tbm";

// ============================================================================
// 건물 관리 CRUD (SiteController)
// ============================================================================

export async function getBuildingList(
  params: SearchBuildingVO & { page?: number; size?: number }
): Promise<BuildingListResponse> {
  const sp = new URLSearchParams();
  if (params.writeDateFrom) sp.set("writeDateFrom", params.writeDateFrom);
  if (params.writeDateTo) sp.set("writeDateTo", params.writeDateTo);
  if (params.buildingState) sp.set("buildingState", params.buildingState);
  if (params.buildingName) sp.set("buildingName", params.buildingName);
  if (params.clientId) sp.set("clientId", String(params.clientId));
  if (params.page !== undefined) sp.set("page", String(params.page));
  if (params.size !== undefined) sp.set("size", String(params.size));
  return apiClient.get<BuildingListResponse>(`/api/site/buildingList?${sp.toString()}`);
}

export async function getBuildingView(id: number): Promise<BuildingFullDTO> {
  return apiClient.get<BuildingFullDTO>(`/api/site/buildingView/${id}`);
}

export async function addBuilding(data: BuildingSaveVO): Promise<BuildingFullDTO> {
  return apiClient.postForm<BuildingFullDTO>("/api/site/buildingAdd", buildSaveFormData(data));
}

export async function editBuilding(data: BuildingSaveVO): Promise<BuildingFullDTO> {
  // 백엔드가 PUT이 아닌 POST로 수정 처리
  return apiClient.postForm<BuildingFullDTO>("/api/site/buildingEdit", buildSaveFormData(data));
}

export async function deleteBuilding(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/site/buildingDelete/${id}`);
}

export async function downloadBuildingListExcel(params: SearchBuildingVO): Promise<Blob> {
  const sp = new URLSearchParams();
  if (params.writeDateFrom) sp.set("writeDateFrom", params.writeDateFrom);
  if (params.writeDateTo) sp.set("writeDateTo", params.writeDateTo);
  if (params.buildingState) sp.set("buildingState", params.buildingState);
  if (params.buildingName) sp.set("buildingName", params.buildingName);
  if (params.clientId) sp.set("clientId", String(params.clientId));
  return apiClient.getBlob(`/api/site/buildingListExcelDownload?${sp.toString()}`);
}

function buildSaveFormData(data: BuildingSaveVO): FormData {
  const fd = new FormData();
  if (data.id) fd.append("building.id", String(data.id));
  fd.append("building.companyId", String(data.companyId));
  fd.append("building.name", data.name);
  fd.append("building.useType2Id", String(data.useType2Id));
  fd.append("building.state", data.state);
  fd.append("building.baseAreaId", String(data.baseAreaId));
  fd.append("building.wideAreaId", String(data.wideAreaId));
  fd.append("building.latitude", data.latitude);
  fd.append("building.longitude", data.longitude);
  fd.append("building.zipCode", data.zipCode);
  fd.append("building.address", data.address);
  fd.append("building.addressDetail", data.addressDetail);
  if (data.officePhone) fd.append("building.officePhone", data.officePhone);
  if (data.homePage) fd.append("building.homePage", data.homePage);
  if (data.chargeDepartment) fd.append("building.chargeDepartment", data.chargeDepartment);
  if (data.managerId) fd.append("building.managerId", String(data.managerId));
  if (data.productId) fd.append("building.productId", String(data.productId));
  if (data.contractTermStart) fd.append("building.contractTermStart", data.contractTermStart);
  if (data.contractTermEnd) fd.append("building.contractTermEnd", data.contractTermEnd);
  if (data.addressRoad) fd.append("building.addressRoad", data.addressRoad);
  if (data.note) fd.append("building.note", data.note);
  if (data.constructionCompany) fd.append("building.constructionCompany", data.constructionCompany);
  if (data.supervision) fd.append("building.supervision", data.supervision);
  if (data.completeDateStr) fd.append("building.completeDate", data.completeDateStr);
  if (data.constructStartDateStr) fd.append("building.constructStartDate", data.constructStartDateStr);
  if (data.constructEndDateStr) fd.append("building.constructEndDate", data.constructEndDateStr);
  if (data.height) fd.append("building.height", data.height);
  if (data.plottage) fd.append("building.plottage", data.plottage);
  if (data.structure) fd.append("building.structure", data.structure);
  if (data.buildingAreaSize) fd.append("building.buildingAreaSize", data.buildingAreaSize);
  if (data.floorAreaRatio) fd.append("building.floorAreaRatio", data.floorAreaRatio);
  if (data.totalFloorAreaSize) fd.append("building.totalFloorAreaSize", data.totalFloorAreaSize);
  if (data.buildingCoverageRatio) fd.append("building.buildingCoverageRatio", data.buildingCoverageRatio);
  if (data.landscapingAreaSize) fd.append("building.landscapingAreaSize", data.landscapingAreaSize);
  if (data.exclusiveUseRatio) fd.append("building.exclusiveUseRatio", data.exclusiveUseRatio);
  if (data.weatherX) fd.append("building.weatherX", data.weatherX);
  if (data.weatherY) fd.append("building.weatherY", data.weatherY);
  fd.append("building.serviceNcp", String(data.serviceNcp ?? false));
  fd.append("building.serviceFms", String(data.serviceFms ?? false));
  fd.append("building.serviceRms", String(data.serviceRms ?? false));
  fd.append("building.serviceEms", String(data.serviceEms ?? false));
  fd.append("building.serviceBim", String(data.serviceBim ?? false));
  fd.append("building.servicePatrol", String(data.servicePatrol ?? false));
  fd.append("building.excludeFromAnalysis", String(data.excludeFromAnalysis ?? false));
  return fd;
}

// ============================================================================
// 선택 옵션 조회 (폼용)
// ============================================================================

export async function getCompanySelectList(): Promise<CompanySelectDTO[]> {
  const res = await apiClient.get<{ data: CompanySelectDTO[] }>("/open/companyList");
  return res.data ?? [];
}

export async function getBuildingUseType1(): Promise<BuildingUseTypeDTO[]> {
  const res = await apiClient.get<{ data: BuildingUseTypeDTO[] }>("/open/building/useType1Id");
  return res.data ?? [];
}

export async function getBuildingUseType2(useType1Id: number): Promise<BuildingUseTypeDTO[]> {
  const res = await apiClient.get<{ data: BuildingUseTypeDTO[] }>(`/open/building/useType2Id/${useType1Id}`);
  return res.data ?? [];
}

export async function getWideAreaList(): Promise<WideAreaOptionDTO[]> {
  const res = await apiClient.get<{ data: WideAreaOptionDTO[] }>("/open/wideArea/wideAreaList");
  return res.data ?? [];
}

export async function getBaseAreaList(companyId: number): Promise<BaseAreaOptionDTO[]> {
  const res = await apiClient.get<{ data: BaseAreaOptionDTO[] }>(`/open/baseArea/baseAreaList/${companyId}?type=selection`);
  return res.data ?? [];
}

// ============================================================================
// 기존 빌딩 유틸 함수
// ============================================================================

export interface BuildingInfoDTO {
  buildingId: number;
  buildingName: string;
}

/**
 * 관리자 빌딩 통합검색 결과 DTO
 * GET /open/common/searchCommonList 응답
 */
export interface CommonListDTO {
  companyId: number;
  companyName: string;
  wideAreaId: number | null;
  wideAreaName: string | null;
  baseAreaId: number | null;
  baseAreaName: string | null;
  buildingId: number;
  buildingName: string;
  address: string | null;
  officePhone: string | null;
}

export interface UserBuildingListDTO {
  accountId: number;
  userId: string;
  accountName: string;
  buildings: BuildingInfoDTO[];
  isExisting: boolean;
}

/**
 * 빌딩 층 DTO
 */
export interface BuildingFloorDTO {
  id: number;
  buildingId: number;
  name: string;
  floorOrder: number;
}

/**
 * 빌딩 층 구역 DTO
 */
export interface BuildingFloorZoneDTO {
  id: number;
  buildingFloorId: number;
  name: string;
}

/**
 * 관리자 전용 전체 빌딩 목록 조회
 * Next.js API Route → GET /open/common/searchCommonList
 * keyword 빈 문자열 전달 시 전체 빌딩 반환
 */
export function getAdminBuildings(keyword: string = ""): Promise<CommonListDTO[]> {
  return apiClient.get<CommonListDTO[]>(
    `/api/buildings/admin-list?keyword=${encodeURIComponent(keyword)}&size=500`
  );
}

/**
 * 사용자에게 배정된 빌딩 목록 조회
 * GET /api/site/buildingAccount/buildings?userId={userId}
 */
export function getUserBuildings(userId: string): Promise<UserBuildingListDTO> {
  return apiClient.get<UserBuildingListDTO>(
    `/api/site/buildingAccount/buildings?userId=${encodeURIComponent(userId)}`
  );
}

/**
 * 빌딩의 층 목록 조회
 * GET /api/site/buildingFloor/{buildingId}
 */
export function getBuildingFloors(buildingId: number): Promise<BuildingFloorDTO[]> {
  return apiClient.get<BuildingFloorDTO[]>(`/api/site/buildingFloor/${buildingId}`);
}

/**
 * 빌딩 층의 구역 목록 조회
 * GET /api/site/buildingFloorZone/{floorId}
 */
export function getBuildingFloorZones(
  floorId: number
): Promise<BuildingFloorZoneDTO[]> {
  return apiClient.get<BuildingFloorZoneDTO[]>(
    `/api/site/buildingFloorZone/${floorId}`
  );
}

/**
 * 빌딩의 사용자 그룹(담당팀) 목록 조회
 * GET /api/site/userGroupView/{buildingId}
 */
export function getBuildingUserGroups(buildingId: number): Promise<UserGroupDTO[]> {
  return apiClient.get<UserGroupDTO[]>(`/api/site/userGroupView/${buildingId}`);
}
