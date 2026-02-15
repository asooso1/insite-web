/**
 * 클라이언트(Client) API 클라이언트
 *
 * csp-was ClientController 연동
 */

import { apiClient } from "./client";
import type {
  CompanyDTO,
  ClientViewDTO,
  SearchClientVO,
  ClientVO,
  BaseAreaVO,
  PageResponse,
} from "@/lib/types/client";

// ============================================================================
// 클라이언트 목록/조회
// ============================================================================

/**
 * 클라이언트 목록 조회 (페이지네이션)
 */
export async function getClientList(
  params: SearchClientVO & { page?: number; size?: number }
): Promise<PageResponse<CompanyDTO>> {
  const searchParams = new URLSearchParams();

  if (params.companyId) searchParams.set("companyId", String(params.companyId));
  if (params.searchCode) searchParams.set("searchCode", params.searchCode);
  if (params.searchKeyword) searchParams.set("searchKeyword", params.searchKeyword);
  if (params.writeDateFrom) searchParams.set("writeDateFrom", params.writeDateFrom);
  if (params.writeDateTo) searchParams.set("writeDateTo", params.writeDateTo);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<PageResponse<CompanyDTO>>(
    `/api/client/clientList?${searchParams.toString()}`
  );
}

/**
 * 클라이언트 상세 조회
 */
export async function getClientView(id: number): Promise<ClientViewDTO> {
  return apiClient.get<ClientViewDTO>(`/api/client/clientView/${id}`);
}

/**
 * 사업자번호 중복 확인
 */
export async function checkBusinessNo(businessNo: string): Promise<boolean> {
  return apiClient.get<boolean>(
    `/api/client/clientAdd/isBusinessNo?businessNo=${encodeURIComponent(businessNo)}`
  );
}

// ============================================================================
// 클라이언트 등록/수정/삭제
// ============================================================================

/**
 * FormData 구성 헬퍼
 */
function buildClientFormData(data: ClientVO): FormData {
  const formData = new FormData();

  if (data.id) formData.append("id", String(data.id));
  formData.append("businessNo", data.businessNo);
  formData.append("name", data.name);
  formData.append("phone", data.phone);
  if (data.fax) formData.append("fax", data.fax);
  formData.append("officerName", data.officerName);
  formData.append("officerPhone", data.officerPhone);
  if (data.officerMobile) formData.append("officerMobile", data.officerMobile);
  if (data.officerEmail) formData.append("officerEmail", data.officerEmail);
  formData.append("state", data.state);
  if (data.note) formData.append("note", data.note);
  formData.append("zipCode", data.zipCode);
  formData.append("address", data.address);
  formData.append("addressRoad", data.addressRoad);
  formData.append("addressDetail", data.addressDetail);
  if (data.weatherX) formData.append("weatherX", data.weatherX);
  if (data.weatherY) formData.append("weatherY", data.weatherY);

  // 로고 파일
  data.files?.forEach((file) => formData.append("files", file));

  return formData;
}

/**
 * 클라이언트 등록
 */
export async function addClient(data: ClientVO): Promise<void> {
  const formData = buildClientFormData(data);
  return apiClient.postForm<void>("/api/client/clientAdd", formData);
}

/**
 * 클라이언트 수정
 */
export async function updateClient(data: ClientVO): Promise<void> {
  const formData = buildClientFormData(data);
  return apiClient.putForm<void>("/api/client/clientEdit", formData);
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
export async function addBaseArea(data: BaseAreaVO): Promise<void> {
  return apiClient.post<void>("/api/client/clientBaseArea", data);
}

/**
 * 거점 상태 변경
 */
export async function updateBaseArea(data: BaseAreaVO): Promise<void> {
  return apiClient.put<void>("/api/client/clientBaseArea", data);
}
