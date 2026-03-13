# 메뉴 & 권한 시스템 개편 계획 v2

> 작성일: 2026-03-12
> 핵심 전략: **단일 진실 소스(Single Source of Truth)** — 메뉴 데이터는 csp DB 하나에서 관리

---

## 1. 왜 이 방법이 최선인가

### 이전 플랜의 한계 (v1)
- `insite_menu_url_mapping` 신규 테이블 → **두 개의 진실 소스 발생**
  - `menu.url` (csp-web용) + `insite_menu_url_mapping.insite_url` (insite-web용)
  - 메뉴 삭제/변경 시 정합성 관리 부담
- 정적 `menu-overrides.json` 파일 → 배포 없이 변경 불가

### v2 핵심 아이디어
`menu` 테이블에 `insite_url` 컬럼 직접 추가 + csp-was API 응답에 포함

**장점:**
- 단일 진실 소스: 메뉴 삭제/변경 시 insite_url 자동 연동
- csp-was의 Redis 캐시 그대로 활용 (TTL 1일, 별도 캐시 레이어 불필요)
- csp-web 무영향: 기존 코드가 새 필드 무시
- 최소 변경: flyway 1개 + Java 5-10줄 + insite-web 단순화

---

## 2. 변경 범위 전체 요약

| 구성요소 | 변경 내용 | 규모 |
|---------|---------|------|
| **DB** (csp) | `menu` 테이블에 `insite_url` 컬럼 추가 | flyway migration 1개 |
| **csp-was** | `Menu` 엔티티, `MenuDTO` 필드 추가 | Java 코드 ~10줄 |
| **csp-was** | 캐시 무효화 엔드포인트 추가 (선택적) | ~20줄 |
| **insite-web** | `menu-url-mapper.ts` 단순화 | 코드 축소 |
| **insite-web** | `menu-overrides.json` 삭제 후 DB로 이관 | 파일 삭제 |
| **insite-web** | Admin UI에서 `insite_url` 편집 기능 | 기존 메뉴 관리 UI 확장 |
| **insite-web** | `middleware.ts` 역할 기반 라우트 보호 | ~30줄 추가 |

---

## 3. DB 변경 (flyway migration)

```sql
-- 파일: csp-was/src/main/resources/db/migration/common/V{N}__add_insite_url_to_menu.sql

ALTER TABLE menu ADD COLUMN insite_url VARCHAR(500) NULL;
COMMENT ON COLUMN menu.insite_url IS 'insite-web 라우트 경로 (NULL이면 미구현 또는 csp-web URL 사용)';

-- 기존 menu-overrides.json 데이터 이관 (초기 데이터)
-- 예시: 시설 목록 페이지
UPDATE menu SET insite_url = '/facilities'
  WHERE id IN (SELECT menu_id FROM page_info WHERE url = '/facility/facilityList');

-- 작업지시 목록
UPDATE menu SET insite_url = '/work-orders'
  WHERE id IN (SELECT menu_id FROM page_info WHERE url LIKE '/workOrder/workOrderList%');

-- ... (menu-overrides.json 전체 항목 이관)
```

**기존 데이터 영향 없음**: NULL 컬럼 추가이므로 csp-web은 이 컬럼을 읽지 않아 완전 무영향.

---

## 4. csp-was 변경 (최소)

### 4-1. Menu 엔티티 필드 추가
```java
// Menu.java에 추가 (~2줄)
@Column(name = "insite_url")
private String insiteUrl;   // insite-web 라우트 경로 (null이면 미구현)
```

### 4-2. MenuDTO 필드 추가
```java
// MenuDTO.java에 추가 (~2줄)
private String insiteUrl;   // insite-web 라우트

// MenuDTO.from(Menu menu) 메서드에 추가 (~1줄)
dto.setInsiteUrl(menu.getInsiteUrl());
```

### 4-3. 캐시 무효화 엔드포인트 (선택적)
기존 `/api/admin/caches/evict`가 있으면 활용, 없으면 추가:
```java
// AdminController.java (기존 파일에 추가, ~10줄)
@PostMapping("/api/admin/menus/cache/evict")
public ResponseEntity<?> evictMenuCache() {
    redisCacheService.invalidatePattern("menu_tree:*");
    return ResponseEntity.ok(Map.of("message", "메뉴 캐시가 삭제되었습니다."));
}
```

**총 csp-was 변경: Java 파일 2-3개, ~15줄**

---

## 5. 아키텍처 흐름 (v2)

```
┌─────────────────────────────────────────────────────────┐
│                   csp DB (단일 진실 소스)                  │
│  menu 테이블: id, name, url(csp), insite_url(신규), ...   │
│  role_menu: 역할-메뉴 권한 매핑                            │
└────────────────────┬──────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                        ▼
┌───────────────┐      ┌─────────────────────┐
│   csp-was     │      │  insite-web Admin    │
│  (기존 + 신규  │      │  (백오피스 관리 UI)   │
│   ~15줄)      │      │                     │
│               │      │  insite_url 편집 후  │
│  Redis 캐시   │      │  csp DB UPDATE      │
│  (1일 TTL)    │      │  + 캐시 무효화 API   │
└───────┬───────┘      └─────────────────────┘
        │ GET /api/services/menus
        │ → MenuDTO.insiteUrl 포함
        ▼
┌───────────────────────────────────────────┐
│          insite-web (Next.js)              │
│                                           │
│  useSidebarMenus()                        │
│  ├─ insiteUrl 있으면 → insite 라우트 사용  │
│  └─ 없으면 → 외부 링크 or 미구현 표시      │
│                                           │
│  middleware.ts                            │
│  └─ JWT userRoles → 라우트 접근 제어       │
└───────────────────────────────────────────┘
```

---

## 6. insite-web 변경

### 6-1. API 응답 타입 수정
```typescript
// src/lib/types/menu.ts에 insiteUrl 필드 추가
export interface MenuDTO {
  id: number;
  depth: number;
  sortNo: number;
  parentId: number;
  name: string;
  url: string | null;        // csp-web URL (레거시)
  insiteUrl: string | null;  // insite-web 라우트 (신규)
  show: boolean;
  icon: string | null;
  serviceInfoId: number | null;
  serviceName: string | null;
  children: MenuDTO[];
}
```

### 6-2. menu-url-mapper.ts 단순화
```typescript
// 기존: 복잡한 정적 매핑 로직
// 변경 후: csp-was API 응답의 insiteUrl 직접 사용
export function resolveMenuUrl(menu: MenuDTO): string | null {
  // 1순위: csp-was API에서 받은 insiteUrl
  if (menu.insiteUrl) return menu.insiteUrl;
  // 2순위: 폴백 없음 (미구현 메뉴는 비활성 처리)
  return null;
}
```

### 6-3. 삭제
- `public/menu-overrides.json` → DB 이관 후 삭제

### 6-4. middleware.ts 역할 기반 라우트 보호
```typescript
// 추가: 역할 기반 라우트 접근 제어
// JWT claims.userRoles 기반 (DB 조회 없이)
const ROUTE_ROLE_REQUIREMENTS: Array<{pattern: RegExp; roles: string[]}> = [
  {
    pattern: /^\/settings/,
    roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_LABS_SYSTEM_ADMIN'],
  },
  {
    pattern: /^\/work-orders/,
    roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_LABS_SYSTEM_ADMIN', 'ROLE_LABS_SITE_ADMIN',
            'ROLE_LABS_SITE_FMS_CHARGER', 'ROLE_LABS_SITE_FMS_MEMBER'],
  },
  // ...
];

function hasRequiredRole(userRoles: string[], requiredRoles: string[]): boolean {
  return userRoles.some(role => requiredRoles.includes(role));
}
```

### 6-5. Admin UI: insite_url 편집 기능
기존 `settings/menu-management` 페이지 확장:
- 메뉴 트리 뷰 + `insite_url` 인라인 편집
- 저장 시: `PUT /api/settings/menu-mapping/{menuId}` → csp DB UPDATE
- 저장 후: csp-was 캐시 무효화 API 호출 (`POST /api/admin/menus/cache/evict`)
- 미구현 메뉴 목록 (insite_url = NULL) 현황 표시

---

## 7. 구현 단계 및 우선순위

### Phase 1: DB + csp-was (선행 필수)
1. flyway migration: `menu.insite_url` 컬럼 추가
2. Menu.java, MenuDTO.java 필드 추가
3. 기존 menu-overrides.json 데이터를 DB에 UPDATE
4. (선택) 캐시 무효화 엔드포인트 추가

### Phase 2: insite-web 핵심 변경
1. `MenuDTO` 타입에 `insiteUrl` 추가
2. `menu-url-mapper.ts` 단순화 (insiteUrl 우선 사용)
3. `public/menu-overrides.json` 삭제
4. `middleware.ts` 역할 기반 라우트 보호 추가

### Phase 3: Admin UI
1. 메뉴 관리 페이지에서 insite_url 편집 기능
2. 미구현 메뉴 현황 대시보드
3. 역할별 메뉴 권한 뷰어 (role_menu DB 읽기)

---

## 8. 리스크 및 대응

| 리스크 | 대응 |
|------|------|
| csp-was Redis 캐시로 인한 변경 반영 지연(최대 1일) | Admin UI에서 저장 후 캐시 무효화 API 호출 |
| flyway migration 배포 순서 | csp-was 배포 전 DB migration 먼저 적용 (NULL 허용이므로 기존 코드 영향 없음) |
| insite_url 일괄 이관 누락 | Admin UI의 미구현 현황판으로 모니터링 |
| csp-web과의 DTD 불일치 | MenuDTO는 csp-was → csp-web BFF에서 사용하지 않음 (API 전용) |

---

## 9. 승인 후 프로젝트 룰 추가 항목

```markdown
# 메뉴 URL 등록 절차
새 페이지 구현 시 반드시:
1. flyway 또는 Admin UI에서 menu.insite_url 등록
2. middleware.ts ROUTE_ROLE_REQUIREMENTS에 라우트 + 허용 역할 추가
3. 미구현 메뉴 현황판에서 NULL 항목이 없는지 확인

# csp DB 직접 접근 규칙
- menu.insite_url UPDATE: Admin UI(백오피스)에서만 허용
- 그 외 모든 csp DB 접근: 읽기 전용
- Server Component / API Route에서만 사용 (Client Component 직접 호출 금지)
- 수정 후 반드시 csp-was 메뉴 캐시 무효화 API 호출
```
