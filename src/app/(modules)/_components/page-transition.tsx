"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { pageVariants } from "@/lib/animations";
import { useMotionPreference } from "@/lib/hooks/use-motion-preference";

interface PageTransitionProps {
  children: ReactNode;
  /** 고유 키 (페이지별로 다르게 설정하면 전환 효과 활성화) */
  layoutKey?: string;
}

/**
 * 페이지 전환 애니메이션 래퍼 (Client Component)
 *
 * (modules)/layout.tsx는 Server Component로 유지하고,
 * 이 컴포넌트를 각 페이지에서 선택적으로 사용합니다.
 *
 * WCAG: prefers-reduced-motion 존중
 *
 * @example
 * ```tsx
 * // 각 페이지 컴포넌트에서 사용
 * export default function WorkOrdersPage() {
 *   return (
 *     <PageTransition>
 *       <PageHeader title="작업 목록" ... />
 *       <DataTable ... />
 *     </PageTransition>
 *   );
 * }
 * ```
 */
export function PageTransition({
  children,
  layoutKey,
}: PageTransitionProps): ReactNode {
  const prefersReducedMotion = useMotionPreference();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={layoutKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
