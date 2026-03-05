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
 * 사용자에게 배정된 빌딩 목록 조회
 * GET /api/site/buildingAccount/buildings?userId={userId}
 */
export function getUserBuildings(userId: string): Promise<UserBuildingListDTO> {
  return apiClient.get<UserBuildingListDTO>(
    `/api/site/buildingAccount/buildings?userId=${encodeURIComponent(userId)}`
  );
}
