# 메뉴 & 권한 시스템 개편 계획 v3 (최종)

> 작성일: 2026-03-12
> 아키텍트 리뷰 반영 (v2 → v3)
> 핵심 원칙: URL 매핑 / 권한 시행 / 캐시 전략을 독립적으로 설계

---

## v2 → v3 변경 사유 (아키텍트 지적 사항)

| 문제 | v2 | v3 해결 |
|-----|-----|--------|
| URL 매핑과 권한 로직 혼재 | `menu.insite_url` 컬럼 추가 | 별도 `menu_insite_mapping` 테이블로 분리 |
| 권한 분기 (split-brain) | middleware에서 JWT claims로 역할 체크 | csp-was 필터링이 1차 권위, JWT는 보조 UX용 |
| 캐시 무효화 누락 | Admin 편집 → 캐시 무효화 API 호출 | 무효화 범위 명확히 정의 |
| 마이그레이션 안전장치 없음 | 즉시 NULL 허용 | 단계적 백필 전략 포함 |

---

## 1. 아키텍처 원칙

### 세 개의 독립된 관심사

```
┌─────────────────────────────────────────────────────────┐
│  관심사 1: 권한 시행 (Permission Enforcement)             │
│  소유자: csp-was + DB (role_menu 테이블)                  │
│  흐름: csp-was가 역할+건물 필터링 후 접근 가능 메뉴만 반환  │
│  → insite-web은 이 응답을 신뢰 (재필터링 금지)             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  관심사 2: URL 매핑 (URL Routing)                         │
│  소유자: DB (menu_insite_mapping 테이블)                   │
│  흐름: menu_id → insite_url 1:1 매핑                     │
│  → csp-web 레거시 URL과 insite-web 라우트를 분리           │
│  → csp-web 완전 전환 후 이 테이블 삭제 예정                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  관심사 3: 프론트엔드 UX 가드 (Fast Access Guard)          │
│  소유자: insite-web middleware (JWT claims 기반)           │
│  흐름: JWT userRoles로 빠른 라우트 가드 (DB 조회 없음)      │
│  → 권위: csp-was API (1차), JWT claims (보조/UX)          │
└─────────────────────────────────────────────────────────┘
```

---

## 2. DB 변경

### 신규 테이블: `menu_insite_mapping`

```sql
-- Flyway V{N}__create_menu_insite_mapping.sql

CREATE TABLE menu_insite_mapping (
  id          BIGSERIAL PRIMARY KEY,
  menu_id     BIGINT NOT NULL UNIQUE,          -- menu.id 참조 (데이터 정합성 위해 FK)
  insite_url  VARCHAR(500) NOT NULL,           -- insite-web 라우트 경로
  is_active   BOOLEAN DEFAULT true NOT NULL,  -- false이면 사이드바에서 비활성 표시
  note        VARCHAR(255),                   -- 관리 메모 (예: "시설 목록 - Phase 6 완료")
  created_at  TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT fk_menu_insite_mapping_menu
    FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE CASCADE
);

CREATE INDEX idx_menu_insite_mapping_menu_id ON menu_insite_mapping(menu_id);
COMMENT ON TABLE menu_insite_mapping IS 'insite-web URL 매핑 - csp-web 레거시 URL → insite-web 라우트';
COMMENT ON COLUMN menu_insite_mapping.insite_url IS 'insite-web Next.js 라우트 경로 (예: /facilities)';

-- 초기 데이터 삽입 전 반드시 아래 검증 쿼리 실행 후 결과 확인
-- (완전한 시딩 데이터는 csp-was DB 직접 조회로 생성 — menu-overrides.json은 부분 참조용)

-- ① 사전 검증: NULL menu_id 개수 (0이어야 함)
-- SELECT COUNT(*) FROM page_info WHERE menu_id IS NULL AND is_use = true;

-- ② 사전 검증: menu_id 중복 매핑 여부
-- SELECT menu_id, COUNT(*) FROM page_info WHERE is_use = true
-- GROUP BY menu_id HAVING COUNT(*) > 1;

-- ③ 사전 검증: 삽입 후 미매핑 메뉴 수 (0이어야 함)
-- SELECT COUNT(*) FROM menu m LEFT JOIN menu_insite_mapping mim ON m.id = mim.menu_id
-- WHERE m.is_use = true AND m.depth >= 2 AND mim.id IS NULL;

-- 초기 데이터 삽입 (menu_id NULL 제외, 중복 시 url 길이 기준 우선순위)
INSERT INTO menu_insite_mapping (menu_id, insite_url, note)
SELECT DISTINCT ON (pi.menu_id) pi.menu_id, m_new.insite, '초기 시딩 - 직접 매핑'
FROM page_info pi
JOIN (VALUES
  ('/facility/facilityList',    '/facilities'),
  ('/workOrder/workOrderList',  '/work-orders'),
  ('/user/userList',            '/users'),
  -- ... (csp-was DB 메뉴 목록 기반 전체 항목 추가)
) AS m_new(csp_url, insite) ON pi.url = m_new.csp_url
WHERE pi.menu_id IS NOT NULL   -- NULL menu_id 제외
  AND pi.is_use = true
ORDER BY pi.menu_id, LENGTH(pi.url) DESC  -- 중복 시 url 길이 기준 선택
ON CONFLICT (menu_id) DO NOTHING;

-- 삽입 후 검증: 미매핑 메뉴 존재 시 경고 (Admin UI에서 수동 등록 필요)
-- SELECT m.id, m.name, m.depth FROM menu m
-- LEFT JOIN menu_insite_mapping mim ON m.id = mim.menu_id
-- WHERE m.is_use = true AND m.depth >= 2 AND mim.id IS NULL
-- ORDER BY m.depth, m.sort_no;
```

**기존 `menu` 테이블 변경 없음** — csp-web 완전 무영향.

---

## 3. csp-was 변경 (최소)

### 3-1. MenuDTO에 insite_url 포함 옵션 (선택적)

csp-was가 `menu_insite_mapping`을 JOIN해서 반환하는 방법:

```java
// MenuDTO.java에 필드 추가 (~2줄)
private String insiteUrl;  // null이면 미구현 또는 csp-web에서만 사용

// MenuService에서 JOIN 쿼리 (또는 별도 조회)
// Option A: csp-was가 JOIN해서 반환 → 캐시 활용 최적
// Option B: insite-web이 별도 API로 매핑 테이블 조회 → csp-was 변경 최소
```

**권장: Option B (insite-web 별도 조회)**
- csp-was 변경 **0줄**
- insite-web Next.js API Route에서 두 소스 병합:
  1. `GET /api/services/menus` (csp-was) → 권한 필터링된 메뉴 트리
  2. csp DB 직접 쿼리 `menu_insite_mapping` → URL 매핑 데이터
  3. 병합 후 클라이언트에 반환

```typescript
// src/app/api/services/menus/route.ts (수정)
export async function GET(request: Request) {
  const buildingId = ...;

  // 1. csp-was에서 권한 필터링된 메뉴 트리 조회 (기존)
  const menuTree = await fetchFromCspWas('/api/services/menus', { buildingId });

  // 2. DB에서 insite URL 매핑 조회 (신규)
  const mappings = await getInsiteMappings(); // csp DB 직접 쿼리 (캐시 적용)

  // 3. 메뉴 트리에 insiteUrl 주입
  return mergeInsiteUrls(menuTree, mappings);
}
```

### 3-2. 캐시 무효화 엔드포인트 (필요 시 추가)

Admin UI에서 메뉴 매핑 저장 후 호출:
```java
// AdminController.java (기존 파일에 추가, ~10줄)
@PostMapping("/api/admin/menus/cache/evict")
@PreAuthorize("hasRole('ROLE_SYSTEM_ADMIN') or hasRole('ROLE_LABS_SYSTEM_ADMIN')")
public ResponseEntity<?> evictMenuCache() {
    redisCacheService.invalidatePattern("menu_tree:*");
    redisCacheService.invalidatePattern("role_menu_page_auths:*");
    return ResponseEntity.ok(Map.of("message", "메뉴 캐시 삭제 완료"));
}
```

기존 `/api/admin/caches/evict` 가 있으면 그걸 활용.

---

## 4. insite-web 변경

### 4-1. DB 연결 인프라 (신규)
```typescript
// src/lib/db/csp-db.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.CSP_DB_HOST,
  port: Number(process.env.CSP_DB_PORT),
  database: process.env.CSP_DB_NAME,
  user: process.env.CSP_DB_USER,
  password: process.env.CSP_DB_PASSWORD,
  max: 5, // 백오피스 용도이므로 소규모 풀
});

export async function queryCspDb<T>(sql: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(sql, params);
  return result.rows;
}
```

### 4-2. URL 매핑 조회 함수 (신규)
```typescript
// src/lib/db/menu-mapping.ts
import { queryCspDb } from './csp-db';

export interface InsiteMenuMapping {
  menuId: number;
  insiteUrl: string;
  isActive: boolean;
}

// Next.js unstable_cache로 캐싱 (revalidation 지원)
export const getInsiteMappings = unstable_cache(
  async (): Promise<InsiteMenuMapping[]> => {
    return queryCspDb<InsiteMenuMapping>(`
      SELECT menu_id as "menuId", insite_url as "insiteUrl", is_active as "isActive"
      FROM menu_insite_mapping
      WHERE is_active = true
    `);
  },
  ['insite-menu-mappings'],
  { revalidate: 3600 } // 1시간 캐시 (csp-was Redis와 동기화)
);
```

### 4-3. menu-url-mapper.ts 단순화
```typescript
// 기존: 복잡한 정적 매핑 (100+ 줄) → 단순화 (~20줄)
export function resolveMenuUrl(menuId: number, mappings: InsiteMenuMapping[]): string | null {
  const mapping = mappings.find(m => m.menuId === menuId);
  return mapping?.insiteUrl ?? null;
}
```

### 4-4. middleware.ts 권한 가드 (보조 UX 역할)

**권한 계층 명시:**

| 계층 | 담당 | 목적 | 권위 |
|-----|------|------|-----|
| 1차 | csp-was `/api/services/menus` | 역할+건물 기반 메뉴 필터링 | **필수 (권위)** |
| 2차 | csp-was JWT Bearer 검증 | 모든 API 요청 인증 | **필수 (권위)** |
| 3차 | middleware JWT claims | 직접 URL 입력 시 빠른 리다이렉트 | 선택 (UX 보조) |

```typescript
// src/middleware.ts 추가
//
// [중요] 이 라우트 보호는 UX 목적의 보조 계층입니다.
// - 목적: 미인가 사용자의 직접 URL 입력 시 즉각적인 리다이렉트 (UX)
// - 권위: csp-was API가 최종 권위 (JWT Bearer 검증 + 역할별 메뉴 필터링)
// - middleware 우회 시에도 csp-was API 호출 실패로 데이터 접근 차단됨
// - 역할 변경 시 csp-was + 이 파일 BOTH 수정 필요 (sync 주의)
//
// 명시적 보호가 필요한 라우트만 등록
// (나머지는 csp-was 메뉴 필터링에 위임 — 사이드바에 없으면 접근 불가)
// 중요: csp-was role_menu 권한과 반드시 동기화 유지
const PROTECTED_ROUTES: Array<{ pattern: RegExp; requiredRoles: string[] }> = [
  {
    // 설정 전용 — 시스템/본사 관리자만
    pattern: /^\/settings/,
    requiredRoles: ['ROLE_SYSTEM_ADMIN', 'ROLE_LABS_SYSTEM_ADMIN'],
  },
  {
    // 사용자/역할 관리 — 관리자 이상
    pattern: /^\/users/,
    requiredRoles: ['ROLE_SYSTEM_ADMIN', 'ROLE_LABS_SYSTEM_ADMIN', 'ROLE_LABS_SITE_ADMIN'],
  },
  // work-orders, facilities, etc.은 csp-was 메뉴 필터링에 위임
  // (현장 관리자/팀원 등 다양한 역할이 접근하므로 API 레벨이 더 정확)
];
```

### 4-5. Admin UI 확장

**기존 `settings/menu-management` 탭 추가:**

```
탭 1: 메뉴 URL 매핑 (기존 + 강화)
├── csp DB에서 menu + menu_insite_mapping JOIN 조회
├── 미매핑 메뉴 목록 표시 (insite_url 없는 항목)
├── 인라인 편집 (insite_url 설정, is_active 토글)
└── 저장 후 csp-was 메뉴 캐시 무효화 + Next.js revalidate

탭 2: 역할별 메뉴 권한 뷰어 (신규, 읽기 전용)
├── role 목록 선택
├── role_menu 테이블 기반 권한 트리 표시
└── (옵션) csp-was /api/user/roleAuthEdit API로 수정

탭 3: 구현 현황 대시보드 (신규)
├── 섹션별 구현률 (insite_url 등록 비율)
└── 미구현 메뉴 목록
```

---

## 5. 캐시 무효화 전략 (단계별 실패 시나리오 포함)

### 무효화 순서 및 에러 처리

```typescript
// src/app/api/settings/menu-mapping/[menuId]/route.ts
export async function PUT(request: Request) {
  const { insiteUrl, isActive } = await request.json();

  // Step 1: csp DB UPDATE (필수 — 실패 시 전체 롤백)
  await updateInsiteMapping(menuId, insiteUrl, isActive);

  // Step 2: Next.js 캐시 무효화 (실패 시 경미 — 1시간 내 자동 만료)
  try {
    revalidateTag('insite-menu-mappings');
  } catch (e) {
    // revalidateTag 실패는 비치명적 — unstable_cache TTL(1시간) 후 자동 갱신
    console.warn('[메뉴 캐시] Next.js 캐시 무효화 실패 (자동 만료 대기):', e);
  }

  // Step 3: csp-was Redis 캐시 무효화 (선택적 — 실패 허용)
  // 실패 시 최대 1일 지연 발생하지만, DB 값은 이미 수정됨
  // 다음 csp-was 캐시 만료 후 자동으로 새 데이터 반영
  try {
    await fetch(`${process.env.CSP_WAS_URL}/api/admin/menus/cache/evict`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e) {
    // 캐시 무효화 실패: 최대 1일 지연, 비치명적 (사용자에게 경고)
    console.warn('[메뉴 캐시] csp-was 무효화 실패 — 최대 1일 후 자동 반영:', e);
  }

  return NextResponse.json({ success: true });
}
```

| 단계 | 실패 시 결과 | 심각도 |
|-----|-----------|--------|
| Step 1 (DB UPDATE) | 저장 실패, 500 에러 반환 | 🔴 치명적 |
| Step 2 (Next.js revalidate) | insite-web 캐시 지속 (최대 1시간) | 🟡 경미 |
| Step 3 (csp-was Redis) | 메뉴 트리 캐시 지속 (최대 1일) | 🟡 경미 |

---

## 6. 전체 데이터 흐름 (v3 최종)

```
사이드바 로드 시:
    클라이언트 → GET /api/services/menus (Next.js API Route)
        → csp-was /api/services/menus (역할+건물 필터링, Redis 캐시 1일)
        → csp DB menu_insite_mapping 조회 (Next.js 캐시 1시간)
        → 병합: menuTree.insiteUrl 주입
    클라이언트 ← { id, name, insiteUrl, ... } 트리 반환

권한 체크:
    1차 (UX): middleware JWT claims → settings 등 명시적 보호 라우트만 빠른 가드
    2차 (권위): csp-was API → 역할에 없는 메뉴는 아예 응답에 포함 안 됨
    3차 (API): csp-was API 요청마다 JWT Bearer 검증 → 실제 데이터 접근 차단
```

---

## 6-1. 전환기 운영 전략 (csp-web & insite-web 동시 운영, ~25% 남음)

### 배경
- insite-web Phase 1-6 완료 (~75%), Phase 7 대기
- csp-web은 아직 일부 모듈 운영 중 → 두 시스템이 동일한 `/api/services/menus` 사용
- `menu_insite_mapping`에 등록 안 된 메뉴 → insite-web 사이드바에 표시는 되지만 클릭 시 이동 불가

### 미매핑 메뉴 처리 (클라이언트 fallback)

```typescript
// src/lib/utils/menu-url-mapper.ts
export function resolveMenuUrl(
  menuId: number,
  cspUrl: string | null,
  mappings: InsiteMenuMapping[]
): { href: string; isLegacy: boolean } {
  const mapping = mappings.find(m => m.menuId === menuId);

  if (mapping?.insiteUrl) {
    return { href: mapping.insiteUrl, isLegacy: false };
  }

  // 미구현 메뉴: csp-web 경로로 fallback (새 탭 열기 권장)
  if (cspUrl) {
    return { href: cspUrl, isLegacy: true };
  }

  return { href: '#', isLegacy: true };
}
```

### 모니터링 기준

| 지표 | 기준 | 조치 |
|-----|------|------|
| 미매핑 메뉴 수 | Phase 6 완료 후 0개 | Admin UI에서 수동 등록 |
| 미구현 fallback 클릭 수 | 주간 로그 확인 | 우선 구현 검토 |
| menu_insite_mapping 커버리지 | Phase 6 완료 시 100% | 구현 현황 대시보드 활용 |

### 전환 완료 기준
1. Phase 6 모든 메뉴에 `insite_url` 등록 완료
2. 구현 현황 대시보드 미매핑 0건
3. csp-web 접속자 수가 0에 근접 → 레거시 fallback 코드 제거 가능

---

## 7. 구현 단계 및 파일 변경 목록

### Phase 1: DB + 인프라 (1~2일)
- [ ] Flyway migration: `menu_insite_mapping` 테이블 생성
- [ ] 기존 `menu-overrides.json` 데이터 DB INSERT
- [ ] `src/lib/db/csp-db.ts` (신규)
- [ ] `src/lib/db/menu-mapping.ts` (신규)
- [ ] `.env.local` CSP_DB_* 환경변수 추가

### Phase 2: 메뉴 시스템 개선 (1~2일)
- [ ] `src/app/api/services/menus/route.ts` (DB 매핑 병합)
- [ ] `src/lib/types/menu.ts` (insiteUrl 필드 추가)
- [ ] `src/lib/utils/menu-url-mapper.ts` (단순화)
- [ ] `public/menu-overrides.json` (삭제)
- [ ] `src/middleware.ts` (역할 가드 보조 추가)

### Phase 3: Admin UI (2~3일)
- [ ] `src/app/(modules)/settings/menu-management/page.tsx` (탭 추가)
- [ ] `src/app/api/settings/menu-mapping/route.ts` (DB CRUD)
- [ ] `src/app/api/settings/role-menus/route.ts` (역할별 권한 뷰어)
- [ ] `src/components/settings/menu-mapping-editor.tsx` (인라인 편집 UI)

### Phase 4: csp-was (선택, 필요 시)
- [ ] 캐시 무효화 엔드포인트 확인/추가

---

## 8. 환경변수 관리 전략 (CSP DB 접근)

### 환경변수 목록

```bash
# .env.local (개발 — git 커밋 금지)
CSP_DB_HOST=localhost
CSP_DB_PORT=5433
CSP_DB_NAME=csp
CSP_DB_USER=insite_app        # 기존 테이블 SELECT + menu_insite_mapping CRUD
CSP_DB_PASSWORD=...

CSP_WAS_URL=http://localhost:8080  # 캐시 무효화 API 호출용
```

### DB 사용자 권한 분리 (보안)

```sql
-- csp DB에서 insite-web 전용 계정 생성
-- 계정명: insite_app (읽기+제한적 쓰기 혼합이므로 readonly 명명 지양)
CREATE USER insite_app WITH PASSWORD '{강력한_비밀번호}';

-- 읽기 권한: 기존 테이블 (최소 권한 원칙)
GRANT SELECT ON menu, page_info, role, role_menu, role_page_default_function TO insite_app;

-- 읽기+쓰기 권한: 신규 테이블만 (insite-web이 소유하는 테이블)
GRANT SELECT, INSERT, UPDATE, DELETE ON menu_insite_mapping TO insite_app;
GRANT USAGE, SELECT ON SEQUENCE menu_insite_mapping_id_seq TO insite_app;
```

**비밀번호 관리:**
- 로컬 개발: `.env.local`에 저장 (git 커밋 금지, `.gitignore` 포함 필수)
- 개발/운영 서버: 배포 환경변수로 관리 (팀 내 시크릿 관리 도구 사용)
- 로테이션: 분기 1회 권장 (변경 시 환경변수 재배포 필요)

### 환경별 설정

| 환경 | DB Host | 비고 |
|-----|--------|------|
| 로컬 개발 | localhost:5433 (Docker) | `.env.local` |
| 개발 서버 | 121.133.17.21:5432 | 배포 환경변수 |
| 운영 | 별도 협의 필요 | 운영 DB 직접 접근 전 보안 검토 |

---

## 9. 승인 후 프로젝트 룰 추가 내용

```markdown
## 메뉴 URL 등록 절차
신규 페이지 구현 시 반드시:
1. Admin UI (설정 > 메뉴 관리 > URL 매핑 탭)에서 해당 menu_id의 insite_url 등록
2. settings 급의 명시적 보호 라우트면 middleware.ts PROTECTED_ROUTES에 추가
   - 역할 조건은 csp-was role_menu와 동일하게 유지 (sync 필수)
3. 구현 현황 대시보드에서 미매핑 항목이 없는지 확인

## csp DB 접근 규칙
- Server Component / Next.js API Route에서만 허용 (Client Component 직접 호출 금지)
- 읽기 허용: menu, page_info, role, role_menu, menu_insite_mapping
- 쓰기 허용: menu_insite_mapping만 허용 (Admin UI에서만)
- 저장 후 반드시 revalidateTag + csp-was 캐시 무효화 API 호출
- DB 계정: insite_app (최소 권한 원칙 — 기존 테이블 읽기 전용, menu_insite_mapping만 쓰기 허용)

## 권한 체계 원칙 (3계층)
- 1차 권위(필수): csp-was /api/services/menus → 역할+건물 필터링된 메뉴만 반환
- 2차 권위(필수): csp-was JWT Bearer 검증 → 모든 API 요청에서 인증
- 3차 가드(UX 보조): middleware JWT claims → settings 등 명시적 라우트만 빠른 리다이렉트
  * 이 계층은 UX 목적, middleware 우회 시에도 1·2차가 데이터 접근 차단
  * 역할 조건 변경 시 csp-was role_menu + middleware PROTECTED_ROUTES 둘 다 수정
```
