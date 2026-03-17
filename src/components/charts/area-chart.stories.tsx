import type { Meta, StoryObj } from "@storybook/react";
import { AreaChartPreset } from "./area-chart";

const meta = {
  title: "Components/Charts/AreaChart",
  component: AreaChartPreset,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AreaChartPreset>;

export default meta;
type Story = StoryObj<typeof meta>;

// 빌딩 에너지 관리용 샘플 데이터
const energyData = [
  { month: "1월", 전력: 4000, 가스: 2400, 수도: 800 },
  { month: "2월", 전력: 3800, 가스: 2210, 수도: 750 },
  { month: "3월", 전력: 4200, 가스: 2290, 수도: 900 },
  { month: "4월", 전력: 3500, 가스: 2000, 수도: 700 },
  { month: "5월", 전력: 3800, 가스: 2181, 수도: 800 },
  { month: "6월", 전력: 4500, 가스: 2500, 수도: 1000 },
];

const temperatureData = [
  { month: "1월", 내부온도: 22, 외부온도: 5 },
  { month: "2월", 내부온도: 22, 외부온도: 7 },
  { month: "3월", 내부온도: 22, 외부온도: 12 },
  { month: "4월", 내부온도: 23, 외부온도: 18 },
  { month: "5월", 내부온도: 24, 외부온도: 23 },
  { month: "6월", 내부온도: 25, 외부온도: 28 },
];

export const Default: Story = {
  args: {
    data: energyData,
    xAxisKey: "month",
    dataKeys: { 전력: "전력(kWh)" },
    height: 300,
    showLegend: true,
    gradient: true,
  },
};

export const MultiSeries: Story = {
  args: {
    data: energyData,
    xAxisKey: "month",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
      수도: "수도(m³)",
    },
    height: 350,
    showLegend: true,
    gradient: true,
  },
};

export const WithGradient: Story = {
  args: {
    data: temperatureData,
    xAxisKey: "month",
    dataKeys: {
      내부온도: "내부온도(℃)",
      외부온도: "외부온도(℃)",
    },
    height: 300,
    gradient: true,
    showLegend: true,
  },
};

export const Stacked: Story = {
  args: {
    data: energyData,
    xAxisKey: "month",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
      수도: "수도(m³)",
    },
    stacked: true,
    height: 350,
    showLegend: true,
    gradient: true,
  },
};

export const WithoutGrid: Story = {
  args: {
    data: temperatureData,
    xAxisKey: "month",
    dataKeys: {
      내부온도: "내부온도(℃)",
      외부온도: "외부온도(℃)",
    },
    height: 300,
    showGrid: false,
    showLegend: true,
    gradient: true,
  },
};

export const LinearCurve: Story = {
  args: {
    data: energyData,
    xAxisKey: "month",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
    },
    curveType: "linear",
    height: 300,
    showLegend: true,
    gradient: true,
  },
};

export const StepCurve: Story = {
  args: {
    data: energyData,
    xAxisKey: "month",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
    },
    curveType: "step",
    height: 300,
    showLegend: true,
    gradient: true,
  },
};

export const MinimalWithoutLegend: Story = {
  args: {
    data: temperatureData,
    xAxisKey: "month",
    dataKeys: { 내부온도: "내부온도(℃)" },
    height: 250,
    showLegend: false,
    gradient: false,
  },
};

export const LargeHeight: Story = {
  args: {
    data: energyData,
    xAxisKey: "month",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
      수도: "수도(m³)",
    },
    height: 500,
    stacked: true,
    showLegend: true,
    gradient: true,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    xAxisKey: "month",
    dataKeys: { 전력: "전력(kWh)" },
    loading: true,
    height: 300,
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    xAxisKey: "month",
    dataKeys: { 전력: "전력(kWh)" },
    height: 300,
  },
};

export const HighOpacity: Story = {
  args: {
    data: temperatureData,
    xAxisKey: "month",
    dataKeys: {
      내부온도: "내부온도(℃)",
      외부온도: "외부온도(℃)",
    },
    height: 300,
    fillOpacity: 0.8,
    gradient: false,
    showLegend: true,
  },
};
