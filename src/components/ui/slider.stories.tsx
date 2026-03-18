import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

import { Slider } from "./slider"

const meta = {
  title: "Components/UI/Slider",
  component: Slider,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState([50])
    return (
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">값</span>
          <span className="text-sm font-semibold">{value[0]}</span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
    )
  },
}

export const Range: Story = {
  render: () => {
    const [value, setValue] = useState([20, 80])
    return (
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">범위</span>
          <span className="text-sm font-semibold">
            {value[0]} ~ {value[1]}
          </span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">비활성화</span>
        <span className="text-sm font-semibold">50</span>
      </div>
      <Slider
        value={[50]}
        max={100}
        step={1}
        disabled
        className="w-full"
      />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState([40])
    return (
      <div className="w-full max-w-md space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">밝기</label>
            <span className="text-sm font-semibold">{value[0]}%</span>
          </div>
          <Slider
            value={value}
            onValueChange={setValue}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    )
  },
}

export const Temperature: Story = {
  render: () => {
    const [temp, setTemp] = useState([20])
    const getTempColor = (t: number): string => {
      if (t < 10) return "text-blue-600"
      if (t < 15) return "text-cyan-600"
      if (t < 20) return "text-green-600"
      if (t < 25) return "text-orange-600"
      return "text-red-600"
    }
    return (
      <div className="w-full max-w-md space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">온도 조절</label>
            <span className={`text-sm font-semibold ${getTempColor(temp[0] ?? 0)}`}>
              {temp[0]}°C
            </span>
          </div>
          <Slider
            value={temp}
            onValueChange={setTemp}
            min={0}
            max={40}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    )
  },
}

export const InContext: Story = {
  render: () => {
    const [energyRange, setEnergyRange] = useState([200, 800])
    return (
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-4">에너지 사용량 필터</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">일일 사용량 범위</label>
                <span className="text-sm font-semibold">
                  {energyRange[0]} ~ {energyRange[1]} kWh
                </span>
              </div>
              <Slider
                value={energyRange}
                onValueChange={setEnergyRange}
                min={0}
                max={1000}
                step={10}
                className="w-full"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              선택된 범위의 시설물 데이터를 표시합니다.
            </div>
          </div>
        </div>
      </div>
    )
  },
}
