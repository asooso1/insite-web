/**
 * 클라이언트(Client/Company) API 클라이언트
 *
 * csp-was ClientController 연동
 */

import { apiClient } from "./client";
import type {
  ClientListResponse,
  CompanyDTO,
  SearchClientVO,
  ClientAddVO,
  ClientEditVO,
  ClientBaseAreaAddVO,
  BaseAreaVO,
} from "@/lib/types/client";

// ============================================================================
// 클라이언트 목록/조회
// ============================================================================

/**
 * 클라이언트 목록 조회 (페이지네이션)
 */
export async function getClientList(
  params: SearchClientVO & { page?: number; size?: number }
): Promise<ClientListResponse> {
  const searchParams = new URLSearchParams();

  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.writeDateFrom) searchParams.set("writeDateFrom", params.writeDateFrom);
  if (params.writeDateTo) searchParams.set("writeDateTo", params.writeDateTo);
  if (params.searchCode) searchParams.set("searchCode", params.searchCode);
  if (params.searchKeyword) searchParams.set("searchKeyword", params.searchKeyword);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<ClientListResponse>(
    `/api/client/clientList?${searchParams.toString()}`
  );
}

/**
 * 클라이언트 상세 조회
 */
export async function getClientView(id: number): Promise<CompanyDTO> {
  return apiClient.get<CompanyDTO>(`/api/client/clientView/${id}`);
}

/**
 * 사업자번호 중복 확인
 */
export async function checkBusinessNo(businessNo: string): Promise<boolean> {
  return apiClient.get<boolean>(
    `/api/client/clientAdd/isBusinessNo?businessNo=${businessNo}`
  );
}

// ============================================================================
// 클라이언트 등록/수정/삭제
// ============================================================================

/**
 * 클라이언트 등록 (FormData)
 */
export async function addClient(data: ClientAddVO): Promise<CompanyDTO> {
  const formData = new FormData();

  formData.append("client.businessNo", data.businessNo);
  formData.append("client.name", data.name);
  formData.append("client.phone", data.phone);
  if (data.fax) formData.append("client.fax", data.fax);
  formData.append("client.officerName", data.officerName);
  formData.append("client.officerPhone", data.officerPhone);
  if (data.officerMobile) formData.append("client.officerMobile", data.officerMobile);
  if (data.officerEmail) formData.append("client.officerEmail", data.officerEmail);
  formData.append("client.state", data.state);
  if (data.note) formData.append("client.note", data.note);
  if (data.weatherX) formData.append("client.weatherX", data.weatherX);
  if (data.weatherY) formData.append("client.weatherY", data.weatherY);
  formData.append("client.zipCode", data.zipCode);
  formData.append("client.address", data.address);
  if (data.addressRoad) formData.append("client.addressRoad", data.addressRoad);
  formData.append("client.addressDetail", data.addressDetail);

  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.postForm<CompanyDTO>("/api/client/clientAdd", formData);
}

/**
 * 클라이언트 수정 (FormData)
 */
export async function editClient(data: ClientEditVO): Promise<CompanyDTO> {
  const formData = new FormData();

  formData.append("client.id", String(data.id));
  formData.append("client.name", data.name);
  formData.append("client.phone", data.phone);
  if (data.fax) formData.append("client.fax", data.fax);
  formData.append("client.officerName", data.officerName);
  formData.append("client.officerPhone", data.officerPhone);
  if (data.officerMobile) formData.append("client.officerMobile", data.officerMobile);
  if (data.officerEmail) formData.append("client.officerEmail", data.officerEmail);
  formData.append("client.state", data.state);
  if (data.note) formData.append("client.note", data.note);
  if (data.weatherX) formData.append("client.weatherX", data.weatherX);
  if (data.weatherY) formData.append("client.weatherY", data.weatherY);
  formData.append("client.zipCode", data.zipCode);
  formData.append("client.address", data.address);
  if (data.addressRoad) formData.append("client.addressRoad", data.addressRoad);
  formData.append("client.addressDetail", data.addressDetail);

  data.files?.forEach((file) => formData.append("files", file));

  return apiClient.putForm<CompanyDTO>("/api/client/clientEdit", formData);
}

/**
 * 클라이언트 삭제
 */
export async function deleteClient(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/client/clientDelete?id=${id}`);
}

// ============================================================================
// 거점 관리
// ============================================================================

/**
 * 거점 등록
 */
export async function addBaseArea(data: ClientBaseAreaAddVO): Promise<void> {
  return apiClient.post<void>("/api/client/clientBaseArea", data);
}

/**
 * 거점 상태 변경
 */
export async function editBaseAreaState(data: BaseAreaVO): Promise<void> {
  return apiClient.put<void>("/api/client/clientBaseArea", data);
}

// ============================================================================
// 엑셀 다운로드
// ============================================================================

/**
 * 클라이언트 목록 엑셀 다운로드
 */
export async function downloadClientListExcel(
  params: SearchClientVO
): Promise<Blob> {
  const searchParams = new URLSearchParams();

  if (params.searchCode) searchParams.set("searchCode", params.searchCode);
  if (params.searchKeyword) searchParams.set("searchKeyword", params.searchKeyword);

  return apiClient.getBlob(
    `/api/client/clientListExelDownload?${searchParams.toString()}`
  );
}
