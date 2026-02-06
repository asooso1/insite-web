"use client";

import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  parseAsArrayOf,
  parseAsBoolean,
  createParser,
} from "nuqs";

/**
 * 페이지네이션 파서
 */
export const paginationParsers = {
  page: parseAsInteger.withDefault(1),
  size: parseAsInteger.withDefault(10),
};

/**
 * 정렬 파서
 */
export const sortParsers = {
  sortBy: parseAsString,
  sortOrder: parseAsStringEnum(["asc", "desc"] as const).withDefault("desc"),
};

/**
 * 필터 파서 (공통)
 */
export const filterParsers = {
  search: parseAsString.withDefault(""),
  status: parseAsArrayOf(parseAsString),
};

/**
 * 날짜 범위 파서
 */
export const dateRangeParsers = {
  startDate: parseAsString,
  endDate: parseAsString,
};

/**
 * 빌딩/회사 컨텍스트 파서
 */
export const contextParsers = {
  buildingId: parseAsString,
  companyId: parseAsString,
};

/**
 * 탭 파서
 */
export const tabParsers = {
  tab: parseAsString.withDefault("all"),
};

/**
 * 모달 상태 파서
 */
export const modalParsers = {
  modal: parseAsString,
  id: parseAsString,
};

/**
 * 뷰 모드 파서
 */
export const viewParsers = {
  view: parseAsStringEnum(["list", "grid", "calendar"] as const).withDefault("list"),
};

/**
 * 확장 상태 파서
 */
export const expandParsers = {
  expanded: parseAsBoolean.withDefault(false),
};

/**
 * ISO 날짜 문자열 파서
 */
export const dateParser = createParser({
  parse: (value: string) => {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  },
  serialize: (date: Date) => date.toISOString().split("T")[0] ?? "",
});

/**
 * 작업(Work Order) 목록용 파서
 */
export const workOrderListParsers = {
  ...paginationParsers,
  ...sortParsers,
  ...filterParsers,
  ...dateRangeParsers,
  ...contextParsers,
  priority: parseAsArrayOf(parseAsString),
  assignee: parseAsString,
};

/**
 * 대시보드용 파서
 */
export const dashboardParsers = {
  ...contextParsers,
  ...dateRangeParsers,
  period: parseAsStringEnum(["day", "week", "month", "year"] as const).withDefault("month"),
};
