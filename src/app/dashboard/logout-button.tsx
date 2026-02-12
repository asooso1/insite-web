"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

/**
 * 로그아웃 버튼 컴포넌트
 */
export function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      로그아웃
    </Button>
  );
}
