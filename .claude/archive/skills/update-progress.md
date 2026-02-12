# 스킬: update-progress

> 진행 상황 자동 업데이트

## 트리거

- 태스크 완료 후
- 커밋 생성 후
- 사용자가 `/update-progress` 요청 시

## 실행 단계

### 1. 완료된 태스크 식별

최근 커밋에서 완료된 작업 파악:
```bash
git log -1 --pretty=format:"%s"
```

### 2. task-progress.md 업데이트

```markdown
# 변경 전
| DataTable | ⏳ | - | - | TanStack Table v8 |

# 변경 후
| DataTable | ✅ | 2026-02-10 | - | TanStack Table v8 |
```

### 3. state/current.md 업데이트

```markdown
## 현재 상태

- **Phase:** 2A
- **진행률:** 15% (2/13 완료)
- **마지막 완료:** DataTable 컴포넌트
- **다음 태스크:** DataTable Toolbar
```

### 4. 커밋 이력 추가

```markdown
## 커밋 이력

| 날짜 | 커밋 메시지 | Phase |
|------|------------|-------|
| 2026-02-10 | `feat: DataTable 컴포넌트 구현` | Phase 2A |
```

## 자동 계산

### 진행률 계산

```
Phase 진행률 = 완료된 태스크 수 / 전체 태스크 수 × 100
```

### Phase 상태 결정

- 0%: ⏳ 대기
- 1-99%: 🔄 진행중
- 100%: ✅ 완료

## 파일 위치

- `docs/task-progress.md` - 전체 진행 상황
- `.claude/state/current.md` - 현재 스냅샷

## 업데이트 형식

### task-progress.md

```markdown
## Phase 2A: 핵심 데이터 컴포넌트

### 2A.1 데이터 디스플레이
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| DataTable | ✅ | 2026-02-10 | - | TanStack Table v8 |
| DataTable Toolbar | ⏳ | - | - | 검색 + 필터바 |
```

### state/current.md

```markdown
# 현재 상태

> 자동 생성됨 - 마지막 업데이트: 2026-02-10

## 요약

| 항목 | 값 |
|------|-----|
| 현재 Phase | 2A |
| Phase 진행률 | 15% |
| 전체 진행률 | 12% |
| 마지막 커밋 | feat: DataTable 컴포넌트 구현 |

## 다음 태스크

1. DataTable Toolbar (검색 + 필터바)
2. DataTable Pagination (페이지네이션 통합)
3. StatWidget (미니 차트 포함)

## 최근 완료

- [x] DataTable 컴포넌트 (2026-02-10)
- [x] Phase 1 기반 구축 (2026-02-06)
```

## 연계 동작

업데이트 완료 후:
1. 다음 태스크 안내
2. `/next-task` 제안
