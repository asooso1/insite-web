import { apiClient } from "./client";

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
