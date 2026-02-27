"use client";

import * as React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthInitializer } from "./auth-initializer";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * 통합 프로바이더
 * - nuqs (URL 상태 관리)
 * - 테마 (next-themes)
 * - React Query
 * - Toast (sonner)
 */
export function Providers({ children }: ProvidersProps): React.ReactNode {
  return (
    <NuqsAdapter>
      <QueryProvider>
        <ThemeProvider>
          <AuthInitializer />
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </QueryProvider>
    </NuqsAdapter>
  );
}
