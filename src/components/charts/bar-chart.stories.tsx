import type { Meta, StoryObj } from "@storybook/react";
import { BarChartPreset } from "./bar-chart";

const meta = {
  title: "Components/Charts/BarChart",
  component: BarChartPreset,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BarChartPreset>;

export default meta;
type Story = StoryObj<typeof meta>;

// 빌딩 에너지 관리용 샘플 데이터
const monthlyRevenueData = [
  { month: "1월", 수익: 4000, 지출: 2400 },
  { month: "2월", 수익: 3000, 지출: 1398 },
  { month: "3월", 수익: 2000, 지출: 9800 },
  { month: "4월", 수익: 2780, 지출: 3908 },
  { month: "5월", 수익: 1890, 지출: 4800 },
  { month: "6월", 수익: 2390, 지출: 3800 },
];

const facilityEnergyData = [
  { facility: "빌딩 A", 전력: 4200, 가스: 2400, 수도: 800 },
  { facility: "빌딩 B", 전력: 3500, 가스: 2100, 수도: 700 },
  { facility: "빌딩 C", 전력: 4800, 가스: 3200, 수도: 1200 },
  { facility: "빌딩 D", 전력: 3200, 가스: 1800, 수도: 600 },
  { facility: "빌딩 E", 전력: 4100, 가스: 2500, 수도: 900 },
];

const departmentCostData = [
  { department: "건축", cost: 4000 },
  { department: "전기", cost: 3000 },
  { department: "설비", cost: 2500 },
  { department: "통신", cost: 1800 },
  { department: "안전", cost: 2200 },
];

const goalComparisonData = [
  { month: "1월", 실제: 4000, 목표: 3500 },
  { month: "2월", 실제: 3500, 목표: 3500 },
  { month: "3월", 실제: 4200, 목표: 4000 },
  { month: "4월", 실제: 3800, 목표: 3800 },
  { month: "5월", 실제: 4500, 목표: 4500 },
  { month: "6월", 실제: 4100, 목표: 4200 },
];

export const Default: Story = {
  args: {
    data: departmentCostData,
    xAxisKey: "department",
    dataKeys: { cost: "비용(만원)" },
    height: 300,
    showLegend: false,
  },
};

export const Horizontal: Story = {
  args: {
    data: facilityEnergyData,
    xAxisKey: "facility",
    dataKeys: { 전력: "전력(kWh)" },
    horizontal: true,
    height: 300,
    showLegend: false,
  },
};

export const Grouped: Story = {
  args: {
    data: monthlyRevenueData,
    xAxisKey: "month",
    dataKeys: {
      수익: "수익(만원)",
      지출: "지출(만원)",
    },
    height: 350,
    showLegend: true,
  },
};

export const Stacked: Story = {
  args: {
    data: facilityEnergyData,
    xAxisKey: "facility",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
      수도: "수도(m³)",
    },
    stacked: true,
    height: 350,
    showLegend: true,
  },
};

export const WithGoal: Story = {
  args: {
    data: goalComparisonData,
    xAxisKey: "month",
    dataKeys: {
      실제: "실제 사용량(kWh)",
      목표: "목표 사용량(kWh)",
    },
    height: 350,
    showLegend: true,
  },
};

export const HorizontalMultipleSeries: Story = {
  args: {
    data: facilityEnergyData,
    xAxisKey: "facility",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
      수도: "수도(m³)",
    },
    horizontal: true,
    height: 400,
    showLegend: true,
  },
};

export const HorizontalStacked: Story = {
  args: {
    data: facilityEnergyData,
    xAxisKey: "facility",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
      수도: "수도(m³)",
    },
    horizontal: true,
    stacked: true,
    height: 350,
    showLegend: true,
  },
};

export const WithoutGrid: Story = {
  args: {
    data: departmentCostData,
    xAxisKey: "department",
    dataKeys: { cost: "비용(만원)" },
    height: 300,
    showGrid: false,
  },
};

export const RoundedBars: Story = {
  args: {
    data: monthlyRevenueData,
    xAxisKey: "month",
    dataKeys: {
      수익: "수익(만원)",
      지출: "지출(만원)",
    },
    barRadius: 8,
    height: 350,
    showLegend: true,
  },
};

export const MinimalBars: Story = {
  args: {
    data: departmentCostData,
    xAxisKey: "department",
    dataKeys: { cost: "비용(만원)" },
    barRadius: 0,
    height: 300,
    showGrid: false,
    showLegend: false,
  },
};

export const LargeHeight: Story = {
  args: {
    data: facilityEnergyData,
    xAxisKey: "facility",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
      수도: "수도(m³)",
    },
    stacked: true,
    height: 500,
    showLegend: true,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    xAxisKey: "month",
    dataKeys: { 수익: "수익(만원)" },
    loading: true,
    height: 300,
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    xAxisKey: "month",
    dataKeys: { 수익: "수익(만원)" },
    height: 300,
  },
};

export const HorizontalWithoutAxes: Story = {
  args: {
    data: facilityEnergyData,
    xAxisKey: "facility",
    dataKeys: { 전력: "전력(kWh)" },
    horizontal: true,
    showXAxis: false,
    showYAxis: false,
    height: 300,
  },
};
