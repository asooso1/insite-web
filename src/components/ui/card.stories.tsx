import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

const meta = {
  title: "Components/UI/Card",
  component: Card,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>카드 제목</CardTitle>
        <CardDescription>카드 설명</CardDescription>
      </CardHeader>
      <CardContent>
        <p>이것은 카드의 주요 콘텐츠입니다.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>작업 상세</CardTitle>
        <CardDescription>작업 #001</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">담당자</p>
            <p className="text-sm text-gray-600">김철수</p>
          </div>
          <div>
            <p className="text-sm font-medium">진행상황</p>
            <p className="text-sm text-gray-600">진행중</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          취소
        </Button>
        <Button className="flex-1">저장</Button>
      </CardFooter>
    </Card>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">에너지 사용량</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold font-display">1,234</p>
          <p className="text-sm text-gray-600 mt-1">kWh / 월</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">CO2 배출량</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold font-display">567</p>
          <p className="text-sm text-gray-600 mt-1">kg / 월</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">비용 절감</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold font-display text-green-600">$2,340</p>
          <p className="text-sm text-gray-600 mt-1">연간</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>시설 정보</CardTitle>
        <CardDescription>건물 A / 3층</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">시설명</p>
          <p className="text-sm text-gray-600">에어컨 실내기</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">상태</p>
          <p className="text-sm text-gray-600">운영중</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">마지막 점검</p>
          <p className="text-sm text-gray-600">2026년 3월 15일</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          편집
        </Button>
        <Button variant="secondary" className="flex-1">
          점검 기록
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-3">헤더만 있는 카드</h3>
        <Card>
          <CardHeader>
            <CardTitle>제목</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">콘텐츠만 있는 카드</h3>
        <Card>
          <CardContent className="pt-6">
            <p>일부 콘텐츠</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">모든 섹션이 있는 카드</h3>
        <Card>
          <CardHeader>
            <CardTitle>완전한 카드</CardTitle>
            <CardDescription>설명이 포함됨</CardDescription>
          </CardHeader>
          <CardContent>
            <p>주요 콘텐츠</p>
          </CardContent>
          <CardFooter>
            <Button>액션</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  ),
};
