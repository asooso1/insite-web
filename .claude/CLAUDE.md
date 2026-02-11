# insite-web 개발 규칙

## 프로젝트 개요

Spring Boot + Thymeleaf + Vue.js 기반 csp-web(BFF)을 Next.js 15로 마이그레이션하는 프로젝트입니다.
csp-was(REST API 백엔드)는 그대로 유지하며, csp-was 변경은 CORS 설정 1줄만 허용합니다.

---

## 🤖 자동화 워크플로우

### 빠른 시작

```
/next-task     → 다음 미완료 태스크 찾기
/implement     → 구현 가이드 및 체크리스트
/commit        → 테스트 + 커밋 자동화
/update        → 진행 상황 업데이트
```

### 컨텍스트 로딩

세션 시작 시 자동으로 로드할 파일:
1. `.claude/state/current.md` - 현재 상태 (필수)
2. `.claude/context/overview.md` - 전체 개요 (필수)
3. `.claude/context/phase-2a.md` - 현재 Phase 상세 (필요시)

### 태스크 자동화 사이클

```
1. /next-task → 다음 태스크 확인
2. 구현 작업 수행
3. npm run build && npm run test
4. /commit → 커밋 생성
5. /update → 진행 상황 업데이트
6. 반복
```

---

## 🚨 필수 준수 규칙 (CRITICAL)

### 1. 언어 규칙
- **모든 문서, 주석, 커밋 메시지는 반드시 한국어로 작성**
- 코드 내 변수명, 함수명은 영어 사용 (camelCase)
- 에러 메시지, 사용자 facing 텍스트는 한국어

### 2. 용어 일관성 (절대 변경 금지)

| 영문 | 한글 | 설명 |
|------|------|------|
| Work Order | 작업 | 시설 관리 작업 |
| Facility | 시설 | 관리 대상 시설물 |
| Building | 빌딩 | 건물 |
| Dashboard | 대시보드 | 대시보드 |
| Widget | 위젯 | 대시보드 위젯 |
| Sensor | 센서 | IoT 센서 |
| BEMS | BEMS | 빌딩 에너지 관리 시스템 |
| BECM | BECM | 빌딩 에너지 인증 관리 |
| FMS | FMS | 시설 관리 시스템 |
| RMS | RMS | 자원 관리 시스템 |
| BIM | BIM | 빌딩 정보 모델링 |
| Fieldwork | 현장작업 | 현장 관리 |
| SSE | SSE | Server-Sent Events |

### 3. 커밋 규칙
- **모든 작업 단위 완료 시 반드시 커밋 생성**
- 커밋 메시지 형식: `<type>: <한글 설명>`
- type: feat, fix, docs, style, refactor, test, chore
- 예시: `feat: 로그인 페이지 구현`, `fix: 토큰 갱신 로직 수정`

---

## 📋 코드 작성 규칙

### TypeScript
- strict mode 필수
- any 타입 사용 금지 (unknown 사용)
- 모든 함수에 반환 타입 명시
- interface 선호 (type alias는 union/intersection에만)

### React/Next.js
- 함수형 컴포넌트만 사용
- Server Components 우선 (클라이언트 상태 필요시에만 'use client')
- App Router 사용 (Pages Router 사용 금지)
- 컴포넌트 파일명: kebab-case (예: `work-order-form.tsx`)

### 스타일링
- Tailwind CSS + shadcn/ui 사용
- 커스텀 색상은 CSS 변수(디자인 토큰)만 사용
- `!important` 사용 금지
- 인라인 스타일 사용 금지

### 상태 관리
- 서버 상태: TanStack Query (React Query)
- 클라이언트 상태: Zustand
- URL 상태: nuqs
- 폼 상태: react-hook-form + zod

### API
- Hey API로 타입 자동 생성
- React Query 훅으로 데이터 fetching
- 에러 처리는 handleApiError 함수 사용

### API 연결 규칙
- **반드시 기존 csp-web, csp-was 코드를 확인 후 API 연결 구현**
- csp-web의 axiosApiGet/Post/Put/Delete 호출 패턴 참조
- csp-was 컨트롤러의 엔드포인트, 요청/응답 구조 확인
- 백엔드 변경이 필요한 경우 `docs/backend-changes.md`에 기록

---

## 📁 디렉토리 구조

```
insite-web/
├── .claude/
│   ├── CLAUDE.md              # 이 파일 (개발 규칙)
│   ├── context/               # Phase별 컨텍스트
│   │   ├── overview.md        # 전체 개요
│   │   ├── phase-2a.md        # 현재 Phase 상세
│   │   ├── phase-2b.md
│   │   └── phase-3-8.md
│   ├── skills/                # 자동화 스킬
│   │   ├── next-task.md
│   │   ├── implement.md
│   │   ├── test-and-commit.md
│   │   └── update-progress.md
│   └── state/
│       └── current.md         # 현재 상태 스냅샷
├── app/                       # Next.js App Router
│   ├── (auth)/               # 인증 관련 페이지
│   ├── (dashboard)/          # 대시보드 페이지
│   ├── (modules)/            # 기능 모듈 페이지
│   ├── api/                  # API Routes
│   └── m/                    # 모바일 전용
├── components/
│   ├── ui/                   # shadcn/ui 컴포넌트
│   ├── layout/               # 레이아웃 컴포넌트
│   ├── forms/                # 폼 컴포넌트
│   ├── data-display/         # 데이터 표시 컴포넌트
│   ├── charts/               # 차트 컴포넌트
│   └── widgets/              # 대시보드 위젯
├── lib/
│   ├── api/                  # API 클라이언트
│   ├── auth/                 # 인증 유틸리티
│   ├── hooks/                # 커스텀 훅
│   ├── stores/               # Zustand 스토어
│   ├── services/             # 비즈니스 로직 (Prisma)
│   ├── utils/                # 유틸리티 함수
│   └── validations/          # Zod 스키마
├── prisma/                   # Prisma 스키마
├── docs/                     # 문서
│   └── task-progress.md      # 작업 진행 현황
└── tests/                    # 테스트
```

---

## 🔒 보안 규칙

- JWT access token: Zustand 메모리에만 저장 (localStorage 금지)
- JWT refresh token: httpOnly 쿠키로만 관리
- 사용자 입력 HTML: DOMPurify로 sanitize
- API 호출: Authorization Bearer 헤더 사용

---

## 🎨 디자인 시스템

### 테마
- Light + Dark 2가지 테마만 지원
- next-themes 사용
- CSS 변수 기반 토큰 시스템

### 폰트
- 본문: Pretendard Variable
- 숫자/KPI: Rajdhani (`font-display` 클래스)

### 컴포넌트
- shadcn/ui 기반
- CVA(class-variance-authority)로 variant 관리
- lucide-react 아이콘 사용

### 차트
- Recharts 사용 (ApexCharts 금지)
- CSS 변수 기반 컬러

---

## 🧪 테스트 규칙

- Unit: Vitest
- Integration: React Testing Library
- E2E: Playwright
- 커버리지 목표: 80%

---

## ⚠️ 금지 사항

1. csp-web 코드 직접 수정 금지 (참조만)
2. csp-was 변경 금지 (CORS 1줄 제외)
3. any 타입 사용 금지
4. !important 사용 금지
5. 인라인 스타일 사용 금지
6. localStorage에 토큰 저장 금지
7. 영문 문서/주석 작성 금지
8. 용어 임의 변경 금지

---

## 📚 참조 문서

### 내부 문서
- 현재 상태: `.claude/state/current.md`
- 전체 개요: `.claude/context/overview.md`
- Phase 상세: `.claude/context/phase-*.md`
- 작업 진행: `docs/task-progress.md`

### 외부 참조
- 마이그레이션 계획: `/Volumes/jinseok-SSD-1tb/00_insite/migration-plan.md`
- 기존 csp-web: `/Volumes/jinseok-SSD-1tb/00_insite/csp-web/`
- 기존 csp-was: `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/`


<claude-mem-context>
# Recent Activity

<!-- This section is auto-generated by claude-mem. Edit content outside the tags. -->

*No recent activity*
</claude-mem-context>
