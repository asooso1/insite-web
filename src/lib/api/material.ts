/**
 * 자재(Material) API 클라이언트
 *
 * csp-was MaterialController 연동
 */

import { apiClient } from "./client";
import type {
  MaterialListResponse,
  MaterialDTO,
  SearchMaterialVO,
  MaterialVO,
  MaterialStockVO,
} from "@/lib/types/material";

// ============================================================================
// 자재 목록/조회
// ============================================================================

/**
 * 자재 목록 조회 (페이지네이션)
 */
export async function getMaterialList(
  params: SearchMaterialVO & { page?: number; size?: number }
): Promise<MaterialListResponse> {
  const searchParams = new URLSearchParams();

  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.buildingId) searchParams.set("buildingId", String(params.buildingId));
  if (params.buildingFloorId) searchParams.set("buildingFloorId", String(params.buildingFloorId));
  if (params.buildingFloorZoneId) searchParams.set("buildingFloorZoneId", String(params.buildingFloorZoneId));
  if (params.userGroupId) searchParams.set("userGroupId", String(params.userGroupId));
  if (params.searchCode) searchParams.set("searchCode", params.searchCode);
  if (params.searchKeyword) searchParams.set("searchKeyword", params.searchKeyword);
  if (params.name) searchParams.set("name", params.name);
  if (params.type) searchParams.set("type", params.type);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<MaterialListResponse>(
    `/api/material/materialList?${searchParams.toString()}`
  );
}

/**
 * 자재 상세 조회
 */
export async function getMaterialView(id: number): Promise<MaterialDTO> {
  return apiClient.get<MaterialDTO>(`/api/material/materialView/${id}`);
}

/**
 * 자재 중복 확인
 */
export async function checkMaterialExists(
  buildingFloorZoneId: number,
  name: string
): Promise<boolean> {
  return apiClient.get<boolean>(
    `/api/material/existMaterial/${buildingFloorZoneId}/${encodeURIComponent(name)}`
  );
}

// ============================================================================
// 자재 등록/수정/삭제
// ============================================================================

/**
 * 자재 등록 (FormData)
 */
export async function addMaterial(data: MaterialVO): Promise<MaterialDTO> {
  const formData = new FormData();

  if (data.id) formData.append("material.id", String(data.id));
  formData.append("material.buildingFloorZoneId", String(data.buildingFloorZoneId));
  formData.append("material.userGroupId", String(data.userGroupId));
  formData.append("material.name", data.name);
  formData.append("material.type", data.type);
  formData.append("material.state", data.state);
  if (data.privateCode) formData.append("material.privateCode", data.privateCode);
  if (data.standard) formData.append("material.standard", data.standard);
  if (data.unit) formData.append("material.unit", data.unit);
  if (data.suitableStock !== undefined) formData.append("material.suitableStock", String(data.suitableStock));
  if (data.connectWorkOrder !== undefined) formData.append("material.connectWorkOrder", String(data.connectWorkOrder));
  if (data.stockCnt !== undefined) formData.append("material.stockCnt", String(data.stockCnt));
  if (data.description) formData.append("material.description", data.description);

  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.postForm<MaterialDTO>("/api/material/materialAdd", formData);
}

/**
 * 자재 수정 (FormData)
 */
export async function editMaterial(data: MaterialVO): Promise<MaterialDTO> {
  const formData = new FormData();

  if (data.id) formData.append("material.id", String(data.id));
  formData.append("material.buildingFloorZoneId", String(data.buildingFloorZoneId));
  formData.append("material.userGroupId", String(data.userGroupId));
  formData.append("material.name", data.name);
  formData.append("material.type", data.type);
  formData.append("material.state", data.state);
  if (data.privateCode) formData.append("material.privateCode", data.privateCode);
  if (data.standard) formData.append("material.standard", data.standard);
  if (data.unit) formData.append("material.unit", data.unit);
  if (data.suitableStock !== undefined) formData.append("material.suitableStock", String(data.suitableStock));
  if (data.connectWorkOrder !== undefined) formData.append("material.connectWorkOrder", String(data.connectWorkOrder));
  if (data.stockCnt !== undefined) formData.append("material.stockCnt", String(data.stockCnt));
  if (data.description) formData.append("material.description", data.description);

  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.postForm<MaterialDTO>("/api/material/materialEdit", formData);
}

/**
 * 자재 삭제
 */
export async function deleteMaterial(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/material/materialDelete/${id}`);
}

// ============================================================================
// 재고 관리
// ============================================================================

/**
 * 자재 재고 조정 (입고/출고)
 */
export async function addMaterialStock(data: MaterialStockVO): Promise<void> {
  return apiClient.post<void>("/api/material/materialStock", data);
}
