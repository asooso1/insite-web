import type { Meta, StoryObj } from "@storybook/react";
import {
  StatWidget,
  StatWidgetGrid,
  type SparklineData,
} from "./stat-widget";
import { TrendingUp, Users, Zap, Building2 } from "lucide-react";

const meta = {
  title: "Components/Data Display/StatWidget",
  component: StatWidget,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    trend: {
      control: "select",
      options: ["up", "down", "neutral"],
    },
  },
} satisfies Meta<typeof StatWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "일일 방문자",
    value: 1234,
    unit: "명",
  },
};

export const WithTrend: Story = {
  args: {
    title: "일일 방문자",
    value: 1234,
    unit: "명",
  },
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-3">상승 트렌드</h3>
        <StatWidget
          title="일일 방문자"
          value={1234}
          unit="명"
          icon={Users}
          trend="up"
          trendValue="+5.2%"
          trendLabel="전월 대비"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">하강 트렌드</h3>
        <StatWidget
          title="에너지 사용량"
          value={456.7}
          unit="kWh"
          icon={Zap}
          trend="down"
          trendValue="-3.1%"
          trendLabel="지난주 대비"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">중립 트렌드</h3>
        <StatWidget
          title="시설 개수"
          value={42}
          unit="개"
          icon={Building2}
          trend="neutral"
          trendValue="0%"
          trendLabel="변화 없음"
        />
      </div>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    title: "일일 방문자",
    value: 0,
    unit: "명",
  },
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-3">로딩 상태</h3>
        <StatWidget
          title="일일 방문자"
          value={0}
          unit="명"
          icon={Users}
          loading={true}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">여러 로딩 위젯</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatWidget title="데이터 로딩중..." value={0} loading={true} />
          <StatWidget title="데이터 로딩중..." value={0} loading={true} />
          <StatWidget title="데이터 로딩중..." value={0} loading={true} />
          <StatWidget title="데이터 로딩중..." value={0} loading={true} />
        </div>
      </div>
    </div>
  ),
};

export const WithSparkline: Story = {
  args: {
    title: "주간 에너지 사용량",
    value: 456.7,
    unit: "kWh",
  },
  render: () => {
    const sparklineData: SparklineData[] = [
      { value: 400 },
      { value: 420 },
      { value: 380 },
      { value: 450 },
      { value: 456 },
      { value: 490 },
      { value: 480 },
    ];

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-3">스파크라인 포함</h3>
          <StatWidget
            title="주간 에너지 사용량"
            value={456.7}
            unit="kWh"
            icon={Zap}
            sparklineData={sparklineData}
            sparklineColor="hsl(var(--primary))"
            trend="up"
            trendValue="+12.5%"
            trendLabel="주전 대비"
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">다양한 색상의 스파크라인</h3>
          <div className="space-y-3">
            <StatWidget
              title="월간 방문자"
              value={12450}
              unit="명"
              sparklineData={sparklineData}
              sparklineColor="hsl(120, 100%, 50%)"
              trend="up"
              trendValue="+8.3%"
            />
            <StatWidget
              title="오류 발생률"
              value={2.4}
              unit="%"
              sparklineData={sparklineData.map((d) => ({
                value: 100 - d.value / 5,
              }))}
              sparklineColor="hsl(0, 100%, 50%)"
              trend="down"
              trendValue="-1.2%"
            />
          </div>
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  args: {
    title: "일일 방문자",
    value: 1234,
    unit: "명",
  },
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-3">작은 크기</h3>
        <StatWidget
          title="일일 방문자"
          value={1234}
          unit="명"
          size="sm"
          icon={Users}
          trend="up"
          trendValue="+5.2%"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">중간 크기 (기본)</h3>
        <StatWidget
          title="일일 방문자"
          value={1234}
          unit="명"
          size="md"
          icon={Users}
          trend="up"
          trendValue="+5.2%"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">큰 크기</h3>
        <StatWidget
          title="일일 방문자"
          value={1234}
          unit="명"
          size="lg"
          icon={Users}
          trend="up"
          trendValue="+5.2%"
        />
      </div>
    </div>
  ),
};

export const Grid: Story = {
  args: {
    title: "일일 방문자",
    value: 1234,
    unit: "명",
  },
  render: () => {
    const sparklineData: SparklineData[] = [
      { value: 400 },
      { value: 420 },
      { value: 380 },
      { value: 450 },
      { value: 456 },
    ];

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">2열 그리드 레이아웃</h3>
        <StatWidgetGrid columns={2}>
          <StatWidget
            title="일일 방문자"
            value={1234}
            unit="명"
            icon={Users}
            trend="up"
            trendValue="+5.2%"
          />
          <StatWidget
            title="에너지 사용량"
            value={456.7}
            unit="kWh"
            icon={Zap}
            sparklineData={sparklineData}
            sparklineColor="hsl(var(--primary))"
            trend="up"
            trendValue="+12.5%"
          />
        </StatWidgetGrid>

        <h3 className="text-sm font-semibold">3열 그리드 레이아웃</h3>
        <StatWidgetGrid columns={3}>
          <StatWidget
            title="일일 방문자"
            value={1234}
            unit="명"
            icon={Users}
            trend="up"
            trendValue="+5.2%"
          />
          <StatWidget
            title="에너지 사용량"
            value={456.7}
            unit="kWh"
            icon={Zap}
            trend="down"
            trendValue="-3.1%"
          />
          <StatWidget
            title="시설 개수"
            value={42}
            unit="개"
            icon={Building2}
            trend="neutral"
          />
        </StatWidgetGrid>

        <h3 className="text-sm font-semibold">4열 그리드 레이아웃 (반응형)</h3>
        <StatWidgetGrid columns={4}>
          <StatWidget
            title="일일 방문자"
            value={1234}
            unit="명"
            icon={Users}
            trend="up"
            trendValue="+5.2%"
          />
          <StatWidget
            title="에너지 사용량"
            value={456.7}
            unit="kWh"
            icon={Zap}
            trend="down"
            trendValue="-3.1%"
          />
          <StatWidget
            title="시설 개수"
            value={42}
            unit="개"
            icon={Building2}
            trend="neutral"
          />
          <StatWidget
            title="가동률"
            value={98.5}
            unit="%"
            icon={TrendingUp}
            trend="up"
            trendValue="+2.1%"
          />
        </StatWidgetGrid>
      </div>
    );
  },
};

export const Clickable: Story = {
  args: {
    title: "일일 방문자",
    value: 1234,
    unit: "명",
  },
  render: () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">클릭 가능한 위젯</h3>
      <StatWidget
        title="일일 방문자"
        value={1234}
        unit="명"
        icon={Users}
        trend="up"
        trendValue="+5.2%"
        onClick={() => alert("위젯을 클릭했습니다!")}
      />
      <p className="text-xs text-muted-foreground">
        위젯을 클릭하면 상세 정보를 볼 수 있습니다.
      </p>
    </div>
  ),
};
