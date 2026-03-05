"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { ComplainForm } from "../_components/complain-form";

export default function ComplainNewPage() {
  const { user } = useAuthStore();
  const buildingId = user ? Number(user.currentBuildingId) : 0;

  return (
    <div className="p-6">
      <ComplainForm buildingId={buildingId} />
    </div>
  );
}
