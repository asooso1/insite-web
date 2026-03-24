# 패키지 업그레이드 노트

> **목적:** 주요 패키지 업그레이드 이력 및 breaking changes 기록
> **최종 업데이트:** 2026-03-24

## 이 문서 사용법

- 패키지 버전 충돌이나 빌드 오류 발생 시 참조
- 새 패키지 업그레이드 전 기존 breaking changes 확인
- recharts/Storybook 관련 코드 수정 시 변경 이력 확인

---

## 적용된 업그레이드 (2026-03-19)

### 보안 패치
- **Next.js 16.1.6 → 16.2.0**: CVE 5건 수정 (CSRF bypass, DoS, HTTP smuggling)
- **React 19.2.3 → 19.2.4**: Server Actions DoS 취약점 수정

### 마이너/패치 업데이트
- @tiptap/* (9개): 3.19.0 → 3.20.4
- @tanstack/react-query: 5.90.x → 5.91.x
- framer-motion: 12.34.x → 12.38.x
- jose: 6.1.x → 6.2.x
- lucide-react: 0.563.x → 0.577.x
- @types/node: ^20 → ^24 (Node.js 24 LTS 매칭)

### 메이저 업그레이드

**recharts 2.x → 3.x**
- CartesianGrid에 xAxisId, yAxisId 명시적 추가 필수
- TooltipProps → TooltipContentProps 타입 변경
- activeIndex prop 제거

**Storybook 8.x → 10.x**
- addon-essentials, addon-interactions → core 통합 (삭제됨)
- import 경로: `@storybook/testing-library` → `@storybook/test`

**ESLint 9 → 10**
- flat config 형식 호환, 신규 기본 규칙 적용 완료

---

## 보류된 업그레이드

| 패키지 | 보류 버전 | 사유 | 재검토 시점 |
|--------|----------|------|-----------|
| jsdom | 28 → 29 | Vitest 4.x 호환성 문제 (#9279) | Vitest 4.2+ 릴리즈 시 |

---

## Breaking Changes 요약

| 영역 | 변경 내용 |
|------|----------|
| 차트 컴포넌트 | recharts 3.x 축 ID 명시화, Tooltip 타입 변경 |
| Storybook | 통합 addon 제거, 테스트 import 경로 변경 |
| ESLint | 신규 규칙 적용, 기존 위반사항 수정 |
| TypeScript | e2e 테스트 SVGElement 타입 캐스팅 추가 |

---

## 다음 업그레이드 시 주의사항

- **jsdom 29 보류 유지**: Vitest 4.2+ 릴리즈 전까지 jsdom 28 고정. 업그레이드 시 `npm run test` 전체 통과 확인 필수
- **recharts 3.x 차트 추가 시**: 반드시 xAxisId/yAxisId 명시 (누락 시 런타임 오류)
- **Storybook addon 추가 시**: 10.x core 통합 여부 먼저 확인 (중복 설치 방지)

---

## 검증 명령어

```bash
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
npm run type-check   # TypeScript 타입 체크
npm run storybook    # Storybook 실행 (localhost:6006)
```
