import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { NumberInput } from "./number-input"
import { Button } from "./button"
import { Label } from "./label"

const meta = {
  title: "Components/UI/NumberInput",
  component: NumberInput,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(5)
    return (
      <div className="w-40">
        <NumberInput
          value={value}
          onChange={setValue}
          placeholder="값 입력"
        />
      </div>
    )
  },
}

export const WithMinMax: Story = {
  render: () => {
    const [value, setValue] = useState(50)
    return (
      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">최소값: 0, 최대값: 100</Label>
          <div className="w-40">
            <NumberInput
              value={value}
              onChange={setValue}
              min={0}
              max={100}
              placeholder="0-100"
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          최소/최대 경계에서 버튼이 자동으로 비활성화됩니다.
        </p>
      </div>
    )
  },
}

export const Step: Story = {
  render: () => {
    const [value, setValue] = useState(0)
    return (
      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Step: 5</Label>
          <div className="w-40">
            <NumberInput
              value={value}
              onChange={setValue}
              step={5}
              min={0}
              max={100}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          5씩 증감됩니다.
        </p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-40">
      <NumberInput
        value={10}
        onChange={() => {}}
        disabled
        placeholder="비활성화"
      />
    </div>
  ),
}

export const InContext: Story = {
  render: () => {
    const [quantity, setQuantity] = useState(1)
    return (
      <div className="rounded-lg border p-4 max-w-md space-y-4">
        <h3 className="font-semibold">부품 주문</h3>
        <div>
          <Label className="mb-2 block">에어컨 필터</Label>
          <p className="text-sm text-muted-foreground mb-3">
            가격: 25,000원 | 재고: 50개
          </p>
          <div className="flex items-center gap-2">
            <div className="w-32">
              <NumberInput
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={50}
                step={1}
              />
            </div>
            <span className="text-sm font-semibold">
              합계: {quantity * 25000}원
            </span>
          </div>
        </div>
      </div>
    )
  },
}

export const InForm: Story = {
  render: () => {
    const [quantity, setQuantity] = useState(1)
    const [selectedProduct] = useState("filter")

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      alert(`${selectedProduct} ${quantity}개 주문 완료`)
    }

    return (
      <form onSubmit={handleSubmit} className="rounded-lg border p-4 max-w-md space-y-4">
        <h3 className="font-semibold">부품 주문서 (React Hook Form)</h3>

        <div>
          <Label htmlFor="product" className="mb-2 block">
            부품 선택
          </Label>
          <select
            id="product"
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            defaultValue="filter"
          >
            <option value="filter">에어컨 필터</option>
            <option value="belt">벨트</option>
            <option value="pump">펌프</option>
          </select>
        </div>

        <div>
          <Label className="mb-2 block">수량 (1-100)</Label>
          <NumberInput
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={100}
            step={1}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            주문하기
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setQuantity(1)}
          >
            초기화
          </Button>
        </div>
      </form>
    )
  },
}
