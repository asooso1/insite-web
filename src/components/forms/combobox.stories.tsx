import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Combobox, type ComboboxOption } from "./combobox"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Forms/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

const BUILDING_OPTIONS: ComboboxOption[] = [
  { value: "bldg-001", label: "A동" },
  { value: "bldg-002", label: "B동" },
  { value: "bldg-003", label: "C동" },
  { value: "bldg-004", label: "D동" },
  { value: "bldg-005", label: "E동" },
]

const STATUS_OPTIONS: ComboboxOption[] = [
  { value: "pending", label: "대기 중" },
  { value: "processing", label: "처리 중" },
  { value: "completed", label: "완료" },
  { value: "cancelled", label: "취소" },
]

const FACILITY_OPTIONS: ComboboxOption[] = [
  { value: "hvac", label: "냉난방기" },
  { value: "lighting", label: "조명" },
  { value: "elevator", label: "엘리베이터" },
  { value: "security", label: "보안 시스템" },
  { value: "pump", label: "펌프" },
  { value: "generator", label: "발전기" },
  { value: "water-supply", label: "급수 시스템" },
  { value: "drainage", label: "배수 시스템" },
  { value: "parking", label: "주차 시스템" },
  { value: "fire-safety", label: "소방 안전" },
]

export const Default: Story = {
  args: {
    options: BUILDING_OPTIONS,
    value: "",
    onChange: () => {},
  },
  render: () => {
    const [selected, setSelected] = useState<string>("")

    return (
      <div className="w-full max-w-sm space-y-2">
        <label className="text-sm font-medium">빌딩 선택</label>
        <Combobox
          options={BUILDING_OPTIONS}
          value={selected}
          onChange={setSelected}
          placeholder="빌딩을 선택해주세요"
        />
        <div className="text-xs text-muted-foreground mt-2">
          선택됨: {selected || "없음"}
        </div>
      </div>
    )
  },
}

export const WithSearch: Story = {
  args: {
    options: STATUS_OPTIONS,
    value: "",
    onChange: () => {},
  },
  render: () => {
    const [selected, setSelected] = useState<string>("")

    return (
      <div className="w-full max-w-sm space-y-2">
        <label className="text-sm font-medium">상태 선택</label>
        <Combobox
          options={STATUS_OPTIONS}
          value={selected}
          onChange={setSelected}
          placeholder="상태를 검색하거나 선택하세요"
          emptyText="일치하는 상태가 없습니다."
        />
        <div className="text-xs text-muted-foreground mt-2">
          선택됨: {STATUS_OPTIONS.find(o => o.value === selected)?.label || "없음"}
        </div>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    options: BUILDING_OPTIONS,
    value: "bldg-001",
    onChange: () => {},
    disabled: true,
  },
  render: () => {
    const [selected] = useState<string>("bldg-001")

    return (
      <div className="w-full max-w-sm space-y-2">
        <label className="text-sm font-medium">빌딩 선택 (비활성)</label>
        <Combobox
          options={BUILDING_OPTIONS}
          value={selected}
          onChange={() => {}}
          placeholder="비활성 상태입니다"
          disabled
        />
      </div>
    )
  },
}

export const LargeList: Story = {
  args: {
    options: FACILITY_OPTIONS,
    value: "",
    onChange: () => {},
  },
  render: () => {
    const [selected, setSelected] = useState<string>("")

    return (
      <div className="w-full max-w-sm space-y-2">
        <label className="text-sm font-medium">시설 선택 (큰 목록)</label>
        <Combobox
          options={FACILITY_OPTIONS}
          value={selected}
          onChange={setSelected}
          placeholder="시설을 검색하세요"
          emptyText="일치하는 시설이 없습니다."
        />
        <div className="text-xs text-muted-foreground mt-2">
          선택된 시설: {FACILITY_OPTIONS.find(o => o.value === selected)?.label || "없음"}
        </div>
      </div>
    )
  },
}

export const InForm: Story = {
  args: {
    options: BUILDING_OPTIONS,
    value: "",
    onChange: () => {},
  },
  render: () => {
    const [building, setBuilding] = useState<string>("")
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (): void => {
      if (!building) {
        alert("빌딩을 선택해주세요")
        return
      }
      const buildingLabel = BUILDING_OPTIONS.find(b => b.value === building)?.label
      alert(`선택된 빌딩: ${buildingLabel}`)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 2000)
    }

    return (
      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            빌딩 선택
            <span className="ml-1 text-destructive">*</span>
          </label>
          <Combobox
            options={BUILDING_OPTIONS}
            value={building}
            onChange={setBuilding}
            placeholder="빌딩을 선택해주세요"
          />
          {!building && (
            <p className="text-sm text-destructive">빌딩을 선택해주세요</p>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setBuilding("")
              setSubmitted(false)
            }}
          >
            초기화
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitted}>
            {submitted ? "선택됨" : "선택"}
          </Button>
        </div>
      </div>
    )
  },
}

export const Buildings: Story = {
  args: {
    options: [
      { value: "seoul-001", label: "서울 본사 (강남구)" },
      { value: "seoul-002", label: "서울 지사 (역삼동)" },
      { value: "busan-001", label: "부산 지사 (해운대)" },
      { value: "daegu-001", label: "대구 지사 (수성구)" },
      { value: "incheon-001", label: "인천 지사 (남동구)" },
    ],
    value: "",
    onChange: () => {},
  },
  render: () => {
    const [selected, setSelected] = useState<string>("")

    const buildingFullList: ComboboxOption[] = [
      { value: "seoul-001", label: "서울 본사 (강남구)" },
      { value: "seoul-002", label: "서울 지사 (역삼동)" },
      { value: "busan-001", label: "부산 지사 (해운대)" },
      { value: "daegu-001", label: "대구 지사 (수성구)" },
      { value: "incheon-001", label: "인천 지사 (남동구)" },
    ]

    return (
      <div className="w-full max-w-sm space-y-2">
        <label className="text-sm font-medium">빌딩 선택</label>
        <Combobox
          options={buildingFullList}
          value={selected}
          onChange={setSelected}
          placeholder="운영 중인 빌딩을 선택하세요"
          emptyText="일치하는 빌딩이 없습니다."
        />
        {selected && (
          <div className="p-3 bg-muted rounded-md text-sm">
            <p className="font-medium">선택된 빌딩:</p>
            <p className="text-muted-foreground">
              {buildingFullList.find(b => b.value === selected)?.label}
            </p>
          </div>
        )}
      </div>
    )
  },
}
