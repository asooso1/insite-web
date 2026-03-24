"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useCleaningUtilList,
  useAddCleaningUtil,
  useUpdateCleaningUtil,
} from "@/lib/hooks/use-settings";
import type { CleaningTreeDTO, CleaningTreeVO } from "@/lib/types/setting";

// ============================================================================
// 트리 평탄화 함수
// ============================================================================

function flattenTree(
  nodes: CleaningTreeDTO[] | undefined,
  depth: number = 0
): Array<CleaningTreeDTO & { depth: number }> {
  if (!nodes) return [];

  const result: Array<CleaningTreeDTO & { depth: number }> = [];

  nodes.forEach((node) => {
    result.push({ ...node, depth });
    if (node.items && node.items.length > 0) {
      result.push(...flattenTree(node.items, depth + 1));
    }
  });

  return result;
}

// ============================================================================
// 컴포넌트
// ============================================================================

export function CleaningUtilTab() {
  const { data: tree, isLoading } = useCleaningUtilList();
  const addMutation = useAddCleaningUtil();
  const updateMutation = useUpdateCleaningUtil();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CleaningTreeVO>({
    code: "",
    name: "",
    sortNo: 0,
    used: true,
  });

  const flattenedData = useMemo(() => {
    const flat = flattenTree(tree);
    if (!searchKeyword) return flat;

    return flat.filter(
      (item) =>
        item.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [tree, searchKeyword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formData.id) {
        await updateMutation.mutateAsync(formData);
      } else {
        await addMutation.mutateAsync(formData);
      }

      setFormData({
        code: "",
        name: "",
        sortNo: 0,
        used: true,
      });
      setShowForm(false);
    } catch {
      // 에러 처리는 mutation 내부에서
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!tree || tree.length === 0) {
    return (
      <EmptyState
        icon={Plus}
        title="미화 도구가 없습니다"
        description="미화 도구를 등록해주세요."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* 검색 및 추가 버튼 */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="코드 또는 도구명 검색..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="max-w-xs"
        />
        <Button
          onClick={() => {
            setFormData({
              code: "",
              name: "",
              sortNo: 0,
              used: true,
            });
            setShowForm(!showForm);
          }}
          size="sm"
        >
          <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
          추가
        </Button>
      </div>

      {/* 추가 폼 */}
      {showForm && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">코드</label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="코드 입력"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">도구명</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="도구명 입력"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">정렬순서</label>
                  <Input
                    type="number"
                    value={formData.sortNo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sortNo: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">사용</label>
                  <select
                    value={formData.used ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({ ...formData, used: e.target.value === "true" })
                    }
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="true">사용</option>
                    <option value="false">미사용</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={addMutation.isPending || updateMutation.isPending}
                >
                  {formData.id ? "수정" : "등록"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">미화 도구 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-2 font-medium">코드</th>
                  <th className="text-left px-4 py-2 font-medium">도구명</th>
                  <th className="text-center px-4 py-2 font-medium w-20">정렬순서</th>
                  <th className="text-center px-4 py-2 font-medium w-20">사용</th>
                  <th className="text-center px-4 py-2 font-medium w-16">작업</th>
                </tr>
              </thead>
              <tbody>
                {flattenedData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-muted/50"
                    style={{ paddingLeft: `${item.depth * 16}px` }}
                  >
                    <td className="px-4 py-3" style={{ paddingLeft: `${item.depth * 16 + 16}px` }}>
                      <span className="text-muted-foreground text-xs">{item.code}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-center text-xs">{item.sortNo}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-medium ${item.used ? "text-green-600" : "text-muted-foreground"}`}>
                        {item.used ? "사용" : "미사용"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setFormData({
                            id: item.id,
                            code: item.code,
                            name: item.name,
                            sortNo: item.sortNo,
                            used: item.used,
                            parentId: item.parentId,
                          });
                          setShowForm(true);
                        }}
                        className="h-6 w-6"
                      >
                        <span className="text-xs">수정</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
