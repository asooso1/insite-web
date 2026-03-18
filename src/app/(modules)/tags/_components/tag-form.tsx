"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useCreateTag, useUpdateTag } from "@/lib/hooks/use-tags";
import { TagType, TagTypeLabel, type QrNfcVO, type TagDetailDTO } from "@/lib/types/tag";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api/error-handler";

interface TagFormProps {
  defaultValues?: TagDetailDTO;
}

export function TagForm({ defaultValues }: TagFormProps) {
  const router = useRouter();
  const [isMutating, setIsMutating] = useState(false);
  const [tagType, setTagType] = useState<TagType>(defaultValues?.tagType ?? TagType.NFC);
  const [facilityId, setFacilityId] = useState(defaultValues?.facilityId.toString() ?? "");
  const [buildingFloorId, setBuildingFloorId] = useState(defaultValues?.buildingFloorId.toString() ?? "");
  const [zoneId, setZoneId] = useState(defaultValues?.zoneId?.toString() ?? "");
  const [description, setDescription] = useState(defaultValues?.description ?? "");

  const { mutate: createTag } = useCreateTag();
  const { mutate: updateTag } = useUpdateTag();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (!facilityId || !buildingFloorId) {
        toast.error("필수 정보를 입력해주세요.");
        return;
      }

      setIsMutating(true);

      const vo: QrNfcVO = {
        ...(defaultValues?.id && { id: defaultValues.id }),
        tagType,
        facilityId: Number(facilityId),
        buildingFloorId: Number(buildingFloorId),
        zoneId: zoneId ? Number(zoneId) : null,
        description: description || undefined,
      };

      if (defaultValues?.id) {
        updateTag(vo);
        toast.success("태그가 수정되었습니다.");
      } else {
        createTag(vo);
        toast.success("태그가 등록되었습니다.");
      }

      router.push("/tags");
    } catch (error) {
      handleApiError(error as Error);
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">
            태그 유형 <span className="text-red-500">*</span>
          </label>
          <Select value={tagType} onValueChange={(value) => setTagType(value as TagType)}>
            <SelectTrigger>
              <SelectValue placeholder="태그 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TagType).map((type) => (
                <SelectItem key={type} value={type}>
                  {TagTypeLabel[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            시설 <span className="text-red-500">*</span>
          </label>
          <Select value={facilityId} onValueChange={setFacilityId}>
            <SelectTrigger>
              <SelectValue placeholder="시설 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">시설 1</SelectItem>
              <SelectItem value="2">시설 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            층 <span className="text-red-500">*</span>
          </label>
          <Select value={buildingFloorId} onValueChange={setBuildingFloorId}>
            <SelectTrigger>
              <SelectValue placeholder="층 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1층</SelectItem>
              <SelectItem value="2">2층</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">구역</label>
          <Select value={zoneId} onValueChange={setZoneId}>
            <SelectTrigger>
              <SelectValue placeholder="구역 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">선택 안 함</SelectItem>
              <SelectItem value="1">구역 1</SelectItem>
              <SelectItem value="2">구역 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">설명</label>
        <Textarea
          placeholder="태그에 대한 설명을 입력해주세요"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          취소
        </Button>
        <Button type="submit" disabled={isMutating}>
          {isMutating ? (defaultValues?.id ? "수정 중..." : "등록 중...") : defaultValues?.id ? "수정" : "등록"}
        </Button>
      </div>
    </form>
  );
}
