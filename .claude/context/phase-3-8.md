# Phase 3-8 요약

> 상세 내용은 `/Volumes/jinseok-SSD-1tb/00_insite/migration-plan.md` 참조

## Phase 3: FMS 파일럿 (전체 스택 검증)

첫 번째 실제 모듈을 구현하여 전체 스택을 검증합니다.

- 작업 목록 (DataTable + 필터 + URL 상태)
- 작업 상세 (상태 워크플로우)
- 작업 생성/수정 (react-hook-form + zod)
- S3 이미지 업로드/표시
- Feature Flag 설정
- 병렬 운영 테스트 (기존 csp-web과 동시 운영)
- 성능 벤치마크

## Phase 4: 추가 CRUD 모듈

| 모듈 | 상태 |
|------|------|
| 사용자 관리 | ⏳ |
| 시설 관리 | ⏳ |
| 게시판/공지 | ⏳ |
| 설정 | ⏳ |
| 클라이언트/계약 | ⏳ |
| 자재 관리 | ⏳ |
| 라이선스 | ⏳ |
| 순찰/NFC | ⏳ |
| 태그 | ⏳ |
| 마이페이지 | ⏳ |
| 개인정보 | ⏳ |
| 게스트 플로우 | ⏳ |

## Phase 5: 대시보드 위젯 구현 (48개)

- Batch 1: 상위 15개 위젯
- Batch 2: widget16 ~ widget43
- Batch 3: 특수 위젯 (widget101 ~ widget105)
- 대시보드 페이지: Main, FMS, RMS, Sensor

## Phase 6: 복잡 모듈

| 모듈 | 컨트롤러 수 |
|------|-------------|
| BEMS | 10개 |
| BECM | 7개 |
| 센서/분석 | - |
| Fieldwork + SSE | - |
| BIM 뷰어 | - |

### SSE 실시간 연동

```typescript
// hooks/use-field-sse.ts
// EventSource 네이티브 API 사용
// Last-Event-ID 기반 재연결
```

## Phase 7: 모바일 + 접근성 + 성능

- `/m/*` 전용 모바일 레이아웃
- 반응형 정밀 조정
- WCAG 2.1 AA 최종 감사
- 성능 최적화 (Phase 0 베이스라인 대비)
- 문서화 완료

## Phase 8: QA & 런칭

- 전체 E2E 테스트
- 보안 감사
- Feature Flag 전환
- 프로덕션 배포
- 기존 앱 트래픽 전환

## 품질 체크리스트

```bash
npm run test:unit      # Vitest
npm run test:e2e       # Playwright
npm run lint           # ESLint
npm run type-check     # TypeScript
```

- TypeScript 에러 0개
- ESLint 경고 0개
- 테스트 커버리지 80% 이상
- Lighthouse 성능/접근성 90+
