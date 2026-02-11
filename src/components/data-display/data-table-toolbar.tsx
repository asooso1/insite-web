"use client";

import { type ReactNode, useState, useEffect, useCallback } from "react";
import { type Table as TanStackTable, type Column } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Search,
  SlidersHorizontal,
  X,
  Columns3,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  /** 필터 컬럼 ID */
  columnId: string;
  /** 필터 라벨 */
  label: string;
  /** 필터 옵션 */
  options: FilterOption[];
  /** 플레이스홀더 */
  placeholder?: string;
}

export interface DataTableToolbarProps<TData> {
  /** TanStack Table 인스턴스 */
  table: TanStackTable<TData>;
  /** 전역 검색 활성화 */
  enableGlobalSearch?: boolean;
  /** 검색 플레이스홀더 */
  searchPlaceholder?: string;
  /** 검색 컬럼 ID (전역 검색 대신 특정 컬럼 검색) */
  searchColumnId?: string;
  /** 필터 설정 배열 */
  filters?: FilterConfig[];
  /** 컬럼 가시성 토글 활성화 */
  enableColumnVisibility?: boolean;
  /** 추가 액션 버튼들 */
  actions?: ReactNode;
  /** 검색 디바운스 딜레이 (ms) */
  debounceDelay?: number;
  /** 클래스명 */
  className?: string;
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
// Search Input Component
// ============================================================================

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function SearchInput({
  value,
  onChange,
  placeholder = "검색...",
  className,
}: SearchInputProps): ReactNode {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-8 h-9"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Filter Select Component
// ============================================================================

interface FilterSelectProps<TData> {
  table: TanStackTable<TData>;
  config: FilterConfig;
}

function FilterSelect<TData>({
  table,
  config,
}: FilterSelectProps<TData>): ReactNode {
  const column = table.getColumn(config.columnId);
  const filterValue = column?.getFilterValue() as string | undefined;

  if (!column) return null;

  return (
    <Select
      value={filterValue ?? ""}
      onValueChange={(value) => {
        column.setFilterValue(value === "" ? undefined : value);
      }}
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
// Column Visibility Dropdown
// ============================================================================

interface ColumnVisibilityProps<TData> {
  table: TanStackTable<TData>;
}

function ColumnVisibilityDropdown<TData>({
  table,
}: ColumnVisibilityProps<TData>): ReactNode {
  const columns = table
    .getAllColumns()
    .filter((column) => column.getCanHide());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Columns3 className="mr-2 h-4 w-4" />
          컬럼
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>표시할 컬럼</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => {
          const header = column.columnDef.header;
          const label =
            typeof header === "string"
              ? header
              : column.id;

          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// Active Filters Display
// ============================================================================

interface ActiveFiltersProps<TData> {
  table: TanStackTable<TData>;
  filters?: FilterConfig[];
}

function ActiveFilters<TData>({
  table,
  filters,
}: ActiveFiltersProps<TData>): ReactNode {
  const activeFilters = table.getState().columnFilters;

  if (activeFilters.length === 0) return null;

  const getFilterLabel = (columnId: string, value: unknown): string => {
    const config = filters?.find((f) => f.columnId === columnId);
    if (!config) return String(value);

    const option = config.options.find((o) => o.value === value);
    return option?.label ?? String(value);
  };

  const getColumnLabel = (columnId: string): string => {
    const config = filters?.find((f) => f.columnId === columnId);
    return config?.label ?? columnId;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((filter) => (
        <div
          key={filter.id}
          className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm"
        >
          <span className="text-muted-foreground">
            {getColumnLabel(filter.id)}:
          </span>
          <span>{getFilterLabel(filter.id, filter.value)}</span>
          <button
            onClick={() => table.getColumn(filter.id)?.setFilterValue(undefined)}
            className="ml-1 rounded-full hover:bg-muted-foreground/20"
            type="button"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.resetColumnFilters()}
        className="h-7 px-2 text-xs"
      >
        필터 초기화
      </Button>
    </div>
  );
}

// ============================================================================
// Main Toolbar Component
// ============================================================================

/**
 * DataTable 툴바 컴포넌트
 *
 * @features
 * - 전역 검색 또는 컬럼별 검색
 * - 컬럼 필터 드롭다운
 * - 컬럼 가시성 토글
 * - 디바운스된 검색
 *
 * @example
 * ```tsx
 * <DataTableToolbar
 *   table={table}
 *   enableGlobalSearch
 *   searchPlaceholder="작업 검색..."
 *   filters={[
 *     {
 *       columnId: "status",
 *       label: "상태",
 *       options: [
 *         { label: "진행중", value: "in_progress" },
 *         { label: "완료", value: "completed" },
 *       ],
 *     },
 *   ]}
 *   enableColumnVisibility
 * />
 * ```
 */
export function DataTableToolbar<TData>({
  table,
  enableGlobalSearch = false,
  searchPlaceholder = "검색...",
  searchColumnId,
  filters = [],
  enableColumnVisibility = true,
  actions,
  debounceDelay = 300,
  className,
}: DataTableToolbarProps<TData>): ReactNode {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, debounceDelay);

  // 디바운스된 검색 적용
  useEffect(() => {
    if (enableGlobalSearch) {
      table.setGlobalFilter(debouncedSearch);
    } else if (searchColumnId) {
      const column = table.getColumn(searchColumnId);
      column?.setFilterValue(debouncedSearch || undefined);
    }
  }, [debouncedSearch, enableGlobalSearch, searchColumnId, table]);

  const hasSearch = enableGlobalSearch || searchColumnId;
  const hasFilters = filters.length > 0;
  const activeFilterCount = table.getState().columnFilters.length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* 메인 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* 왼쪽: 검색 + 필터 */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {hasSearch && (
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder={searchPlaceholder}
              className="w-full sm:w-[250px]"
            />
          )}

          {hasFilters && (
            <>
              {filters.map((config) => (
                <FilterSelect
                  key={config.columnId}
                  table={table}
                  config={config}
                />
              ))}
            </>
          )}
        </div>

        {/* 오른쪽: 컬럼 가시성 + 액션 */}
        <div className="flex items-center gap-2">
          {enableColumnVisibility && <ColumnVisibilityDropdown table={table} />}
          {actions}
        </div>
      </div>

      {/* 활성 필터 표시 */}
      {activeFilterCount > 0 && (
        <ActiveFilters table={table} filters={filters} />
      )}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export { SearchInput, FilterSelect, ColumnVisibilityDropdown, ActiveFilters };
