# 메뉴 & 권한 시스템 규칙

> 아키텍트 승인: 2026-03-12
> 참고 플랜: `.omc/plans/approved/menu-permission-overhaul-plan-v3-APPROVED.md`

---

## 권한 체계 원칙 (3계층)

| 계층 | 담당 | 목적 | 권위 |
|-----|------|------|-----|
| 1차 (필수) | csp-was `/api/services/menus` | 역할+건물 기반 메뉴 필터링 | **권위** |
| 2차 (필수) | csp-was JWT Bearer 검증 | 모든 API 요청 인증 | **권위** |
| 3차 (UX 보조) | middleware JWT claims | 직접 URL 입력 시 빠른 리다이렉트 | 선택적 |

**핵심 원칙:**
- middleware 우회해도 1·2차 계층이 데이터 접근을 차단 (보안 홀 없음)
- middleware PROTECTED_ROUTES 역할 조건은 csp-was `role_menu`와 반드시 동기화 유지

---

## 신규 페이지 구현 시 메뉴 URL 등록 절차

```
1. Admin UI (설정 > 메뉴 관리 > URL 매핑 탭)에서
   해당 menu_id의 insite_url 등록

2. settings/users 급의 관리자 전용 라우트면
   src/middleware.ts PROTECTED_ROUTES에 추가
   ⚠️ 역할 조건은 csp-was role_menu 권한과 동일하게 유지 (sync 필수)

3. 구현 현황 대시보드에서 미매핑 항목이 없는지 확인
```

---

## csp DB 접근 규칙

**허용 위치:** Server Component / Next.js API Route만 허용
- Client Component에서 직접 DB 호출 금지

**읽기 허용 테이블:**
- `menu`, `page_info`, `role`, `role_menu`, `role_page_default_function`, `menu_insite_mapping`

**쓰기 허용 테이블:**
- `menu_insite_mapping`만 허용 (Admin UI에서만)
- 기존 csp 테이블 INSERT/UPDATE/DELETE 금지

**저장 후 캐시 무효화 필수:**
```typescript
// Step 1: DB UPDATE (필수)
await updateInsiteMapping(menuId, insiteUrl);

// Step 2: Next.js 캐시 무효화 (try/catch 필수)
try { revalidateTag('insite-menu-mappings'); }
catch (e) { console.warn('[메뉴 캐시] Next.js 무효화 실패:', e); }

// Step 3: csp-was Redis 무효화 (try/catch 필수)
try { await fetch(`${CSP_WAS_URL}/api/admin/menus/cache/evict`, ...); }
catch (e) { console.warn('[메뉴 캐시] csp-was 무효화 실패:', e); }
```

**DB 계정:** `insite_app`
- 기존 csp 테이블: SELECT만
- `menu_insite_mapping`: SELECT + INSERT + UPDATE + DELETE
- 비밀번호: `.env.local` (git 커밋 금지), 분기 1회 로테이션 권장

---

## URL 매핑 아키텍처

- `menu_insite_mapping` 테이블: `menu_id` → `insite_url` 1:1 매핑
- 기존 `menu` 테이블 변경 없음 (csp-web 완전 무영향)
- csp-was Option B: insite-web API Route에서 두 소스 병합
  1. `GET /api/services/menus` (csp-was) → 권한 필터링된 메뉴 트리
  2. csp DB `menu_insite_mapping` 직접 쿼리 → URL 매핑 (1시간 캐시)
  3. 병합 후 클라이언트에 반환

---

## middleware.ts PROTECTED_ROUTES 작성 규칙

```typescript
// 명시적 보호가 필요한 라우트만 등록
// 나머지는 csp-was 메뉴 필터링에 위임
// 역할 목록은 csp-was role_menu 쿼리 결과와 반드시 동일하게 설정:
//   SELECT DISTINCT r.code FROM role r
//   JOIN role_menu rm ON r.id = rm.role_id
//   JOIN page_info pi ON rm.page_info_id = pi.id
//   WHERE pi.url LIKE '/settings%' AND rm.has_right = true;
const PROTECTED_ROUTES: Array<{ pattern: RegExp; requiredRoles: string[] }> = [
  {
    // 시스템 설정 — 시스템/본사 관리자만
    pattern: /^\/settings/,
    requiredRoles: ['ROLE_SYSTEM_ADMIN', 'ROLE_LABS_SYSTEM_ADMIN'],
  },
  {
    // 사용자/역할 관리 — 관리자 이상
    pattern: /^\/users/,
    requiredRoles: ['ROLE_SYSTEM_ADMIN', 'ROLE_LABS_SYSTEM_ADMIN', 'ROLE_LABS_SITE_ADMIN'],
  },
  // 새 라우트 추가 시: 위 쿼리로 csp-was role_menu 역할 확인 후 동일하게 설정
];
```

**등록 기준:**
- settings, users 등 명시적 역할 조건이 단순한 관리자 전용 라우트만 등록
- work-orders, facilities 등 현장 인원 역할이 복잡한 경우 → csp-was 위임

**미매핑 메뉴 fallback:**
- `insiteUrl`이 null인 메뉴는 csp-web 경로(`cspUrl`)로 fallback (새 탭)
- Phase 6 완료 후 미매핑 0건 유지 필수 (구현 현황 대시보드 확인)
