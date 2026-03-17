import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const meta = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">세로 스크롤</h3>
        <p className="text-xs text-muted-foreground mb-3">
          높이가 제한되어 있어 세로로 스크롤할 수 있습니다.
        </p>
      </div>
      <ScrollArea className="h-64 w-48 rounded border p-4">
        <div className="space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="text-sm p-2 rounded bg-muted">
              항목 {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export const Horizontal = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">가로 스크롤</h3>
        <p className="text-xs text-muted-foreground mb-3">
          너비가 제한되어 있어 가로로 스크롤할 수 있습니다.
        </p>
      </div>
      <ScrollArea className="w-full max-w-lg h-20 rounded border p-4 whitespace-nowrap">
        <div className="flex gap-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 text-sm p-2 rounded bg-muted">
              항목 {i + 1}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  ),
};

export const Both = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">양방향 스크롤</h3>
        <p className="text-xs text-muted-foreground mb-3">
          가로 및 세로 모두 스크롤할 수 있습니다.
        </p>
      </div>
      <ScrollArea className="w-full max-w-3xl h-64 rounded border p-4">
        <div className="space-y-4 min-w-max">
          <table className="text-sm border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left min-w-20">번호</th>
                <th className="border p-2 text-left min-w-40">시설명</th>
                <th className="border p-2 text-left min-w-40">위치</th>
                <th className="border p-2 text-left min-w-32">상태</th>
                <th className="border p-2 text-left min-w-32">관리자</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }).map((_, i) => (
                <tr key={i}>
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">냉난방기 {i + 1}</td>
                  <td className="border p-2">A동 {Math.floor(i / 5) + 1}층</td>
                  <td className="border p-2">
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                      운영중
                    </span>
                  </td>
                  <td className="border p-2">담당자 {((i % 5) + 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  ),
};

export const LongList = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">긴 목록</h3>
        <p className="text-xs text-muted-foreground mb-3">
          실제 목록 데이터가 많을 때의 스크롤 영역 사용 예시입니다.
        </p>
      </div>
      <ScrollArea className="h-80 w-full max-w-2xl rounded border">
        <div className="p-4 space-y-2">
          <div className="font-semibold mb-4">작업 목록</div>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded hover:bg-muted transition-colors border-b last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">WO-2024-{String(i + 1).padStart(3, "0")}</p>
                <p className="text-xs text-muted-foreground">
                  {["필터 교체", "정기 점검", "고장 수리", "부품 교체", "청소"][i % 5]}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  i % 3 === 0 ? "bg-green-100 text-green-700" :
                  i % 3 === 1 ? "bg-yellow-100 text-yellow-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {i % 3 === 0 ? "완료" : i % 3 === 1 ? "진행중" : "대기"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export const CodeBlock = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">코드 블록</h3>
        <p className="text-xs text-muted-foreground mb-3">
          코드나 긴 텍스트를 표시할 때 사용합니다.
        </p>
      </div>
      <ScrollArea className="h-64 w-full max-w-4xl rounded border bg-slate-900 text-slate-100 p-4">
        <div className="font-mono text-sm space-y-1 min-w-max">
          <div>
            <span className="text-blue-400">interface</span> <span className="text-yellow-300">WorkOrder</span> {"{"}
          </div>
          <div className="ml-4">
            <span className="text-cyan-400">id</span>: <span className="text-green-400">number</span>;
          </div>
          <div className="ml-4">
            <span className="text-cyan-400">title</span>: <span className="text-green-400">string</span>;
          </div>
          <div className="ml-4">
            <span className="text-cyan-400">description</span>?: <span className="text-green-400">string</span>;
          </div>
          <div className="ml-4">
            <span className="text-cyan-400">facilityId</span>: <span className="text-green-400">number</span>;
          </div>
          <div className="ml-4">
            <span className="text-cyan-400">status</span>: <span className="text-green-400">"WRITE"</span> | <span className="text-green-400">"ISSUE"</span> | <span className="text-green-400">"PROCESSING"</span>;
          </div>
          <div className="ml-4">
            <span className="text-cyan-400">assignedTo</span>: <span className="text-green-400">string</span>;
          </div>
          <div className="ml-4">
            <span className="text-cyan-400">createdAt</span>: <span className="text-green-400">Date</span>;
          </div>
          <div className="ml-4">
            <span className="text-cyan-400">updatedAt</span>: <span className="text-green-400">Date</span>;
          </div>
          <div>{"};"}</div>
          <div className="mt-4">
            <span className="text-blue-400">const</span> <span className="text-yellow-300">workOrders</span>: <span className="text-yellow-300">WorkOrder</span>[] = [];
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  ),
};
