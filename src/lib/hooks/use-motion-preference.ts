"use client";

import { useState, useEffect } from "react";

/**
 * prefers-reduced-motion 미디어 쿼리 감지 훅
 *
 * WCAG 2.1 SC 2.3.3 (Animation from Interactions) 준수
 * OS 설정에서 모션 감소를 요청한 사용자에게 애니메이션을 비활성화합니다.
 *
 * @returns true면 애니메이션을 줄이거나 비활성화
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useMotionPreference();
 *
 * <motion.div
 *   variants={prefersReducedMotion ? undefined : cardVariants}
 *   initial={prefersReducedMotion ? false : "initial"}
 *   animate="animate"
 * />
 * ```
 */
export function useMotionPreference(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}
