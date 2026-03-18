import type { Meta, StoryObj } from "@storybook/react";
import { PieChartPreset } from "./pie-chart";

const meta = {
  title: "Components/Charts/PieChart",
  component: PieChartPreset,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PieChartPreset>;

export default meta;
type Story = StoryObj<typeof meta>;

// 빌딩 에너지 관리용 샘플 데이터
const energyDistributionData = [
  { name: "조명", value: 4000 },
  { name: "냉난방", value: 3200 },
  { name: "환기", value: 2000 },
  { name: "급탕", value: 1500 },
  { name: "기타", value: 800 },
];

const facilityStatusData = [
  { name: "정상", value: 45 },
  { name: "점검필요", value: 20 },
  { name: "수리중", value: 15 },
  { name: "폐기", value: 5 },
];

const workOrderStatusData = [
  { name: "완료", value: 400 },
  { name: "진행중", value: 300 },
  { name: "대기", value: 200 },
];

const departmentAllocationData = [
  { name: "건축", value: 3500 },
  { name: "전기", value: 2800 },
  { name: "설비", value: 2200 },
  { name: "통신", value: 1200 },
];

export const Default: Story = {
  args: {
    data: workOrderStatusData,
    showLegend: true,
    height: 300,
  },
};

export const Donut: Story = {
  args: {
    data: workOrderStatusData,
    innerRadius: 60,
    centerLabel: "총 작업",
    centerValue: 900,
    showLegend: true,
    height: 350,
  },
};

export const WithLegend: Story = {
  args: {
    data: energyDistributionData,
    showLegend: true,
    showLabels: false,
    height: 350,
  },
};

export const WithLabels: Story = {
  args: {
    data: facilityStatusData,
    showLabels: true,
    showLegend: false,
    height: 350,
  },
};

export const Small: Story = {
  args: {
    data: workOrderStatusData,
    outerRadius: 50,
    height: 250,
    showLegend: true,
  },
};

export const Large: Story = {
  args: {
    data: energyDistributionData,
    outerRadius: 120,
    height: 450,
    showLegend: true,
  },
};

export const DonutWithCenterLabel: Story = {
  args: {
    data: facilityStatusData,
    innerRadius: 70,
    outerRadius: 110,
    centerLabel: "시설 현황",
    centerValue: 85,
    showLegend: true,
    height: 400,
  },
};

export const DonutWithTotal: Story = {
  args: {
    data: departmentAllocationData,
    innerRadius: 65,
    centerLabel: "예산",
    centerValue: "97억원",
    showLegend: true,
    height: 380,
  },
};

export const MultipleCharts: Story = {
  args: {
    data: energyDistributionData,
    showLegend: true,
    height: 300,
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-base font-semibold mb-4">에너지 분배</h3>
        <PieChartPreset
          data={energyDistributionData}
          showLegend={true}
          height={300}
        />
      </div>
      <div>
        <h3 className="text-base font-semibold mb-4">작업 상태</h3>
        <PieChartPreset
          data={workOrderStatusData}
          innerRadius={60}
          centerLabel="총계"
          centerValue={900}
          showLegend={true}
          height={300}
        />
      </div>
    </div>
  ),
};

export const WithoutLegend: Story = {
  args: {
    data: workOrderStatusData,
    showLegend: false,
    showLabels: true,
    height: 300,
  },
};

export const WithoutTooltip: Story = {
  args: {
    data: facilityStatusData,
    showTooltip: false,
    showLegend: true,
    height: 350,
  },
};

export const LargePaddingAngle: Story = {
  args: {
    data: departmentAllocationData,
    paddingAngle: 8,
    showLegend: true,
    height: 350,
  },
};

export const MinimalPadding: Story = {
  args: {
    data: workOrderStatusData,
    paddingAngle: 0,
    showLegend: true,
    height: 300,
  },
};

export const HighValueDonut: Story = {
  args: {
    data: [
      { name: "완료", value: 85 },
      { name: "미완료", value: 15 },
    ],
    innerRadius: 65,
    outerRadius: 105,
    centerLabel: "완료율",
    centerValue: "85%",
    showLegend: true,
    height: 350,
  },
};

export const MultiSeriesComparison: Story = {
  args: {
    data: workOrderStatusData,
    showLegend: false,
    height: 280,
  },
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div>
        <h4 className="text-sm font-semibold mb-3 text-center">빌딩 A</h4>
        <PieChartPreset
          data={workOrderStatusData}
          innerRadius={50}
          outerRadius={80}
          height={280}
          showLegend={false}
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-3 text-center">빌딩 B</h4>
        <PieChartPreset
          data={[
            { name: "완료", value: 350 },
            { name: "진행중", value: 400 },
            { name: "대기", value: 150 },
          ]}
          innerRadius={50}
          outerRadius={80}
          height={280}
          showLegend={false}
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-3 text-center">빌딩 C</h4>
        <PieChartPreset
          data={[
            { name: "완료", value: 450 },
            { name: "진행중", value: 250 },
            { name: "대기", value: 100 },
          ]}
          innerRadius={50}
          outerRadius={80}
          height={280}
          showLegend={false}
        />
      </div>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    data: [],
    loading: true,
    height: 300,
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    height: 300,
  },
};

export const LongLabels: Story = {
  args: {
    data: [
      { name: "신축 및 대규모 개축 공사", value: 3500 },
      { name: "설비 유지보수", value: 2800 },
      { name: "외관 관리 및 미관 개선", value: 2200 },
      { name: "기타 운영비", value: 1200 },
    ],
    showLabels: true,
    showLegend: false,
    height: 400,
  },
};
