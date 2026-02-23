"use client";

import { type ReactNode, useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Search, X, ChevronDown } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  /** 필터 키 (URL 파라미터 이름) */
  key: string;
  /** 필터 라벨 */
  label: string;
  /** 필터 타입 */
  type: "select" | "multi-select";
  /** 필터 옵션 */
  options: FilterOption[];
  /** 플레이스홀더 */
  placeholder?: string;
}

export interface SearchFilterBarProps {
  /** 검색 플레이스홀더 */
  searchPlaceholder?: string;
  /** 검색 URL 파라미터 키 (기본: q) */
  searchKey?: string;
  /** 필터 설정 배열 */
  filters?: FilterConfig[];
  /** 검색 디바운스 딜레이 (ms) */
  debounceDelay?: number;
  /** 값 변경 콜백 */
  onSearchChange?: (value: string) => void;
  /** 필터 변경 콜백 */
  onFilterChange?: (key: string, value: string | string[] | null) => void;
  /** 초기화 콜백 */
  onReset?: () => void;
  /** 추가 액션 버튼들 */
  actions?: ReactNode;
  /** 클래스명 */
  className?: string;
  /** 필터 토글 버튼 표시 여부 (기본: false — 필터 항상 표시) */
  showFilterToggle?: boolean;
}

export interface FilterValues {
  [key: string]: string | string[] | null;
}

// ============================================================================
// Debounce Hook
// ============================================================================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================================
// URL State Hook
// ============================================================================

function useUrlState(
  searchKey: string,
  filters: FilterConfig[]
): {
  searchValue: string;
  filterValues: FilterValues;
  setSearchValue: (value: string | null) => void;
  setFilterValue: (key: string, value: string | string[] | null) => void;
  resetAll: () => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL에서 현재 값 읽기
  const searchValue = searchParams.get(searchKey) ?? "";

  const filterValues = useMemo(() => {
    const values: FilterValues = {};
    filters.forEach((filter) => {
      if (filter.type === "multi-select") {
        const params = searchParams.getAll(filter.key);
        values[filter.key] = params.length > 0 ? params : null;
      } else {
        values[filter.key] = searchParams.get(filter.key);
      }
    });
    return values;
  }, [searchParams, filters]);

  // URL 업데이트 함수
  const updateUrl = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        params.delete(key);
        if (value === null || value === "") {
          // 삭제됨
        } else if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  const setSearchValue = useCallback(
    (value: string | null) => {
      updateUrl({ [searchKey]: value });
    },
    [updateUrl, searchKey]
  );

  const setFilterValue = useCallback(
    (key: string, value: string | string[] | null) => {
      updateUrl({ [key]: value });
    },
    [updateUrl]
  );

  const resetAll = useCallback(() => {
    const resetUpdates: Record<string, null> = { [searchKey]: null };
    filters.forEach((filter) => {
      resetUpdates[filter.key] = null;
    });
    updateUrl(resetUpdates);
  }, [updateUrl, searchKey, filters]);

  return {
    searchValue,
    filterValues,
    setSearchValue,
    setFilterValue,
    resetAll,
  };
}

// ============================================================================
// Single Filter Component
// ============================================================================

interface SingleFilterProps {
  config: FilterConfig;
  value: string | null;
  onChange: (value: string | null) => void;
}

function SingleFilter({ config, value, onChange }: SingleFilterProps): ReactNode {
  return (
    <Select
      value={value ?? ""}
      onValueChange={(v) => onChange(v === "" ? null : v)}
    >
      <SelectTrigger className="h-9 w-[150px]">
        <SelectValue placeholder={config.placeholder ?? config.label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">전체</SelectItem>
        {config.options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ============================================================================
// Multi Filter Component
// ============================================================================

interface MultiFilterProps {
  config: FilterConfig;
  values: string[];
  onChange: (values: string[]) => void;
}

function MultiFilter({ config, values, onChange }: MultiFilterProps): ReactNode {
  const handleToggle = (value: string): void => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const selectedCount = values.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          {config.label}
          {selectedCount > 0 && (
            <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
              {selectedCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-3" align="start">
        <div className="space-y-2">
          {config.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`filter-${config.key}-${option.value}`}
                checked={values.includes(option.value)}
                onCheckedChange={() => handleToggle(option.value)}
              />
              <Label
                htmlFor={`filter-${config.key}-${option.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        {selectedCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full"
            onClick={() => onChange([])}
          >
            선택 초기화
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// Active Filters Display
// ============================================================================

interface ActiveFiltersDisplayProps {
  filters: FilterConfig[];
  filterValues: FilterValues;
  searchValue: string;
  onRemove: (key: string, value?: string) => void;
  onReset: () => void;
}

function ActiveFiltersDisplay({
  filters,
  filterValues,
  searchValue,
  onRemove,
  onReset,
}: ActiveFiltersDisplayProps): ReactNode {
  const activeFilters: Array<{
    key: string;
    label: string;
    value: string;
    valueLabel: string;
  }> = [];

  filters.forEach((filter) => {
    const value = filterValues[filter.key];
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        const option = filter.options.find((o) => o.value === v);
        activeFilters.push({
          key: filter.key,
          label: filter.label,
          value: v,
          valueLabel: option?.label ?? v,
        });
      });
    } else {
      const option = filter.options.find((o) => o.value === value);
      activeFilters.push({
        key: filter.key,
        label: filter.label,
        value: value,
        valueLabel: option?.label ?? value,
      });
    }
  });

  const hasActiveFilters = searchValue || activeFilters.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {searchValue && (
        <Badge variant="secondary" className="gap-1 pr-1">
          <span className="text-muted-foreground">검색:</span>
          {searchValue}
          <button
            onClick={() => onRemove("__search__")}
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.key}-${filter.value}-${index}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          <span className="text-muted-foreground">{filter.label}:</span>
          {filter.valueLabel}
          <button
            onClick={() => onRemove(filter.key, filter.value)}
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={onReset} className="h-6 px-2 text-xs">
        전체 초기화
      </Button>
    </div>
  );
}

// ============================================================================
// Main SearchFilterBar Component
// ============================================================================

/**
 * 검색 및 필터 바 컴포넌트
 *
 * @features
 * - URL 상태 동기화 (Next.js App Router)
 * - 디바운스된 검색
 * - 단일/다중 선택 필터
 * - 활성 필터 표시 및 제거
 *
 * @example
 * ```tsx
 * <SearchFilterBar
 *   searchPlaceholder="작업 검색..."
 *   filters={[
 *     {
 *       key: "status",
 *       label: "상태",
 *       type: "select",
 *       options: [
 *         { label: "진행중", value: "in_progress" },
 *         { label: "완료", value: "completed" },
 *       ],
 *     },
 *     {
 *       key: "priority",
 *       label: "우선순위",
 *       type: "multi-select",
 *       options: [
 *         { label: "높음", value: "high" },
 *         { label: "중간", value: "medium" },
 *         { label: "낮음", value: "low" },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 */
export function SearchFilterBar({
  searchPlaceholder = "검색...",
  searchKey = "q",
  filters = [],
  debounceDelay = 300,
  onSearchChange,
  onFilterChange,
  onReset,
  actions,
  className,
  showFilterToggle = false,
}: SearchFilterBarProps): ReactNode {
  const [filterOpen, setFilterOpen] = useState(false);
  const {
    searchValue,
    filterValues,
    setSearchValue,
    setFilterValue,
    resetAll,
  } = useUrlState(searchKey, filters);

  // 로컬 검색 상태 (디바운싱용)
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debouncedSearch = useDebounce(localSearch, debounceDelay);

  // URL 검색값이 변경되면 로컬 상태 동기화
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // 디바운스된 검색 값 URL에 반영
  useEffect(() => {
    if (debouncedSearch !== searchValue) {
      setSearchValue(debouncedSearch || null);
      onSearchChange?.(debouncedSearch);
    }
  }, [debouncedSearch, searchValue, setSearchValue, onSearchChange]);

  // 필터 변경 핸들러
  const handleFilterChange = useCallback(
    (key: string, value: string | string[] | null): void => {
      setFilterValue(key, value);
      onFilterChange?.(key, value);
    },
    [setFilterValue, onFilterChange]
  );

  // 필터 제거 핸들러
  const handleRemoveFilter = useCallback(
    (key: string, value?: string): void => {
      if (key === "__search__") {
        setLocalSearch("");
        setSearchValue(null);
        return;
      }

      const filter = filters.find((f) => f.key === key);
      if (!filter) return;

      if (filter.type === "select") {
        handleFilterChange(key, null);
      } else if (value) {
        const currentValues = filterValues[key];
        if (Array.isArray(currentValues)) {
          handleFilterChange(
            key,
            currentValues.filter((v) => v !== value)
          );
        }
      }
    },
    [filters, filterValues, handleFilterChange, setSearchValue]
  );

  // 전체 초기화 핸들러
  const handleReset = useCallback((): void => {
    setLocalSearch("");
    resetAll();
    onReset?.();
  }, [resetAll, onReset]);

  // 필터 분리
  const singleFilters = filters.filter((f) => f.type === "select");
  const multiFilters = filters.filter((f) => f.type === "multi-select");

  return (
    <div className={cn("space-y-2", className)}>
      {/* 메인 바 */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 검색 입력 */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8 pr-8 h-9"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 필터 토글 버튼 (showFilterToggle=true 일 때) */}
        {showFilterToggle && filters.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1"
            onClick={() => setFilterOpen((prev) => !prev)}
          >
            필터
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                filterOpen && "rotate-180"
              )}
            />
          </Button>
        )}

        {/* 필터 항상 표시 (showFilterToggle=false 일 때) */}
        {!showFilterToggle && (
          <>
            {singleFilters.map((filter) => (
              <SingleFilter
                key={filter.key}
                config={filter}
                value={(filterValues[filter.key] as string | null) ?? null}
                onChange={(value) => handleFilterChange(filter.key, value)}
              />
            ))}
            {multiFilters.map((filter) => (
              <MultiFilter
                key={filter.key}
                config={filter}
                values={(filterValues[filter.key] as string[]) ?? []}
                onChange={(values) =>
                  handleFilterChange(filter.key, values.length > 0 ? values : null)
                }
              />
            ))}
          </>
        )}

        {/* 추가 액션 */}
        {actions}
      </div>

      {/* 토글 필터 패널 */}
      {showFilterToggle && filterOpen && filters.length > 0 && (
        <div className="flex flex-wrap gap-2 border border-border/60 rounded-lg p-3 mt-2 transition-all duration-200">
          {singleFilters.map((filter) => (
            <SingleFilter
              key={filter.key}
              config={filter}
              value={(filterValues[filter.key] as string | null) ?? null}
              onChange={(value) => handleFilterChange(filter.key, value)}
            />
          ))}
          {multiFilters.map((filter) => (
            <MultiFilter
              key={filter.key}
              config={filter}
              values={(filterValues[filter.key] as string[]) ?? []}
              onChange={(values) =>
                handleFilterChange(filter.key, values.length > 0 ? values : null)
              }
            />
          ))}
        </div>
      )}

      {/* 활성 필터 표시 */}
      <ActiveFiltersDisplay
        filters={filters}
        filterValues={filterValues}
        searchValue={searchValue}
        onRemove={handleRemoveFilter}
        onReset={handleReset}
      />
    </div>
  );
}
