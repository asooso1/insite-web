import type { Meta, StoryObj } from "@storybook/react"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Label } from "./label"
import { useForm, Controller } from "react-hook-form"

const meta = {
  title: "Components/UI/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <RadioGroupItem value="option1" id="option1" />
      <label htmlFor="option1" className="text-sm">
        옵션 1
      </label>
    </RadioGroup>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-3">
      <RadioGroup defaultValue="morning">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="morning" id="morning" />
          <Label htmlFor="morning">오전 (08:00-12:00)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="afternoon" id="afternoon" />
          <Label htmlFor="afternoon">오후 (12:00-18:00)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="evening" id="evening" />
          <Label htmlFor="evening">저녁 (18:00-22:00)</Label>
        </div>
      </RadioGroup>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="d-option1" />
        <Label htmlFor="d-option1">활성화됨</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="d-option2" disabled />
        <Label htmlFor="d-option2" className="opacity-50 cursor-not-allowed">
          비활성화됨
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="d-option3" />
        <Label htmlFor="d-option3">활성화됨</Label>
      </div>
    </RadioGroup>
  ),
}

export const InForm: Story = {
  render: () => {
    const { control, watch } = useForm({
      defaultValues: {
        priority: "medium",
      },
    })

    const selectedPriority = watch("priority")

    return (
      <form className="space-y-4">
        <div>
          <p className="font-medium text-sm mb-3">작업 우선순위</p>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="priority-low" />
                  <Label htmlFor="priority-low">낮음</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="priority-medium" />
                  <Label htmlFor="priority-medium">중간</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="priority-high" />
                  <Label htmlFor="priority-high">높음</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="priority-urgent" />
                  <Label htmlFor="priority-urgent">긴급</Label>
                </div>
              </RadioGroup>
            )}
          />
          <p className="text-sm text-gray-600 mt-2">
            선택된 우선순위: <strong>{selectedPriority}</strong>
          </p>
        </div>
      </form>
    )
  },
}

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="font-medium text-sm mb-3">시설 상태</p>
        <RadioGroup defaultValue="operating" className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="operating" id="h-operating" />
            <Label htmlFor="h-operating">운영중</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="stopped" id="h-stopped" />
            <Label htmlFor="h-stopped">중지</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="maintenance" id="h-maintenance" />
            <Label htmlFor="h-maintenance">정비중</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <p className="font-medium text-sm mb-3">건물 구역</p>
        <RadioGroup defaultValue="zone-a" className="flex gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="zone-a" id="h-zone-a" />
            <Label htmlFor="h-zone-a">A 구역 (1-5층)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="zone-b" id="h-zone-b" />
            <Label htmlFor="h-zone-b">B 구역 (6-10층)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="zone-c" id="h-zone-c" />
            <Label htmlFor="h-zone-c">C 구역 (11-15층)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
}
