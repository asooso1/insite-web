# Deprecated 문서

> 이 디렉토리의 문서는 **완료/대체**되어 더 이상 활성 참조 대상이 아닙니다.
> 히스토리 보존 목적으로 유지하며, 삭제하지 마세요.

## 폐기 사유

| 문서 | 사유 | 폐기일 |
|------|------|--------|
| `comprehensive-review-plan.md` | 39건 보안/구현 이슈 모두 해결 (task-progress.md 참조) | 2026-03-24 |
| `browser-testing-tasklist.md` | v1 vs v2 브라우저 비교 완료, 결과 반영됨 | 2026-03-24 |
| `backend-changes.md` | 초기(2026-02) 변경 요청, 이후 구현/대체됨 | 2026-03-24 |

### phase-0/ (Phase 0 초기 분석)

| 문서 | 사유 |
|------|------|
| `api-audit.md` | OpenAPI 스펙 추출 미완성, api-backend-spec.md로 대체 |
| `infrastructure-decisions.md` | 인프라 결정 완료, 실제 배포 환경으로 진행 |
| `performance-baseline.md` | 성능 측정 미실행, Phase 7에서 별도 최적화 |
| `prisma-schema-design.md` | Prisma 대신 menu_insite_mapping 직접 쿼리로 결정 |

### ux-analysis/ (UX 분석)

| 문서 | 사유 |
|------|------|
| `00-gap-analysis-report.md` | GAP 분석 결과가 `docs/task-next.md`에 완전 반영됨 |
| `03-ux-persona-analysis.md` | 페르소나 분석 완료, 결과 적용됨 |

### root-analysis/ (루트 레벨 일회성 분석)

| 문서 | 사유 |
|------|------|
| `DESIGN_SYSTEM_AUDIT.md` | 디자인 시스템 감사 → `.claude/rules/design-system.md`에 반영 |
| `DESIGN_SYSTEM_AUDIT_SUMMARY.md` | 위 감사 요약 |
| `DESIGN_SYSTEM_REMEDIATION.md` | 개선 계획 → 실행 완료 |
| `DOCUMENTATION_AUDIT.md` | 문서 감사 → `.claude/rules/*` 업데이트로 해결 |
| `DOCUMENTATION_INDEX.md` | 위 감사 인덱스 |
| `DOCUMENTATION_SUMMARY.md` | 위 감사 요약 |
| `MIGRATION_ANALYSIS_INDEX.md` | v1 분석 인덱스 → `docs/reference/` 파일들로 대체 |
| `RULES_IMPLEMENTATION_ROADMAP.md` | 규칙 개선 로드맵 → 대부분 실행 완료 |
