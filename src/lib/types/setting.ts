/**
 * 설정(Setting) 관련 타입 정의
 *
 * csp-was SettingController 기반
 * - 기본 코드(Config)
 * - 설비 분류(FacilityCategory) - 트리 구조
 * - 표준 설비(FacilityMaster) - CRUD
 */

import type { PageResponse } from "./facility";

// ============================================================================
// Enums
// ============================================================================

/**
 * 연료 유형
 */
export const FuelType = {
  ELECTRICITY: "ELECTRICITY",
  LNG: "LNG",
  LPG: "LPG",
  DIESEL: "DIESEL",
  LAMP_OIL: "LAMP_OIL",
} as const;

export type FuelType = (typeof FuelType)[keyof typeof FuelType];

export const FuelTypeLabel: Record<FuelType, string> = {
  ELECTRICITY: "전기",
  LNG: "LNG",
  LPG: "LPG",
  DIESEL: "경유",
  LAMP_OIL: "등유",
};

/**
 * 코드 입력 유형
 */
export const InputType = {
  RADIO: "RADIO",
  CHECKBOX: "CHECKBOX",
  TEXT: "TEXT",
  BOOLEAN: "BOOLEAN",
} as const;

export type InputType = (typeof InputType)[keyof typeof InputType];

export const InputTypeLabel: Record<InputType, string> = {
  RADIO: "단건선택",
  CHECKBOX: "다건선택",
  TEXT: "직접입력",
  BOOLEAN: "참/거짓",
};

// ============================================================================
// 기본 코드 DTOs
// ============================================================================

/**
 * 이름-값 쌍 DTO
 */
export interface NameValueDTO {
  name: string;
  value: string;
  checked: boolean;
}

/**
 * 기본 코드 DTO
 */
export interface ConfigDTO {
  id: number;
  configGroupId: number;
  sortNo: number;
  code: string;
  name: string;
  settingValue: string;
  enabled: boolean;
  inputType: string;
  inputTypeName: string;
  description: string;
  scope: string;
  scopeName: string;
  dataOption: string;
  writerId: number;
  writeDate: string;
  lastModifierId: number;
  lastModifyDate: string;
  configGroupCode: string;
  configGroupName: string;
  settings: NameValueDTO[];
}

/**
 * 기본 코드 그룹 DTO (목록용)
 */
export interface ConfigGroupDTO {
  id: number;
  code: string;
  name: string;
  description: string;
  configs: ConfigDTO[];
}

/**
 * 기본 코드 수정 VO
 */
export interface ConfigVO {
  id: number;
  sortNo: number;
  name: string;
  settingValue: string;
  enabled: boolean;
  description: string;
  configGroupName: string;
}

// ============================================================================
// 설비 분류 DTOs
// ============================================================================

/**
 * 설비 분류 트리 DTO
 */
export interface FacilityCategoryTreeDTO {
  id: number;
  value: string;
  opened: boolean;
  depth: number;
  code: string;
  sortNo: number;
  isUsed: boolean;
  firstCategoryId: number;
  secondCategoryId: number;
  firstCategoryName: string;
  secondCategoryName: string;
  items: FacilityCategoryTreeDTO[];
}

/**
 * 설비 분류 등록/수정 VO
 */
export interface FacilityCategoryVO {
  id?: number;
  depth: number;
  firstFacilityCategoryId?: number;
  secondFacilityCategoryId?: number;
  code: string;
  name: string;
  sortNo: number;
  used: boolean;
}

// ============================================================================
// 표준 설비 DTOs
// ============================================================================

/**
 * 표준 설비 파일 DTO
 */
export interface FacilityMasterFileDTO {
  id: number;
  facilityMasterId: number;
  sortNo: number;
  originFileName: string;
  filePath: string;
  size: number;
  image: boolean;
}

/**
 * 표준 설비 DTO
 */
export interface FacilityMasterDTO {
  id: number;
  name: string;
  use: string;
  makingCompany: string;
  makingCompanyPhone: string;
  modelName: string;
  electricityConsumption: string;
  capacity: string;
  fuelType: string;
  fuelTypeName: string;
  writerId: number;
  writerName: string;
  writerUserId: string;
  writeDate: string;
  lastModifierId: number;
  lastModifierName: string;
  lastModifierUserId: string;
  lastModifyDate: string;
  firstFacilityCategoryId: number;
  secondFacilityCategoryId: number;
  thirdFacilityCategoryId: number;
  facilityCategory1Name: string;
  facilityCategory2Name: string;
  facilityCategory3Name: string;
  facilityCategoryParentId: number;
  facilityMasterFileDTOs: FacilityMasterFileDTO[];
  imageFiles: FacilityMasterFileDTO[];
}

/**
 * 표준 설비 검색 조건
 */
export interface SearchFacilityMasterVO {
  facilityMasterName?: string;
  makingCompany?: string;
  modelName?: string;
  page?: number;
  size?: number;
}

/**
 * 표준 설비 등록/수정 VO
 */
export interface FacilityMasterVO {
  id?: number;
  name: string;
  use: string;
  makingCompany?: string;
  makingCompanyPhone?: string;
  modelName?: string;
  electricityConsumption?: string;
  capacity?: string;
  fuelType?: FuelType;
  firstFacilityCategoryId: number;
  secondFacilityCategoryId: number;
  thirdFacilityCategoryId: number;
  files?: File[];
  imageFiles?: File[];
}

// ============================================================================
// Search VOs
// ============================================================================

export interface SearchKeywordVO {
  searchCode?: string;
  searchKeyword?: string;
}

// ============================================================================
// API Responses
// ============================================================================

export type FacilityMasterListResponse = PageResponse<FacilityMasterDTO>;
