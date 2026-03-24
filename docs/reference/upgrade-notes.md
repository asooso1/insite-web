# 패키지 업그레이드 노트

## 적용된 업그레이드 (2026-03-19)

### 보안 패치 (즉시 적용)
- **Next.js 16.1.6 → 16.2.0**: CVE 5건 수정 (CSRF bypass, DoS, HTTP smuggling)
- **React 19.2.3 → 19.2.4**: Server Actions DoS 취약점 수정

### 안전한 마이너 업데이트
- @tiptap/* (9개 패키지): 3.19.0 → 3.20.4
- @tanstack/react-query: 5.90.x → 5.91.x
- framer-motion: 12.34.x → 12.38.x
- jose: 6.1.x → 6.2.x
- lucide-react: 0.563.x → 0.577.x
- @types/node: ^20 → ^24 (Node.js 24 LTS 매칭)
- 기타 다수 패치 업데이트

### 주요 메이저 업그레이드

#### recharts 2.x → 3.x
- CartesianGrid에 xAxisId, yAxisId 명시적 추가
- TooltipProps → TooltipContentProps 타입 변경
- activeIndex prop 제거
- 모든 차트 컴포넌트에서 축 ID 명시적 설정 필수

#### Storybook 8.x → 10.x
- @storybook/addon-essentials, @storybook/addon-interactions가 core에 통합됨 → 삭제
- import 경로: @storybook/testing-library → @storybook/test
- 모든 Stories 파일 업데이트됨

#### ESLint 9 → 10
- flat config 형식은 기존과 동일 (이미 호환)
- 신규 기본 규칙 적용 및 코드 수정
- 린트 오류 0건으로 정리

## 보류된 업그레이드

### jsdom 28 → 29 (보류)
- 이유: Vitest 4.x와 jsdom 27+ 간 호환성 문제 (GitHub issue #9279)
- 현재: jsdom 28 유지 (안정적)
- 재검토: Vitest 4.2+ 릴리즈 시

## 테스트 방법

```bash
cd /Volumes/jinseok-SSD-1tb/00_insite/insite-web-pkg-update

# 개발 서버 시작
npm run dev
# → http://localhost:3000

# Storybook 시작
npm run storybook
# → http://localhost:6006

# 타입 체크
npm run type-check

# 린트
npm run lint

# 빌드 (배포 전 확인)
npm run build
```

## 주요 변경 사항 요약

| 항목 | 변경 내용 |
|------|---------|
| TypeScript 타입 | e2e 테스트에서 SVGElement 타입 캐스팅 추가 |
| 차트 컴포넌트 | recharts 3.x API에 맞게 축 ID 명시화 |
| Storybook | 통합된 addon 제거, 신규 테스트 라이브러리 import 경로 적용 |
| ESLint | 신규 규칙 적용, 기존 위반사항 수정 |

## 브랜치 정보
- 브랜치: update/package-upgrades
- 기준 커밋: main 브랜치 최신
- 워크트리: /Volumes/jinseok-SSD-1tb/00_insite/insite-web-pkg-update

## 검증 결과

✅ TypeScript 타입 체크: 성공 (오류 0건)
✅ ESLint 린트: 성공 (오류 0건)
✅ 프로덕션 빌드: 성공
✅ 모든 라우트 정상 렌더링
