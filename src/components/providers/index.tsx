"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * 통합 프로바이더
 * - 테마 (next-themes)
 * - React Query
 * - Toast (sonner)
 */
export function Providers({ children }: ProvidersProps): React.JSX.Element {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </ThemeProvider>
    </QueryProvider>
  );
}
