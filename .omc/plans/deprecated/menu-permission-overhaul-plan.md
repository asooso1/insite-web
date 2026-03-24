# 메뉴 & 권한 시스템 개편 계획

> 작성일: 2026-03-12
> 목표: csp-was/DB 최소 변경, insite-web 백오피스 DB 직접 연결 활용

---

## 1. 현황 분석

### DB 메뉴 구조
```
menu (계층형 트리)
├── depth=1 (12개 섹션, service_id로 서비스 연결)
│   바로가기, 공통, 근태, 임대, 고객, 업무, 시설, 경보, 에너지, 보안순찰, 방문점검, 관리자
├── depth=2 (섹션별 그룹, 1~7개)
└── depth=3+ (실제 페이지 링크, url 포함)

page_info (메뉴 → 페이지 매핑, page_id=PC코드)
page_function (페이지별 기능권한, api_url + method)
role (12개 활성 역할)
role_menu (역할-메뉴 매핑, has_right boolean)
role_page_default_function (역할별 기능권한, is_checked boolean)
product_menu (제품-메뉴 매핑, 건물 구독 서비스 필터링)
```

### 역할 계층 (권한 순)
| 역할코드 | 이름 | 메뉴 수 |
|---------|------|--------|
| ROLE_SYSTEM_ADMIN | 시스템 관리자 | 223 |
| ROLE_LABS_SYSTEM_ADMIN | 본사 관리자 | 188 |
| ROLE_CLIENT_VIEWER | 외부 조회자 | 164 |
| ROLE_LABS_SITE_FMS_CHARGER | 현장 관리자 | 128 |
| ROLE_LABS_SITE_ADMIN | 현장 소장 | 128 |
| ROLE_CLIENT_ADMIN | 고객사 관리자 | 119 |
| ROLE_CLIENT_OWNER | 건물주 | 103 |
| ROLE_LABS_SITE_SECURITY_MEMBER | 보안 팀원 | 65 |
| ROLE_LABS_SITE_FMS_MEMBER | 시설 팀원 | 60 |
| ROLE_LABS_SITE_CLEAN_MEMBER | 미화 팀원 | 40 |
| ROLE_CLIENT_MEMBER | 입주사 | 17 |
| ROLE_DAILY_ACCOUNT | 일용직 | 3 |

### csp-was 핵심 API (변경 없이 활용)
```
GET  /api/services/menus?buildingId=X     → 메뉴 트리 (역할+건물 필터링, Redis 캐시 1일)
GET  /api/user/allMenuAuths/{roleId}      → 전체 메뉴+기능권한
GET  /api/user/roleMenuAuths/{roleId}     → 역할별 메뉴+기능권한
PUT  /api/user/roleAuthEdit               → 역할 권한 설정
GET  /open/user/roleList/v2               → 역할 목록
GET  /api/common/menuList?keyword=X       → 메뉴 검색
```

### 현재 insite-web 문제점
1. **URL 매핑 정적 파일 의존**: `public/menu-overrides.json` → 변경 시 코드 배포 필요
2. **권한 체크 미구현**: middleware에서 role 기반 라우트 보호 없음
3. **백오피스 UI 불충분**: 메뉴 관리 페이지에서 역할별 권한 뷰/수정 불가
4. **메뉴 URL 매핑 불완전**: `menu-url-mapper.ts`가 코드에 하드코딩

---

## 2. 개편 방향

### 핵심 원칙
- **csp-was API 변경 금지** (CORS 1줄 제외)
- **기존 DB 테이블 변경 금지** (새 테이블 추가는 허용)
- **insite-web → csp DB 직접 읽기** (백오피스 전용, 쓰기는 신규 테이블만)

### 3-Layer 아키텍처
```
┌─────────────────────────────────────────────┐
│           Layer 1: 메뉴 데이터 소스            │
│  csp-was API (/api/services/menus)          │
│  → 역할+건물 필터링된 메뉴 트리 반환           │
│  → Redis 캐시 1일 (csp-was 내부)             │
└─────────────────┬───────────────────────────┘
                  │ 메뉴 트리 (csp URL 포함)
┌─────────────────▼───────────────────────────┐
│           Layer 2: URL 변환 계층              │
│  DB: insite_menu_url_mapping 테이블          │
│  (menu_id → insite_url 동적 매핑)            │
│  Next.js API Route에서 병합                  │
└─────────────────┬───────────────────────────┘
                  │ insite URL로 변환된 메뉴 트리
┌─────────────────▼───────────────────────────┐
│           Layer 3: 권한 보호 계층             │
│  JWT claims.userRoles → 라우트 접근 제어      │
│  DB: role_menu (읽기 전용)                   │
│  Next.js middleware에서 서버사이드 검증        │
└─────────────────────────────────────────────┘
```

---

## 3. 구현 계획

### Phase 1: DB 연결 인프라 (필수)
**목표**: insite-web에서 csp DB 직접 연결

```typescript
// 추가할 패키지
npm install pg @types/pg

// 환경변수 추가 (.env.local)
CSP_DB_HOST=localhost
CSP_DB_PORT=5433
CSP_DB_NAME=csp
CSP_DB_USER=eucast
CSP_DB_PASSWORD=Eucast123!@#
```

**신규 파일**:
- `src/lib/db/csp-db.ts` — pg Pool 싱글톤, 쿼리 유틸

**제약사항**:
- Server Component / API Route에서만 사용 (Client Component 직접 호출 금지)
- 읽기 전용 쿼리만 (INSERT/UPDATE/DELETE는 신규 테이블만 허용)

---

### Phase 2: 메뉴 URL 매핑 DB화
**목표**: `menu-overrides.json` 정적 파일 → DB 동적 관리

**신규 테이블** (csp DB에 추가):
```sql
CREATE TABLE insite_menu_url_mapping (
  id          BIGSERIAL PRIMARY KEY,
  menu_id     BIGINT NOT NULL UNIQUE,   -- menu.id 참조 (FK 없음, csp 테이블 변경 금지)
  insite_url  VARCHAR(500),             -- insite-web 라우트 경로 (null이면 미구현)
  is_active   BOOLEAN DEFAULT true,     -- 비활성화 시 사이드바에서 숨김
  note        VARCHAR(255),             -- 관리용 메모
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

**현재 menu-overrides.json 데이터 이관**:
- 기존 37개 매핑 항목 → DB INSERT

**수정할 파일**:
- `src/lib/db/menu-mapping.ts` — DB 조회 함수
- `src/app/api/services/menus/route.ts` — csp-was API + DB 매핑 병합
- `src/lib/utils/menu-url-mapper.ts` — DB 기반으로 교체 (정적 매핑 제거)

**삭제할 파일**:
- `public/menu-overrides.json` — DB로 이관 후 삭제

---

### Phase 3: 역할 기반 라우트 보호
**목표**: Next.js middleware에서 서버사이드 권한 체크

**접근 방식**:
- JWT claims의 `userRoles` 배열 활용 (이미 토큰에 포함)
- `role_menu` 테이블에서 역할별 허용 메뉴 조회 (읽기 전용)
- page_info의 url과 insite_url 매핑으로 접근 가능 여부 판단

**라우트 보호 규칙**:
```typescript
// src/middleware.ts 개선
const ROUTE_ROLE_MAP: Record<string, string[]> = {
  '/work-orders': ['ROLE_SYSTEM_ADMIN', 'ROLE_LABS_SYSTEM_ADMIN', 'ROLE_LABS_SITE_ADMIN',
                   'ROLE_LABS_SITE_FMS_CHARGER', 'ROLE_LABS_SITE_FMS_MEMBER'],
  '/facilities':  ['ROLE_SYSTEM_ADMIN', 'ROLE_LABS_SYSTEM_ADMIN', 'ROLE_LABS_SITE_ADMIN',
                   'ROLE_LABS_SITE_FMS_CHARGER', 'ROLE_LABS_SITE_FMS_MEMBER'],
  '/settings':    ['ROLE_SYSTEM_ADMIN', 'ROLE_LABS_SYSTEM_ADMIN'],
  // ...
};
```

**수정할 파일**:
- `src/middleware.ts` — 역할 기반 라우트 보호 추가
- `src/lib/auth/route-permissions.ts` (신규) — 라우트-역할 매핑 (DB 기반으로 점진적 전환 가능)

---

### Phase 4: 백오피스 Admin UI 개선
**목표**: settings/menu-management 기능 확장

**기능 추가**:

#### 4-1. 메뉴 URL 매핑 관리 (기존 + 강화)
- DB에서 `menu` + `insite_menu_url_mapping` JOIN 조회
- 미매핑 메뉴 목록 표시 (insite_url NULL)
- 인라인 편집으로 insite_url 설정
- is_active 토글 (사이드바 표시/숨김)

#### 4-2. 역할별 메뉴 권한 뷰어 (신규)
- `role` 목록 → 선택 → 해당 역할의 `role_menu` 조회
- 메뉴 트리 형태로 has_right 표시 (읽기 전용)
- csp-was `/api/user/roleAuthEdit` API로 권한 수정 가능 (선택적)

#### 4-3. 미구현 메뉴 현황판 (신규)
- `menu` 전체 vs `insite_menu_url_mapping` 비교
- 구현률 대시보드 (섹션별 %)

**수정할 파일**:
- `src/app/(modules)/settings/menu-management/page.tsx` — 탭 추가
- `src/app/api/settings/menu-mapping/route.ts` — 기존 + DB 읽기
- `src/app/api/settings/role-menus/route.ts` (신규) — 역할별 메뉴 권한 조회

---

## 4. 파일 구조 변화

```
신규 파일:
src/lib/db/
├── csp-db.ts                          # pg Pool 싱글톤
├── menu-mapping.ts                    # insite_menu_url_mapping CRUD
└── role-menu.ts                       # role_menu, role 읽기 전용 쿼리

src/lib/auth/
└── route-permissions.ts               # 라우트-역할 매핑

src/app/api/settings/
└── role-menus/route.ts                # 역할별 메뉴 권한 API

수정 파일:
src/middleware.ts                      # 역할 기반 라우트 보호
src/lib/utils/menu-url-mapper.ts       # DB 기반으로 교체
src/app/api/services/menus/route.ts    # DB 매핑 병합
src/app/(modules)/settings/menu-management/page.tsx  # 탭 추가

삭제 파일:
public/menu-overrides.json             # DB 이관 후 삭제
```

---

## 5. 구현 우선순위

| 우선순위 | Phase | 작업 | 효과 |
|---------|-------|------|------|
| 🔴 P1 | Phase 1 | DB 연결 인프라 | 이후 모든 Phase의 기반 |
| 🔴 P1 | Phase 2 | URL 매핑 DB화 | 코드 배포 없이 메뉴 관리 |
| 🟡 P2 | Phase 3 | 역할 기반 라우트 보호 | 보안 강화 |
| 🟢 P3 | Phase 4-1 | 매핑 관리 UI 개선 | 운영 편의성 |
| 🟢 P3 | Phase 4-2 | 역할별 권한 뷰어 | 권한 현황 파악 |
| ⚪ P4 | Phase 4-3 | 미구현 현황판 | 진행 상황 추적 |

---

## 6. 제약사항 및 리스크

| 항목 | 내용 |
|-----|------|
| csp DB 직접 연결 | 개발 서버 전용 (운영 서버 연결 시 보안 검토 필요) |
| role_menu 권한 변경 | csp-was API (`/api/user/roleAuthEdit`) 통해서만 수행 (DB 직접 쓰기 금지) |
| Redis 캐시 | csp-was의 메뉴 캐시(1일)로 인해 권한 변경 후 최대 1일 지연 가능 |
| 신규 테이블 스키마 | flyway migration 대신 수동 DDL (csp-was 배포 없이 적용) |

---

## 7. 승인 후 프로젝트 룰 추가 항목

승인 시 `.claude/rules/` 에 추가할 내용:
1. **DB 연결 규칙**: csp DB는 Server Component/API Route에서만, 읽기 전용 원칙
2. **메뉴 URL 등록 절차**: 신규 페이지 구현 시 `insite_menu_url_mapping` 테이블에도 등록
3. **권한 매핑 규칙**: 새 라우트 추가 시 `route-permissions.ts`에 역할 목록 추가
