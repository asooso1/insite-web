import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { MultiSelect, type MultiSelectOption } from "./multi-select"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Forms/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

const FACILITY_OPTIONS: MultiSelectOption[] = [
  { value: "hvac", label: "냉난방기" },
  { value: "lighting", label: "조명" },
  { value: "elevator", label: "엘리베이터" },
  { value: "security", label: "보안 시스템" },
  { value: "pump", label: "펌프" },
  { value: "generator", label: "발전기" },
]

const MANAGER_OPTIONS: MultiSelectOption[] = [
  { value: "kim", label: "김철수" },
  { value: "lee", label: "이영희" },
  { value: "park", label: "박민준" },
  { value: "choi", label: "최지은" },
  { value: "jung", label: "정준호" },
]

export const Default: Story = {
  args: {
    options: FACILITY_OPTIONS,
    value: [],
    onChange: () => {},
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>([])

    return (
      <div className="w-full max-w-sm space-y-2">
        <label className="text-sm font-medium">시설 선택</label>
        <MultiSelect
          options={FACILITY_OPTIONS}
          value={selected}
          onChange={setSelected}
          placeholder="시설을 선택해주세요"
        />
        <div className="text-xs text-muted-foreground mt-2">
          선택됨: {selected.join(", ") || "없음"}
        </div>
      </div>
    )
  },
}

export const WithMaxCount: Story = {
  args: {
    options: FACILITY_OPTIONS,
    value: ["hvac", "lighting"],
    onChange: () => {},
    maxCount: 3,
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>(["hvac", "lighting"])

    return (
      <div className="w-full max-w-sm space-y-2">
        <label className="text-sm font-medium">시설 선택 (최대 3개)</label>
        <MultiSelect
          options={FACILITY_OPTIONS}
          value={selected}
          onChange={setSelected}
          placeholder="최대 3개까지 선택 가능합니다"
          maxCount={3}
        />
        <div className="text-xs text-muted-foreground mt-2">
          선택됨: {selected.join(", ") || "없음"}
        </div>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    options: FACILITY_OPTIONS,
    value: ["hvac", "lighting"],
    onChange: () => {},
    disabled: true,
  },
  render: () => {
    const [selected] = useState<string[]>(["hvac", "lighting"])

    return (
      <div className="w-full max-w-sm space-y-2">
        <label className="text-sm font-medium">시설 선택 (비활성)</label>
        <MultiSelect
          options={FACILITY_OPTIONS}
          value={selected}
          onChange={() => {}}
          placeholder="비활성 상태입니다"
          disabled
        />
      </div>
    )
  },
}

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `facility-${i}`,
      label: `시설 ${i + 1}`,
    })),
    value: [],
    onChange: () => {},
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>([])

    const manyOptions: MultiSelectOption[] = Array.from({ length: 20 }, (_, i) => ({
      value: `facility-${i}`,
      label: `시설 ${i + 1}`,
    }))

    return (
      <div className="w-full max-w-sm space-y-2">
        <label className="text-sm font-medium">시설 선택 (많은 옵션)</label>
        <MultiSelect
          options={manyOptions}
          value={selected}
          onChange={setSelected}
          placeholder="검색하여 시설을 선택하세요"
          maxCount={2}
        />
        <div className="text-xs text-muted-foreground mt-2">
          {selected.length}개 선택됨
        </div>
      </div>
    )
  },
}

export const InForm: Story = {
  args: {
    options: MANAGER_OPTIONS,
    value: [],
    onChange: () => {},
  },
  render: () => {
    const [managers, setManagers] = useState<string[]>([])
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (): void => {
      if (managers.length === 0) {
        alert("최소 1명 이상 선택해주세요")
        return
      }
      setSubmitted(true)
      alert(`선택된 담당자: ${managers.map(m => MANAGER_OPTIONS.find(o => o.value === m)?.label).join(", ")}`)
      setTimeout(() => setSubmitted(false), 2000)
    }

    return (
      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            담당자 선택
            <span className="ml-1 text-destructive">*</span>
          </label>
          <MultiSelect
            options={MANAGER_OPTIONS}
            value={managers}
            onChange={setManagers}
            placeholder="담당자를 선택해주세요"
          />
          {managers.length === 0 && (
            <p className="text-sm text-destructive">최소 1명 이상 선택해주세요</p>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setManagers([])
              setSubmitted(false)
            }}
          >
            초기화
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitted}>
            {submitted ? "저장되었습니다" : "저장"}
          </Button>
        </div>
      </div>
    )
  },
}
