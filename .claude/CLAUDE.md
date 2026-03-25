# insite-web

> Next.js 15 빌딩 관리 시스템 | csp-was REST API 백엔드 | Phase 9+A-B 완료 (~75%)

## 명령어

```
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드 (커밋 전 필수)
npm run lint         # ESLint
npm run test         # Vitest 단위/통합 테스트
npm run test:run     # CI용 1회 실행
npm run storybook    # Storybook (localhost:6006)
```

## 절대 금지

- `any` 타입
- `!important`
- 인라인 스타일 (`style={{}}`)
- localStorage 토큰 저장
- refresh token 구현
- 직접 `fetch()` (apiClient 사용)
- `window.alert/confirm` (toast/AlertDialog 사용)

## 언어 규칙

문서/주석/커밋/UI → **한국어** | 변수/함수명 → **영어 camelCase**
커밋: `<type>: <한국어 설명>` (feat/fix/refactor/docs/test/chore/perf/ci)

## 인증 (변경 금지)

단일 JWT (`authToken`), refresh token 없음, 1시간 만료
- 클라이언트: `apiClient` → Authorization 자동 주입
- API Route: `request.cookies.get("auth-token")?.value`로 직접 추출
- buildingId: `apiClient`가 자동 주입 (수동 추가 금지)

## 새 모듈 구현 시

기존 모듈 참조: `src/lib/{types,api,hooks}/facility.ts` + `src/app/(modules)/facilities/`

1. **타입**: `lib/types/{module}.ts` — Enum + DTO + VO + SearchVO
2. **API**: `lib/api/{module}.ts` — apiClient.get/post/put/delete (URL은 csp-was 컨트롤러 확인)
3. **훅**: `lib/hooks/use-{module}.ts` — Keys factory + useQuery(staleTime 필수) + useMutation
4. **페이지**: `app/(modules)/{module}/` — page.tsx + [id]/page.tsx + new/page.tsx + [id]/edit/page.tsx
5. **Stories**: 새 컴포넌트는 `.stories.tsx` 필수 생성. **기존 컴포넌트 사용 전 Stories 파일 먼저 읽기.**

## 커밋 전 검증

`/pre-commit` 실행 필수. 개별: `/check-api` `/check-hooks` `/check-components` `/check-security`

## 참조

- 진행 현황: @docs/task-progress.md
- 다음 단계: @docs/task-next.md
- API 스펙: @docs/reference/api-backend-spec.md
- v1 마이그레이션: @docs/reference/v1-migration-reference.md
- 차단 이슈: @docs/reference/csp-was-pageinfoid-issue.md
