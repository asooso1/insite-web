"use client";

import { useEffect, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

/**
 * KPI 카드의 숫자 카운팅 애니메이션 훅
 *
 * @param from - 시작 값 (기본값: 0)
 * @param to - 종료 값 (최종 표시 값)
 * @param duration - 애니메이션 지속 시간 초 단위 (기본값: 1.5)
 *
 * @example
 * ```tsx
 * const displayValue = useCountUp(0, 1234, 1.5);
 * return <span>{displayValue.toLocaleString()}</span>;
 * ```
 */
export function useCountUp(
  from: number = 0,
  to: number = 0,
  duration: number = 1.5
): number {
  const motionValue = useMotionValue(from);
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });

    const controls = animate(motionValue, to, {
      duration,
      ease: "easeOut",
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [to, duration, motionValue]);

  return displayValue;
}
