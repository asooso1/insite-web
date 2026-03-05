/**
 * 분석(Analysis) 관련 타입 정의
 *
 * csp-was AnalysisController 기반
 */

// ============================================================================
// 사용 현황 (Usage Status)
// ============================================================================

export interface UsageStatusSummaryDTO {
  buildingCount: number;
  buildingAccountWorkerAverage: number;
  totalCount: number;
  approveCountAverage: number;
  workOrderCountAverage: number;
  personalWorkOrderAverage: number;
  complainCountAverage: number;
  billCountAverage: number;
  reportCountAverage: number;
  fmsItemCountAverage: number;
  nfcCountAverage: number;
  dutyCountAverage: number;
}

export interface UsageStatusDTO {
  prevMonth: UsageStatusSummaryDTO;
  thisMonth: UsageStatusSummaryDTO;
  listData: UsageStatusItemDTO[];
}

export interface UsageStatusItemDTO {
  chargeDepartment: string;
  managerName: string;
  buildingName: string;
  featureUsageRate: number;
  participationRate: number;
  participant: number;
  total: number;
  workOrderCount: number;
  avgWorkOrderCount: number;
  personalWorkOrderCount: number;
  avgPersonalWorkOrderCount: number;
  vocCount: number;
  billCount: number;
  reportCount: number;
  materialCount: number;
  nfcCount: number;
  dutyCount: number;
}

// ============================================================================
// 통계 분석 (Statistics)
// ============================================================================

export interface StatisticsADTO {
  usageRankingDTOS: {
    buildingName: string[];
    scheduleScore: number[];
    workOrderScore: number[];
    reportScore: number[];
    invoiceBillScore: number[];
    vocScore: number[];
    materialScore: number[];
  };
  workOrderApproveDTOS: { buildingName: string; value: number }[];
  buildingScheduleDTOS: { buildingName: string; value: number }[];
  reportDTOS: { buildingName: string; value: number }[];
  vocDTOS: { buildingName: string; value: number }[];
  materialDTOS: { buildingName: string; value: number }[];
}

export interface StatisticsBDTO {
  usageJobTypeDTO: { jobType: string[]; value: number[] };
  usageRankingJobTypeDTO: {
    jobTypeGroup: string[];
    workOrderAvg: number[];
    reportAvg: number[];
    scheduleAvg: number[];
    invoiceBillAvg: number[];
  };
}

export interface StatisticsCItemDTO {
  chargeDepartment: string;
  buildingName: string;
  worker: number;
  task: number;
  complain: number;
  fmsItem: number;
  report: number;
  bill: number;
}

// ============================================================================
// FMS 트렌드 (FMS Trend)
// ============================================================================

export interface TrendControlPointDTO {
  controlPointId: number;
  controlPointName: string;
  controlPointMeasureTypeName: string;
  controlPointMeasureUnit: string;
  controlPointPriorityName?: string;
  controlPointStateName?: string;
  controlPointUpperLimit?: number;
  controlPointLowestLimit?: number;
  buildingName: string;
  buildingFloor?: string;
  facilityName?: string;
  facilityCategoryPath?: string;
}

export interface TrendDataDTO {
  timestamp: string;
  value: number;
  compareValue?: number;
}

export interface TrendFMSListItemDTO {
  controlPointId: number;
  controlPointName: string;
  controlPointMeasureTypeName: string;
  controlPointMeasureUnit: string;
  controlPointStateName?: string;
  companyName?: string;
  buildingName: string;
  buildingFloor?: string;
  facilityName?: string;
  facilityCategoryPath?: string;
}

export interface SearchTrendVO {
  firstFacilityCategoryId?: number;
  secondFacilityCategoryId?: number;
  thirdFacilityCategoryId?: number;
  searchCode?: string;
  searchKeyword?: string;
  page?: number;
  size?: number;
}

// ============================================================================
// 자재/인력/팀 분석 공통 파라미터
// ============================================================================

export interface AnalysisYearMonthVO {
  searchYear: number;
  searchMonth: number;
  buildingId?: number;
}

// ============================================================================
// 자재 분석 (Material Analysis)
// ============================================================================

export interface MaterialAnalysisItemDTO {
  materialName: string;
  count: number;
}

export interface FmsItemHistoryDTO {
  materialSuitableOfCurrentStockDTOs: MaterialAnalysisItemDTO[];
  materialSuitableOfUseStockDTOs: MaterialAnalysisItemDTO[];
  materialUseTimeDTOs: MaterialAnalysisItemDTO[];
  regularWorkOrderMaterials: MaterialAnalysisItemDTO[];
  generalConstructionMaterials: MaterialAnalysisItemDTO[];
  generalComplaintMaterials: MaterialAnalysisItemDTO[];
  generalIncidentMaterials: MaterialAnalysisItemDTO[];
  legalMachineryMaterials: MaterialAnalysisItemDTO[];
  legalElectricalMaterials: MaterialAnalysisItemDTO[];
}

// ============================================================================
// 인력 분석 (Labor Analysis)
// ============================================================================

export interface FmsLaborDTO {
  laborTrendChartDTOs: { label: string; assigned: number; processed: number }[];
  laborRateChartDTOs: { label: string; rate: number }[];
  assignmentChartDTOs: { label: string; count: number }[];
  laborDistributionDTOs: {
    alarmLevel: string;
    prevMonth: number;
    thisMonth: number;
    average: number;
  }[];
}

// ============================================================================
// 팀 작업 분석 (Team Work Analysis)
// ============================================================================

export interface FmsTeamDTO {
  workOrderOccurrenceDTOs: { label: string; count: number }[];
  workOrderProcessRateDTOs: { label: string; rate: number }[];
  workOrderAvgCompletionTimeDTOs: { label: string; minutes: number }[];
  workOrderTypeChartDTOs: { label: string; count: number }[];
  workOrderCategoryChartDTOs: { label: string; count: number }[];
  typeCompletionTimeDTOs: { label: string; minutes: number }[];
  categoryCompletionTimeDTOs: { label: string; minutes: number }[];
  workOrderProcessTimeDTOs: { label: string; minutes: number }[];
}
