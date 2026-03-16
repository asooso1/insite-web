import type { Meta, StoryObj } from "@storybook/react";
import { KPICard } from "./kpi-card";
import { TrendingUp, TrendingDown } from "lucide-react";

const meta = {
  title: "Components/DataDisplay/KPICard",
  component: KPICard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KPICard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "에너지 사용량",
    value: "1,234",
    unit: "kWh",
  },
};

export const WithTrendingUp: Story = {
  args: {
    title: "CO2 배출량",
    value: "567",
    unit: "kg",
    trend: "up",
    trendLabel: "+12% vs 지난 달",
  },
};

export const WithTrendingDown: Story = {
  args: {
    title: "에너지 비용",
    value: "$2,340",
    trend: "down",
    trendLabel: "-8% vs 지난 달",
  },
};

export const WithIcon: Story = {
  args: {
    title: "전력 효율성",
    value: "89",
    unit: "%",
    icon: "⚡",
  },
};

export const Loading: Story = {
  args: {
    title: "실시간 소비",
    value: "...",
    unit: "kW",
    loading: true,
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="에너지 사용량"
        value="1,234"
        unit="kWh"
        icon="⚡"
        trend="up"
        trendLabel="+5%"
      />
      <KPICard
        title="비용 절감"
        value="$2,340"
        trend="down"
        trendLabel="-12%"
      />
      <KPICard
        title="탄소 감축"
        value="567"
        unit="kg CO2"
        icon="🌱"
      />
      <KPICard
        title="효율성"
        value="89"
        unit="%"
        trend="up"
        trendLabel="+3%"
      />
    </div>
  ),
};

export const Dashboard: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">에너지 대시보드</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="월간 사용량"
          value="12,345"
          unit="kWh"
          icon="📊"
          trend="down"
          trendLabel="-8%"
        />
        <KPICard
          title="예상 비용"
          value="$5,678"
          icon="💰"
          trend="up"
          trendLabel="+2%"
        />
        <KPICard
          title="탄소 배출"
          value="4,567"
          unit="kg CO2"
          icon="🌍"
          trend="down"
          trendLabel="-5%"
        />
        <KPICard
          title="목표 달성률"
          value="78"
          unit="%"
          icon="🎯"
          trend="up"
          trendLabel="+10%"
        />
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-4">기본</h3>
        <KPICard title="기본 KPI" value="100" unit="unit" />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-4">상승 추세</h3>
        <KPICard
          title="상승 추세"
          value="150"
          unit="unit"
          trend="up"
          trendLabel="+50%"
          icon="📈"
        />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-4">하강 추세</h3>
        <KPICard
          title="하강 추세"
          value="50"
          unit="unit"
          trend="down"
          trendLabel="-25%"
          icon="📉"
        />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-4">로딩 상태</h3>
        <KPICard title="로딩 중" value="..." unit="unit" loading={true} />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-4">아이콘 포함</h3>
        <KPICard title="아이콘" value="999" unit="unit" icon="⚙️" />
      </div>
    </div>
  ),
};
