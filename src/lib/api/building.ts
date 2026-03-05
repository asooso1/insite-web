import { apiClient } from "./client";

export interface BuildingInfoDTO {
  buildingId: number;
  buildingName: string;
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
