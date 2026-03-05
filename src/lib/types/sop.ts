/**
 * SOP(표준운영절차) 관련 타입 정의
 *
 * csp-was WorkOrderController - sopXxx 엔드포인트 기반
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * SOP 사용 여부
 */
export const SopState = {
  USE: "USE",
  END: "END",
} as const;

export type SopState = (typeof SopState)[keyof typeof SopState];

/**
 * SOP 상태 한글 라벨
 */
export const SopStateLabel: Record<SopState, string> = {
  USE: "사용",
  END: "종료",
};

/**
 * SOP 상태 스타일 (StatusBadge용)
 */
export const SopStateStyle: Record<SopState, "pending" | "inProgress" | "completed" | "cancelled"> = {
  USE: "inProgress",
  END: "completed",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * SOP 작업순서 항목 DTO
 */
export interface SopJobOrderDTO {
  id?: number;
  jobContentFirstOrder: number;
  jobContentSecondOrder: number;
  jobContents: string;
  used: boolean;
}

/**
 * SOP 변경이력 DTO
 */
export interface SopHistoryDTO {
  version: number;
  title: string;
  jobOrderCount: number;
  writeDate: string;
  state: SopState;
}

/**
 * SOP 파일 DTO
 */
export interface SopFileDTO {
  id: number;
  sopId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

/**
 * SOP 키워드 DTO
 */
export interface SopKeywordDTO {
  id: number;
  sopId: number;
  keyword: string;
}

/**
 * SOP 상세 DTO
 */
export interface SopDTO {
  id: number;
  companyId: number;
  buildingId: number;
  title: string;
  explain: string;
  facilityCategoryId: number;
  facilityCategoryName: string;
  sopState: SopState;
  sopKeyWord: string; // "#" 구분자로 구분된 키워드
  useSopCommonImg: boolean;
  version: number;
  sopJobOrders: SopJobOrderDTO[];
  sopFileDTOs: SopFileDTO[];
  sopKeyWordDTOs: SopKeywordDTO[];
  sopHistoryDTOs: SopHistoryDTO[];
  buildingDTO: {
    id: number;
    name: string;
  };
  writerName: string;
  writerCompanyName: string;
  writeDate: string;
}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * SOP 검색 조건
 */
export interface SearchSopVO {
  companyId?: number;
  buildingId?: number;
  facilityCategoryId?: number;
  sopState?: SopState;
  searchCode?: "title" | "keyword";
  searchKeyword?: string;
  writeDateFrom?: string;
  writeDateTo?: string;
  page?: number;
  size?: number;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * SOP 등록/수정 VO
 */
export interface SopVO {
  title: string;
  explain?: string;
  facilityCategoryId: number;
  sopState: SopState;
  sopKeyWord: string; // "#" 구분자로 구분된 키워드
  useSopCommonImg: boolean;
  sopJobOrders: Array<{
    jobContentFirstOrder: number;
    jobContentSecondOrder: number;
    jobContents: string;
  }>;
  imgFile?: File;
  buildingId: number;
}

// ============================================================================
// API Response
// ============================================================================

/**
 * 페이지네이션 응답 (work-order.ts에서 import)
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * SOP 목록 응답
 */
export type SopListResponse = PageResponse<SopDTO>;
