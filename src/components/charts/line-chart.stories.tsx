import type { Meta, StoryObj } from "@storybook/react";
import { LineChartPreset } from "./line-chart";

const meta = {
  title: "Components/Charts/LineChart",
  component: LineChartPreset,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LineChartPreset>;

export default meta;
type Story = StoryObj<typeof meta>;

// 빌딩 에너지 관리용 샘플 데이터
const dailyPowerData = [
  { day: "월", value: 4000 },
  { day: "화", value: 3800 },
  { day: "수", value: 4200 },
  { day: "목", value: 3500 },
  { day: "금", value: 3800 },
  { day: "토", value: 4500 },
  { day: "일", value: 4100 },
];

const multiLineData = [
  { month: "1월", 전력: 4000, 가스: 2400 },
  { month: "2월", 전력: 3800, 가스: 2210 },
  { month: "3월", 전력: 4200, 가스: 2290 },
  { month: "4월", 전력: 3500, 가스: 2000 },
  { month: "5월", 전력: 3800, 가스: 2181 },
  { month: "6월", 전력: 4500, 가스: 2500 },
];

const temperatureData = [
  { hour: "00:00", 내부온도: 22, 외부온도: 18 },
  { hour: "04:00", 내부온도: 21, 외부온도: 15 },
  { hour: "08:00", 내부온도: 22, 외부온도: 12 },
  { hour: "12:00", 내부온도: 24, 외부온도: 22 },
  { hour: "16:00", 내부온도: 25, 외부온도: 25 },
  { hour: "20:00", 내부온도: 23, 외부온도: 20 },
];

const costTrendData = [
  { month: "1월", cost: 4000 },
  { month: "2월", cost: 3200 },
  { month: "3월", cost: 3500 },
  { month: "4월", cost: 2800 },
  { month: "5월", cost: 3100 },
  { month: "6월", cost: 3800 },
];

export const Default: Story = {
  args: {
    data: dailyPowerData,
    xAxisKey: "day",
    dataKeys: { value: "전력(kWh)" },
    height: 300,
    showLegend: false,
    showDots: true,
  },
};

export const MultiLine: Story = {
  args: {
    data: multiLineData,
    xAxisKey: "month",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
    },
    height: 350,
    showLegend: true,
    showDots: true,
  },
};

export const WithDots: Story = {
  args: {
    data: temperatureData,
    xAxisKey: "hour",
    dataKeys: {
      내부온도: "내부온도(℃)",
      외부온도: "외부온도(℃)",
    },
    height: 300,
    showDots: true,
    showLegend: true,
  },
};

export const WithoutDots: Story = {
  args: {
    data: costTrendData,
    xAxisKey: "month",
    dataKeys: { cost: "비용(만원)" },
    height: 300,
    showDots: false,
    showLegend: false,
  },
};

export const Smooth: Story = {
  args: {
    data: multiLineData,
    xAxisKey: "month",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
    },
    curveType: "monotone",
    height: 350,
    showDots: true,
    showLegend: true,
  },
};

export const Linear: Story = {
  args: {
    data: temperatureData,
    xAxisKey: "hour",
    dataKeys: {
      내부온도: "내부온도(℃)",
      외부온도: "외부온도(℃)",
    },
    curveType: "linear",
    height: 300,
    showDots: true,
    showLegend: true,
  },
};

export const StepLine: Story = {
  args: {
    data: dailyPowerData,
    xAxisKey: "day",
    dataKeys: { value: "전력(kWh)" },
    curveType: "step",
    height: 300,
    showDots: true,
    showLegend: false,
  },
};

export const ThickStroke: Story = {
  args: {
    data: multiLineData,
    xAxisKey: "month",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
    },
    strokeWidth: 4,
    height: 350,
    showDots: true,
    showLegend: true,
  },
};

export const ThinStroke: Story = {
  args: {
    data: costTrendData,
    xAxisKey: "month",
    dataKeys: { cost: "비용(만원)" },
    strokeWidth: 1,
    height: 300,
    showDots: true,
  },
};

export const WithoutGrid: Story = {
  args: {
    data: dailyPowerData,
    xAxisKey: "day",
    dataKeys: { value: "전력(kWh)" },
    height: 300,
    showGrid: false,
    showDots: true,
  },
};

export const WithoutLegend: Story = {
  args: {
    data: multiLineData,
    xAxisKey: "month",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
    },
    height: 350,
    showLegend: false,
    showDots: true,
  },
};

export const WithAnnotation: Story = {
  render: () => {
    const data = multiLineData;
    return (
      <div className="space-y-4">
        <LineChartPreset
          data={data}
          xAxisKey="month"
          dataKeys={{
            전력: "전력(kWh)",
            가스: "가스(m³)",
          }}
          height={350}
          showLegend={true}
          showDots={true}
        />
        <div className="text-sm text-muted-foreground">
          <p>주석: 6월의 전력 사용량 증가는 냉방 운영으로 인한 것입니다.</p>
        </div>
      </div>
    );
  },
};

export const MultiLineTemperature: Story = {
  args: {
    data: temperatureData,
    xAxisKey: "hour",
    dataKeys: {
      내부온도: "내부온도(℃)",
      외부온도: "외부온도(℃)",
    },
    height: 350,
    showDots: true,
    showLegend: true,
    curveType: "monotone",
  },
};

export const LargeHeight: Story = {
  args: {
    data: multiLineData,
    xAxisKey: "month",
    dataKeys: {
      전력: "전력(kWh)",
      가스: "가스(m³)",
    },
    height: 500,
    showDots: true,
    showLegend: true,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    xAxisKey: "month",
    dataKeys: { value: "값" },
    loading: true,
    height: 300,
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    xAxisKey: "month",
    dataKeys: { value: "값" },
    height: 300,
  },
};

export const MinimalStyle: Story = {
  args: {
    data: dailyPowerData,
    xAxisKey: "day",
    dataKeys: { value: "전력(kWh)" },
    height: 250,
    showGrid: false,
    showLegend: false,
    showDots: false,
  },
};
