import type { Meta, StoryObj } from "@storybook/react";
import { InfoPanel } from "./info-panel";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const meta = {
  title: "Components/DataDisplay/InfoPanel",
  component: InfoPanel,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InfoPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InfoPanel
      items={[
        { label: "시설명", value: "에어컨 실내기" },
        { label: "상태", value: "운영중" },
        { label: "위치", value: "건물 A / 3층" },
        { label: "마지막 점검", value: "2026-03-15" },
      ]}
    />
  ),
};

export const SingleColumn: Story = {
  render: () => (
    <InfoPanel
      items={[
        { label: "프로젝트명", value: "빌딩 에너지 관리 시스템" },
        { label: "담당자", value: "김철수" },
        { label: "시작일", value: "2026-01-01" },
        { label: "예산", value: "$100,000" },
      ]}
      columns={1}
    />
  ),
};

export const TwoColumns: Story = {
  render: () => (
    <InfoPanel
      items={[
        { label: "작업번호", value: "#001" },
        { label: "상태", value: "진행중" },
        { label: "담당자", value: "박영희" },
        { label: "예정일", value: "2026-03-20" },
        { label: "우선순위", value: "높음" },
        { label: "예산", value: "$5,000" },
      ]}
      columns={2}
    />
  ),
};

export const WithCopyable: Story = {
  render: () => (
    <InfoPanel
      items={[
        { label: "시설 ID", value: "FAC-2026-001", copyable: true },
        { label: "작업 ID", value: "WO-2026-0123", copyable: true },
        { label: "연락처", value: "02-1234-5678" },
        { label: "이메일", value: "info@example.com", copyable: true },
      ]}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <InfoPanel
      items={[
        { label: "정보", value: "로딩 중..." },
        { label: "상태", value: "..." },
        { label: "담당자", value: "..." },
        { label: "일시", value: "..." },
      ]}
      loading
    />
  ),
};

export const BuildingInfo: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">빌딩 정보</h3>
      <InfoPanel
        items={[
          { label: "빌딩명", value: "본사 빌딩" },
          { label: "주소", value: "서울시 강남구 테헤란로 123" },
          { label: "면적", value: "50,000 m²" },
          { label: "층수", value: "15층" },
          { label: "준공일", value: "2015-06-01" },
          { label: "관리자", value: "김철수" },
        ]}
        columns={2}
      />
    </div>
  ),
};

export const FacilityInfo: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">시설 정보</h3>
      <InfoPanel
        items={[
          { label: "시설명", value: "중앙 에어컨" },
          { label: "타입", value: "냉난방기" },
          { label: "제조사", value: "LG전자" },
          { label: "모델", value: "AWHC-2500" },
          { label: "설치일", value: "2018-04-15" },
          { label: "상태", value: "운영중" },
          { label: "마지막 점검", value: "2026-03-10" },
          { label: "다음 점검", value: "2026-04-10" },
        ]}
        columns={2}
      />
    </div>
  ),
};

export const WorkOrderInfo: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">작업 상세</h3>
      <InfoPanel
        items={[
          { label: "작업번호", value: "WO-2026-0001", copyable: true },
          { label: "제목", value: "에어컨 정비" },
          { label: "상태", value: "진행중" },
          { label: "우선순위", value: "높음" },
          { label: "담당자", value: "박영희" },
          { label: "요청자", value: "김철수" },
          { label: "예정일", value: "2026-03-20" },
          { label: "설명", value: "주말에 중앙 에어컨 정기 점검 및 필터 교체 예정" },
        ]}
        columns={2}
      />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-sm font-semibold mb-4">단일 열</h3>
        <InfoPanel
          items={[
            { label: "항목 1", value: "값 1" },
            { label: "항목 2", value: "값 2" },
          ]}
          columns={1}
        />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-4">두 개 열</h3>
        <InfoPanel
          items={[
            { label: "항목 1", value: "값 1" },
            { label: "항목 2", value: "값 2" },
            { label: "항목 3", value: "값 3" },
            { label: "항목 4", value: "값 4" },
          ]}
          columns={2}
        />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-4">복사 가능</h3>
        <InfoPanel
          items={[
            { label: "ID", value: "ABC123", copyable: true },
            { label: "코드", value: "XYZ789", copyable: true },
            { label: "설명", value: "복사 불가능한 항목" },
          ]}
        />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-4">로딩 상태</h3>
        <InfoPanel
          items={[
            { label: "정보 1", value: "..." },
            { label: "정보 2", value: "..." },
          ]}
          loading
        />
      </div>
    </div>
  ),
};
