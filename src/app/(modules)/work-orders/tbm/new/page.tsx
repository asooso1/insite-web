"use client";

import { PageHeader } from "@/components/common/page-header";
import { CalendarClock } from "lucide-react";
import { TbmForm } from "../_components/tbm-form";

export default function TbmNewPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="TBM 등록"
        description="새로운 작업전미팅을 등록합니다."
        icon={CalendarClock}
      />
      <TbmForm mode="create" />
    </div>
  );
}
