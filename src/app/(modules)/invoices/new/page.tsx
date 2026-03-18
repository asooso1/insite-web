"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InvoiceForm } from "../_components/invoice-form";

export default function InvoiceNewPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/invoices")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">청구서 등록</h1>
          <p className="text-muted-foreground">새 청구서를 등록합니다.</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <InvoiceForm mode="new" />
      </div>
    </div>
  );
}
