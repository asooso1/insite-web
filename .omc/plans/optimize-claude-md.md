# CLAUDE.md 최적화 계획

> 목표: 토큰 사용량 최소화 + 핵심 규칙/패턴 보존 + 구식 내용 업데이트

## 컨텍스트

### 현재 상태 (코드베이스 기준)
- Phase 1-6 완료 (인증, CRUD, 게시판, 설정, 대시보드, 복잡 모듈)
- Phase 7 (모바일/최종 조정), Phase 8 (QA/런칭) 대기중
- 구현된 모듈 10개: boards, clients, facilities, licenses, materials, patrols, reports, settings, users, work-orders

### 문제점
1. 루트 CLAUDE.md: "Phase 4 진행중 35%" -- 실제로는 Phase 6 완료 (~75%)
2. insite-web CLAUDE.md: "Phase 4 25%" + "다음: 사용자 관리" -- 완전히 구식
3. 구현 패턴 코드 예시 ~93줄 -- 보일러플레이트 과다, 시그니처만으로 충분
4. 디렉토리 구조와 페이지 구조 섹션 중복
5. context 참조가 `phase-4-plan.md` 고정 -- 범용화 필요

## 작업 목표

| 항목 | 현재 | 목표 | 절감률 |
|------|------|------|--------|
| 루트 CLAUDE.md | ~403 토큰 | ~280 토큰 | ~30% |
| insite-web CLAUDE.md | ~2,200 토큰 | ~1,100 토큰 | ~50% |
| 합계 | ~2,600 토큰 | ~1,380 토큰 | ~47% |

## 가드레일

### 반드시 보존
- 핵심 규칙 3개 (한국어, csp-was 변경 금지, csp-web 참조만)
- 용어 테이블 (Work Order/Facility/Building/Dashboard/Widget)
- 코드 금지 사항 (any/!important/인라인 스타일/localStorage)
- 커밋 형식
- 백엔드/프론트엔드 참조 경로
- 구현 패턴 4단계 구조 (타입 > API > 훅 > 페이지)

### 반드시 하지 않을 것
- 규칙/용어/참조 경로 제거
- 구현 패턴 자체를 삭제 (축약만 허용)
- 영문으로 변환

## 태스크 흐름

### Step 1: 루트 CLAUDE.md 업데이트
**파일:** `/Volumes/jinseok-SSD-1tb/00_insite/CLAUDE.md`

변경 사항:
- 진행률 35% -> 75% 업데이트
- Phase 정보를 "Phase 6 완료, Phase 7 대기" 로 업데이트
- context 참조를 phase-4-plan.md 고정에서 범용 참조로 변경
- 이모지 제거, 마크다운 간소화

**완료 기준:** 진행 상태가 실제 코드베이스와 일치, 토큰 ~280 이하

### Step 2: insite-web CLAUDE.md 구현 패턴 축약
**파일:** `/Volumes/jinseok-SSD-1tb/00_insite/insite-web/.claude/CLAUDE.md`

변경 사항:
- 타입 정의 패턴: 93줄 풀 코드 -> 시그니처 + 주석 (~20줄)
  - `{Enum} as const` + `{Enum}Label` + `{Module}DTO` + `{Module}VO` + `Search{Module}VO` 패턴만 명시
  - API: `list/view/add/edit/delete` 시그니처 1줄씩
  - 훅: `keys factory` + `useQuery` + `useMutation` 패턴명만
  - 페이지: 디렉토리 트리만 (기존 유지, 중복 디렉토리 구조 섹션 삭제)

**완료 기준:** 패턴 섹션이 ~30줄 이내, 새 모듈 구현에 충분한 정보 보존

### Step 3: 구식 상태 정보 + 중복 제거
**파일:** `/Volumes/jinseok-SSD-1tb/00_insite/insite-web/.claude/CLAUDE.md`

변경 사항:
- 현재 상태 섹션: Phase 6 완료, Phase 7 대기로 업데이트
- "다음 태스크" 제거 (빈번히 구식화됨 -- task-progress.md로 위임)
- 디렉토리 구조 섹션 삭제 (페이지 구조 패턴과 중복)
- 빠른 명령어 3줄로 인라인화
- 검증된 구현 예시 참조를 패턴 섹션에 통합
- 이모지 제거

**완료 기준:** 중복 섹션 0개, 구식 정보 0개

### Step 4: 최종 검증
- 두 파일의 토큰 수 측정 (목표: 합계 ~1,380 이하)
- 규칙/용어/경로 누락 없는지 체크리스트 대조
- 빌드 깨지지 않는지 확인 (CLAUDE.md는 빌드 무관하므로 내용 정합성만 확인)

**완료 기준:** 모든 가드레일 항목이 최종 파일에 존재

## 성공 기준
1. 합산 토큰 ~47% 절감 (2,600 -> ~1,380)
2. 핵심 규칙 5개 모두 보존 (한국어, csp-was 금지, csp-web 참조만, 코드 금지사항, 커밋 형식)
3. 구현 패턴 4단계 모두 보존 (축약 형태)
4. 진행 상태가 실제 코드베이스와 일치 (Phase 6 완료)
5. 중복 섹션 0개

## 최적화 후 예상 파일 내용

드래프트 파일 참조:
- `/Volumes/jinseok-SSD-1tb/00_insite/insite-web/.omc/drafts/root-claude-md.md`
- `/Volumes/jinseok-SSD-1tb/00_insite/insite-web/.omc/drafts/insite-web-claude-md.md`
