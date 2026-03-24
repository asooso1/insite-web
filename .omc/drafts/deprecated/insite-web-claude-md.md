# insite-web 개발 가이드

> Spring Boot + Vue.js -> Next.js 15 마이그레이션 | csp-was 변경은 CORS 1줄만 허용

## 현재 상태

Phase 1-6 완료 (~75%) | Phase 7 (모바일/최종 조정) 대기
- 구현 완료: work-orders, facilities, users, clients, materials, boards, settings, licenses, patrols, reports
- 진행 현황: `docs/task-progress.md` 참조

## 필수 규칙

**언어:** 문서/주석/커밋/UI텍스트 한국어 | 변수명/함수명 영어 camelCase

**용어 (변경 금지)**

| 영문 | 한글 |
|------|------|
| Work Order | 작업 |
| Facility | 시설 |
| Building | 빌딩 |
| Dashboard | 대시보드 |
| Widget | 위젯 |

**코드 금지:** `any` 타입 / `!important` / 인라인 스타일 / localStorage 토큰 저장

**커밋:** `<type>: <한글 설명>` (예: `feat: 사용자 목록 페이지 구현`)

## 구현 패턴

새 모듈 구현 시 기존 모듈 참조: `src/lib/{types,api,hooks}/facility.ts`, `src/app/(modules)/facilities/`

### 1. 타입 (`lib/types/{module}.ts`)
```
Enum: const assertion + Label Record 매핑
DTO: 백엔드 응답 인터페이스 (id, 필드들)
VO: 생성/수정 요청 (required만 필수)
SearchVO: 검색 파라미터 (keyword?, page?, size?)
```

### 2. API (`lib/api/{module}.ts`)
```
{module}Api = { list, view, add, edit, delete }
- list: GET /api/{path}/List (params: SearchVO) -> PageResponse<DTO>
- view: GET /api/{path}/View (params: {id}) -> DTO
- add: POST /api/{path}/Add (data: VO)
- edit: PUT /api/{path}/Edit (data: VO & {id})
- delete: DELETE /api/{path}/Edit (params: {id})
```

### 3. 훅 (`lib/hooks/use-{module}.ts`)
```
Keys Factory: all > lists > list(params) > details > detail(id)
useQuery: queryKey + queryFn 조합
useMutation: mutationFn + onSuccess invalidateQueries
```

### 4. 페이지 (`app/(modules)/{module}/`)
```
page.tsx              # 목록 (DataTable + 필터 + 페이지네이션)
[id]/page.tsx         # 상세 (InfoPanel + 탭)
[id]/edit/page.tsx    # 수정 (폼)
new/page.tsx          # 등록 (폼)
_components/          # {module}-form.tsx, {module}-columns.tsx
```

## 명령어

`npm run dev` | `npm run build` (커밋 전 필수) | `npm run lint`

## 참조 경로

**백엔드 (csp-was):**
- 컨트롤러: `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/controller/`
- 엔티티/VO: `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/model/`

**기존 프론트엔드 (csp-web):**
- 템플릿: `/Volumes/jinseok-SSD-1tb/00_insite/csp-web/src/main/resources/templates/`
