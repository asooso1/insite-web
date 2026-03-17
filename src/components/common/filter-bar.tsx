"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============================================================================
// 타입 정의
// ============================================================================

export interface FilterOption {
  label: string;
  value: string;
}

export type FilterDef =
  | {
      type: "search";
      key: string;
      placeholder?: string;
    }
  | {
      type: "select";
      key: string;
      options: FilterOption[];
      placeholder?: string;
      /** 전체 선택 옵션 레이블. undefined이면 전체 옵션 미표시 */
      allLabel?: string;
    }
  | {
      type: "tabs";
      key: string;
      options: FilterOption[];
    }
  | {
      type: "date-range";
      fromKey: string;
      toKey: string;
      fromPlaceholder?: string;
      toPlaceholder?: string;
    };

export interface FilterBarProps {
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  /** 모든 필터를 초기값으로 리셋 */
  onReset?: () => void;
  /** 인라인 필터 행 왼쪽 슬롯 (예: 일괄 처리 버튼) */
  leftSlot?: React.ReactNode;
  /** 인라인 필터 행 오른쪽 슬롯 (예: 엑셀 다운로드 버튼) */
  rightSlot?: React.ReactNode;
}

// ============================================================================
// 개별 필터 렌더러
// ============================================================================

function SearchFilter({
  def,
  value,
  onChange,
}: {
  def: Extract<FilterDef, { type: "search" }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      placeholder={def.placeholder ?? "검색..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-56"
    />
  );
}

function SelectFilter({
  def,
  value,
  onChange,
}: {
  def: Extract<FilterDef, { type: "select" }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder={def.placeholder ?? "선택"} />
      </SelectTrigger>
      <SelectContent>
        {def.allLabel !== undefined && (
          <SelectItem value="">{def.allLabel}</SelectItem>
        )}
        {def.options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DateRangeFilter({
  def,
  fromValue,
  toValue,
  onChange,
}: {
  def: Extract<FilterDef, { type: "date-range" }>;
  fromValue: string;
  toValue: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Input
        type="date"
        placeholder={def.fromPlaceholder ?? "시작일"}
        value={fromValue}
        onChange={(e) => onChange(def.fromKey, e.target.value)}
        className="w-36"
      />
      <span className="text-muted-foreground text-sm">~</span>
      <Input
        type="date"
        placeholder={def.toPlaceholder ?? "종료일"}
        value={toValue}
        onChange={(e) => onChange(def.toKey, e.target.value)}
        className="w-36"
      />
    </div>
  );
}

// ============================================================================
// FilterBar
// ============================================================================

export function FilterBar({
  filters,
  values,
  onChange,
  onReset,
  leftSlot,
  rightSlot,
}: FilterBarProps) {
  const tabsFilters = filters.filter(
    (f): f is Extract<FilterDef, { type: "tabs" }> => f.type === "tabs"
  );
  const inlineFilters = filters.filter((f) => f.type !== "tabs");

  const hasActiveFilter = Object.values(values).some((v) => v !== "");

  return (
    <div className="flex flex-col gap-2">
      {/* 탭 필터 */}
      {tabsFilters.map((tabsDef) => (
        <Tabs
          key={tabsDef.key}
          value={values[tabsDef.key] || "__ALL__"}
          onValueChange={(v) => onChange(tabsDef.key, v === "__ALL__" ? "" : v)}
        >
          <TabsList className="h-auto gap-1 bg-transparent p-0 border-b rounded-none w-full justify-start">
            {tabsDef.options.map((opt) => (
              <TabsTrigger
                key={opt.value || "__ALL__"}
                value={opt.value || "__ALL__"}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                {opt.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ))}

      {/* 인라인 필터 행 */}
      {(inlineFilters.length > 0 || leftSlot || rightSlot || onReset) && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">{leftSlot}</div>
          <div className="flex items-center gap-2">
            {inlineFilters.map((def, idx) => {
              if (def.type === "search") {
                return (
                  <SearchFilter
                    key={def.key}
                    def={def}
                    value={values[def.key] ?? ""}
                    onChange={(v) => onChange(def.key, v)}
                  />
                );
              }
              if (def.type === "select") {
                return (
                  <SelectFilter
                    key={def.key}
                    def={def}
                    value={values[def.key] ?? ""}
                    onChange={(v) => onChange(def.key, v)}
                  />
                );
              }
              if (def.type === "date-range") {
                return (
                  <DateRangeFilter
                    key={`${def.fromKey}-${def.toKey}`}
                    def={def}
                    fromValue={values[def.fromKey] ?? ""}
                    toValue={values[def.toKey] ?? ""}
                    onChange={onChange}
                  />
                );
              }
              return null;
            })}
            {onReset && hasActiveFilter && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                초기화
              </Button>
            )}
            {rightSlot}
          </div>
        </div>
      )}
    </div>
  );
}
