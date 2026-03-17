import type { Meta, StoryObj } from "@storybook/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Eye } from "lucide-react";

const meta = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 데이터
const facilityData = [
  { id: 1, name: "중앙 냉난방기", location: "A동 1층", status: "운영중", manager: "김철수" },
  { id: 2, name: "실내기 - B동", location: "B동 3층", status: "운영중", manager: "이영희" },
  { id: 3, name: "핸들러 유닛", location: "C동 2층", status: "점검중", manager: "박민수" },
  { id: 4, name: "보일러", location: "지하 1층", status: "정지", manager: "최순희" },
  { id: 5, name: "공조기", location: "A동 5층", status: "운영중", manager: "김철수" },
];

export const Default = {
  render: () => (
    <Table>
      <TableCaption>시설 목록</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">번호</TableHead>
          <TableHead>시설명</TableHead>
          <TableHead>위치</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="text-right">관리자</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {facilityData.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell className="text-right">{item.manager}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithSorting = {
  render: () => (
    <Table>
      <TableCaption>정렬 기능이 있는 시설 목록</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">번호</TableHead>
          <TableHead className="cursor-pointer hover:bg-muted">시설명 ↓</TableHead>
          <TableHead className="cursor-pointer hover:bg-muted">위치</TableHead>
          <TableHead className="cursor-pointer hover:bg-muted">상태</TableHead>
          <TableHead className="text-right cursor-pointer hover:bg-muted">관리자</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {facilityData.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell className="text-right">{item.manager}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Striped = {
  render: () => (
    <Table>
      <TableCaption>줄무늬 스타일 테이블</TableCaption>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-12">번호</TableHead>
          <TableHead>시설명</TableHead>
          <TableHead>위치</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="text-right">관리자</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {facilityData.map((item, index) => (
          <TableRow
            key={item.id}
            className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}
          >
            <TableCell className="font-medium">{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell className="text-right">{item.manager}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Compact = {
  render: () => (
    <Table>
      <TableCaption>컴팩트 스타일 테이블</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="h-8 px-2">번호</TableHead>
          <TableHead className="h-8 px-2">시설명</TableHead>
          <TableHead className="h-8 px-2">위치</TableHead>
          <TableHead className="h-8 px-2">상태</TableHead>
          <TableHead className="h-8 px-2 text-right">관리자</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {facilityData.map((item) => (
          <TableRow key={item.id} className="h-9">
            <TableCell className="p-1 text-xs font-medium">{item.id}</TableCell>
            <TableCell className="p-1 text-xs">{item.name}</TableCell>
            <TableCell className="p-1 text-xs">{item.location}</TableCell>
            <TableCell className="p-1 text-xs">{item.status}</TableCell>
            <TableCell className="p-1 text-xs text-right">{item.manager}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithActions = {
  render: () => (
    <Table>
      <TableCaption>액션 버튼이 있는 테이블</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">번호</TableHead>
          <TableHead>시설명</TableHead>
          <TableHead>위치</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="text-right">액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {facilityData.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  item.status === "운영중"
                    ? "bg-green-100 text-green-700"
                    : item.status === "점검중"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {item.status}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-1 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`${item.name} 상세보기`}
                  title="상세보기"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`${item.name} 수정`}
                  title="수정"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  aria-label={`${item.name} 삭제`}
                  title="삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4} className="text-right font-semibold">
            합계
          </TableCell>
          <TableCell className="text-right font-semibold">
            {facilityData.length}개
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
