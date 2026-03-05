"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useCleaningCoefficientList,
  useAddCleaningCoefficient,
  useUpdateCleaningCoefficient,
} from "@/lib/hooks/use-settings";
import type { CleaningCoefficientVO } from "@/lib/types/setting";

// ============================================================================
// 컴포넌트
// ============================================================================

export function CleaningCoefficientTab() {
  const { data: coefficients, isLoading } = useCleaningCoefficientList();
  const addMutation = useAddCleaningCoefficient();
  const updateMutation = useUpdateCleaningCoefficient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CleaningCoefficientVO>({
    type: "",
    value: 0,
    unit: "",
    used: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formData.id) {
        await updateMutation.mutateAsync(formData);
      } else {
        await addMutation.mutateAsync(formData);
      }

      setFormData({
        type: "",
        value: 0,
        unit: "",
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

  if (!coefficients || coefficients.length === 0) {
    return (
      <EmptyState
        icon={Plus}
        title="미화 계수가 없습니다"
        description="미화 계수를 등록해주세요."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* 추가 버튼 */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setFormData({
              type: "",
              value: 0,
              unit: "",
              used: true,
            });
            setShowForm(!showForm);
          }}
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
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
                  <label className="text-sm font-medium">구분</label>
                  <Input
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    placeholder="구분 입력"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">값</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">단위</label>
                  <Input
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    placeholder="단위 입력"
                    required
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
          <CardTitle className="text-base">미화 계수 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-2 font-medium">구분</th>
                  <th className="text-center px-4 py-2 font-medium w-24">값</th>
                  <th className="text-center px-4 py-2 font-medium w-20">단위</th>
                  <th className="text-center px-4 py-2 font-medium w-20">사용</th>
                  <th className="text-center px-4 py-2 font-medium w-16">작업</th>
                </tr>
              </thead>
              <tbody>
                {coefficients.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{item.type}</td>
                    <td className="px-4 py-3 text-center">{item.value}</td>
                    <td className="px-4 py-3 text-center text-xs">{item.unit}</td>
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
                            type: item.type,
                            value: item.value,
                            unit: item.unit,
                            used: item.used,
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
