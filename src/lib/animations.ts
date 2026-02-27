import { type Variants } from "framer-motion";

/**
 * 페이지 전환 애니메이션 variants
 * PageTransition 컴포넌트에서 사용
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

/**
 * 컨테이너 stagger 애니메이션
 * 리스트/메뉴 항목의 순차 등장 효과
 */
export const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  initial: {
    opacity: 0,
    y: -8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * KPI/카드 진입 애니메이션
 * custom={index}로 순차 지연 가능
 */
export const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
    scale: 0.96,
  },
  animate: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      delay: index * 0.05,
    },
  }),
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

/**
 * 헤더 진입 애니메이션
 */
export const headerVariants: Variants = {
  initial: {
    opacity: 0,
    y: -8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * 사이드바 메뉴 항목 애니메이션
 * custom={index}로 순차 지연 가능
 */
export const sidebarItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -8,
  },
  animate: (index: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
      delay: index * 0.03,
    },
  }),
};

/**
 * 활성 표시자 애니메이션
 * 사이드바 활성 항목의 파란 인디케이터
 */
export const activeIndicatorVariants: Variants = {
  initial: { opacity: 0, scaleY: 0 },
  animate: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scaleY: 0,
    transition: {
      duration: 0.15,
    },
  },
};

/**
 * 배지/상태 pulse 애니메이션
 * 활성 상태, 처리 중 상태에 사용
 */
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * 카운트업 페이드인
 */
export const countUpVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * 모달 오버레이 애니메이션
 */
export const modalOverlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

/**
 * 모달 콘텐츠 애니메이션
 */
export const modalContentVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.92,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    transition: {
      duration: 0.2,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

/**
 * 빈 상태 애니메이션
 */
export const emptyStateVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * 테이블 행 stagger 컨테이너
 */
export const tableRowContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

/**
 * 테이블 행 개별 애니메이션
 */
export const tableRowVariants: Variants = {
  initial: {
    opacity: 0,
    y: 4,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
