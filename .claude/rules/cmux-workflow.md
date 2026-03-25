# cmux 에이전트 기반 개발 워크플로우

적용 대상: `**/*.sh`, `.claude/**`

> cmux는 macOS 네이티브 터미널 앱 (Ghostty 기반)으로, AI 코딩 에이전트를 위한 멀티창/브라우저/사이드바 UI를 제공합니다.
> cmux 없이도 모든 Claude Code 기능은 정상 작동합니다.

---

## 빠른 시작

```bash
# 1. cmux 설치
#    DMG: https://github.com/manaflow-ai/cmux/releases/latest/download/cmux-macos.dmg
#    Homebrew: brew tap manaflow-ai/cmux && brew install --cask cmux

# 2. CLI 심볼릭 링크 (cmux 앱 외부에서 CLI 사용)
sudo ln -sf "/Applications/cmux.app/Contents/Resources/bin/cmux" /usr/local/bin/cmux

# 3. 프로젝트 셋업
bash scripts/setup-cmux.sh
```

---

## 계층 구조

| 계층 | 설명 | 생성 단축키 |
|------|------|------------|
| Window | macOS 창 | Cmd+Shift+N |
| Workspace | 사이드바 탭 항목 | Cmd+N |
| Pane | 분할 영역 | Cmd+D (우), Cmd+Shift+D (하) |
| Surface | Pane 내 탭 (터미널/브라우저) | Cmd+T |

각 Surface는 고유한 `CMUX_SURFACE_ID` 환경 변수를 가집니다.

---

## 개발 환경 레이아웃

### 방법 1: cmux.json (권장)

프로젝트 루트의 `cmux.json`에 선언적 레이아웃이 정의되어 있습니다.
cmux 앱 명령어 팔레트에서 "Dev Environment"를 선택하면 자동 구성됩니다.

### 방법 2: 스크립트

```bash
bash .claude/cmux/workspace-layout.sh
```

```
+------------------+-------------------+
|  Claude Code     |  npm run dev      |
|  (에이전트 실행)  |  localhost:3000   |
+------------------+-------------------+
|         브라우저 미리보기              |
+---------------------------------------+
```

---

## CLI 명령어 레퍼런스 (cmux help 기준)

### 시스템
```bash
cmux ping                          # 연결 확인
cmux capabilities                  # 지원 기능 목록 (JSON)
cmux identify                      # 앱/워크스페이스/서피스 정보
cmux tree                          # 워크스페이스 트리 구조
```

### 워크스페이스
```bash
cmux list-workspaces               # 모든 워크스페이스
cmux new-workspace [--cwd <path>] [--command <text>]  # 새 워크스페이스
cmux select-workspace --workspace <id>  # 전환
cmux current-workspace             # 현재 활성
cmux rename-workspace "이름"       # 이름 변경
cmux close-workspace --workspace <id>   # 닫기
```

### 분할/서피스
```bash
cmux new-split right               # 오른쪽 분할 (left/right/up/down)
cmux new-pane [--type terminal|browser] [--direction right] [--url <url>]
cmux list-surfaces                 # 모든 서피스
cmux focus-surface --surface <id>  # 서피스 포커스
cmux focus-pane --pane <id>        # 패인 포커스
cmux rename-tab --surface <id> "이름"  # 서피스 탭 이름 변경
```

### 입력 (--surface 옵션으로 특정 서피스 지정)
```bash
cmux send "text"                           # 포커스된 터미널에 텍스트
cmux send --surface <id> "text"            # 특정 서피스에 텍스트
cmux send-key enter                        # 포커스된 터미널에 키
cmux send-key --surface <id> enter         # 특정 서피스에 키
```

### 사이드바 메타데이터
```bash
cmux set-status "key" "value" --icon "icon" --color "#hex"
cmux clear-status "key"
cmux list-status
cmux set-progress 0.5 --label "텍스트"     # 진행률 (0.0~1.0)
cmux clear-progress
cmux log "메시지" --level info --source "claude"
cmux sidebar-state                         # 전체 상태 조회
```

**log level**: `info` | `progress` | `success` | `warning` | `error`

### 알림
```bash
cmux notify --title "제목" [--subtitle "부제"] --body "본문"
cmux list-notifications
cmux clear-notifications
```

### Claude Code 훅 신호
```bash
cmux claude-hook session-start     # 세션 시작 신호
cmux claude-hook stop              # 세션 종료 신호
cmux claude-hook notification      # 알림 신호
```

### 브라우저 (기본)
```bash
cmux browser open [url]                          # 브라우저 서피스 열기
cmux browser open-split [url]                    # 분할 패널로 열기
cmux browser surface:<id> navigate <url>         # URL 이동 (--snapshot-after 권장)
cmux browser surface:<id> back / forward / reload
cmux browser surface:<id> url                    # 현재 URL 조회
```

**서피스 지정**: 위치 인수 `surface:2` 또는 `--surface surface:2` 플래그 사용.
브라우저 서피스 ID는 `cmux list-surfaces`로 확인.

### 브라우저 — 대기 (에이전트 필수)

페이지 상태 변화를 기다린 후 다음 동작 실행. **클릭/네비게이션 후 반드시 wait 사용.**

```bash
cmux browser surface:<id> wait --load-state complete --timeout-ms 15000
cmux browser surface:<id> wait --selector "#content"           # 요소 출현 대기
cmux browser surface:<id> wait --text "대시보드"               # 텍스트 출현 대기
cmux browser surface:<id> wait --url-contains "/dashboard"     # URL 변경 대기
cmux browser surface:<id> wait --function "window.__appReady === true"
```

### 브라우저 — DOM 상호작용

```bash
# 클릭/호버
cmux browser surface:<id> click "button[type='submit']" --snapshot-after
cmux browser surface:<id> dblclick ".item-row"
cmux browser surface:<id> hover "#menu"
cmux browser surface:<id> focus "#email"

# 폼 입력 (fill = 기존 값 지우고 입력, type = 키보드 시뮬레이션)
cmux browser surface:<id> fill "#email" --text "admin@insite.com"
cmux browser surface:<id> type "#search" "검색어"
cmux browser surface:<id> select "#status" "PROCESSING"

# 체크박스
cmux browser surface:<id> check "#terms"
cmux browser surface:<id> uncheck "#newsletter"

# 키 입력/스크롤
cmux browser surface:<id> press Enter
cmux browser surface:<id> scroll --dy 800 --snapshot-after
cmux browser surface:<id> scroll-into-view "#pricing"
```

### 브라우저 — 검사 (에이전트 핵심)

```bash
# 접근성 트리 스냅샷 — 에이전트가 페이지 구조를 이해하는 핵심 도구
cmux browser surface:<id> snapshot --interactive --compact
cmux browser surface:<id> snapshot --selector "main" --max-depth 5

# 스크린샷 — 시각적 확인/디버깅
cmux browser surface:<id> screenshot --out /tmp/cmux-page.png

# 구조화된 값 조회
cmux browser surface:<id> get title
cmux browser surface:<id> get url
cmux browser surface:<id> get text "h1"
cmux browser surface:<id> get html "main"
cmux browser surface:<id> get value "#email"
cmux browser surface:<id> get attr "a.primary" --attr href
cmux browser surface:<id> get count ".row"              # 목록 행 수
cmux browser surface:<id> get styles "#total" --property color

# 상태 확인 (boolean 반환 — 스크립트 분기에 활용)
cmux browser surface:<id> is visible "#checkout"
cmux browser surface:<id> is enabled "button[type='submit']"
cmux browser surface:<id> is checked "#terms"

# 요소 찾기
cmux browser surface:<id> find role button --name "저장"
cmux browser surface:<id> find text "등록 완료"
cmux browser surface:<id> find label "이메일"
cmux browser surface:<id> find testid "save-btn"
```

### 브라우저 — JS 실행 / CSS 주입

```bash
cmux browser surface:<id> eval "document.title"
cmux browser surface:<id> eval --script "window.location.href"
cmux browser surface:<id> addscript "document.querySelector('#name')?.focus()"
cmux browser surface:<id> addstyle "#debug-banner { display: none !important; }"
```

### 브라우저 — 세션/쿠키/스토리지 관리

```bash
# 쿠키
cmux browser surface:<id> cookies get
cmux browser surface:<id> cookies get --name auth-token
cmux browser surface:<id> cookies set session_id abc123 --domain localhost --path /
cmux browser surface:<id> cookies clear --all

# localStorage / sessionStorage
cmux browser surface:<id> storage local set theme dark
cmux browser surface:<id> storage local get theme
cmux browser surface:<id> storage session set flow onboarding

# 브라우저 상태 저장/복원 (로그인 유지 등)
cmux browser surface:<id> state save /tmp/cmux-session.json
cmux browser surface:<id> state load /tmp/cmux-session.json
```

### 브라우저 — 콘솔/에러/다이얼로그/iframe/다운로드

```bash
# 콘솔 메시지/에러 조회 — 런타임 디버깅 핵심
cmux browser surface:<id> console list
cmux browser surface:<id> errors list

# alert/confirm 다이얼로그 자동 처리
cmux browser surface:<id> dialog accept
cmux browser surface:<id> dialog dismiss

# iframe 진입/복귀
cmux browser surface:<id> frame "iframe[name='checkout']"
cmux browser surface:<id> frame main

# 파일 다운로드 대기
cmux browser surface:<id> download --path /tmp/report.csv --timeout-ms 30000

# 탭 관리
cmux browser surface:<id> tab list
cmux browser surface:<id> tab new https://localhost:3000/settings
cmux browser surface:<id> tab switch 1
cmux browser surface:<id> tab close
```

---

## 브라우저 자동화 — 에이전트 활용 패턴

> **원칙**: 구현/수정 후 브라우저로 실제 동작을 검증하면 피드백 루프가 단축된다.
> `--snapshot-after` 플래그를 적극 활용하여 변경 직후 DOM 상태를 즉시 확인한다.

### 패턴 1: 개발 서버 접속 + UI 검증

코드 수정 후 브라우저에서 결과를 확인하는 기본 루프.

```bash
# 1. 브라우저 서피스 확인 (workspace-layout이 이미 생성)
cmux list-surfaces

# 2. 개발 페이지로 이동
cmux browser surface:<id> navigate http://localhost:3000/facilities --snapshot-after

# 3. 페이지 로드 대기
cmux browser surface:<id> wait --load-state complete --timeout-ms 15000

# 4. 접근성 트리로 DOM 구조 파악
cmux browser surface:<id> snapshot --interactive --compact

# 5. 특정 요소 존재/상태 확인
cmux browser surface:<id> is visible "[data-testid='facility-table']"
cmux browser surface:<id> get count "tbody tr"    # 테이블 행 수 확인
```

### 패턴 2: insite-web 로그인 자동화

개발 서버 접속 시 로그인이 필요한 경우.

```bash
cmux browser surface:<id> navigate http://localhost:3000/login
cmux browser surface:<id> wait --selector "#username" --timeout-ms 10000
cmux browser surface:<id> fill "#username" --text "admin"
cmux browser surface:<id> fill "#password" --text "12345678!"
cmux browser surface:<id> click "button[type='submit']" --snapshot-after
cmux browser surface:<id> wait --url-contains "/dashboard" --timeout-ms 10000

# 로그인 성공 확인
cmux browser surface:<id> get title
```

### 패턴 3: 폼 CRUD 테스트

새 데이터 등록 → 목록 확인 → 상세 조회 → 수정 → 삭제 전체 흐름.

```bash
# 등록 페이지 이동
cmux browser surface:<id> navigate http://localhost:3000/facilities/new
cmux browser surface:<id> wait --load-state complete

# 폼 작성
cmux browser surface:<id> fill "input[name='name']" --text "테스트 시설"
cmux browser surface:<id> select "select[name='status']" "ONGOING_OPERATING"
cmux browser surface:<id> fill "textarea[name='description']" --text "자동화 테스트"
cmux browser surface:<id> click "button[type='submit']" --snapshot-after

# 성공 확인 (toast 또는 리다이렉트)
cmux browser surface:<id> wait --text "등록되었습니다" --timeout-ms 5000
```

### 패턴 4: 런타임 에러 디버깅

UI에서 에러 발생 시 콘솔/네트워크 상태를 수집.

```bash
# 에러 재현 동작 수행 후
cmux browser surface:<id> console list         # JS 콘솔 로그 전체
cmux browser surface:<id> errors list          # JS 에러만 필터
cmux browser surface:<id> screenshot --out /tmp/cmux-error.png
cmux browser surface:<id> snapshot --interactive --compact

# 특정 에러 메시지 존재 확인
cmux browser surface:<id> find text "서버 오류"
cmux browser surface:<id> is visible "[role='alert']"
```

### 패턴 5: 반응형/상태 검증

컴포넌트의 다양한 상태를 브라우저에서 직접 확인.

```bash
# 빈 데이터 상태 확인 (EmptyState 렌더링)
cmux browser surface:<id> is visible "[data-testid='empty-state']"

# 로딩 스켈레톤 확인
cmux browser surface:<id> is visible ".skeleton"

# 특정 StatusBadge 상태 확인
cmux browser surface:<id> get text "[data-testid='status-badge']"

# 모바일 뷰포트 시뮬레이션은 CSS @media로 확인
cmux browser surface:<id> eval "window.innerWidth"
```

### 패턴 6: 브라우저 세션 유지 (로그인 상태 보존)

세션 저장/복원으로 반복 로그인을 방지.

```bash
# 로그인 후 세션 저장
cmux browser surface:<id> state save /tmp/insite-session.json

# 이후 작업에서 세션 복원 (로그인 스킵)
cmux browser surface:<id> state load /tmp/insite-session.json
cmux browser surface:<id> reload
cmux browser surface:<id> wait --load-state complete
```

### 멀티 에이전트
```bash
cmux claude-teams [claude-args...]  # 병렬 Claude Code 에이전트 실행
```

### 키보드 단축키 (주요)
| 기능 | 단축키 |
|------|--------|
| 브라우저 서피스 열기 | Cmd+Shift+L |
| 오른쪽에 브라우저 분할 | Opt+Cmd+D |
| 아래에 브라우저 분할 | Opt+Cmd+Shift+D |
| 주소 표시줄 포커스 | Cmd+L |
| 개발자 도구 | Opt+Cmd+I |
| 알림 패널 | Cmd+Shift+I |
| 최근 미읽음 알림 | Cmd+Shift+U |

---

## 멀티 에이전트 실행

```bash
# 기능 개발
bash .claude/cmux/multi-agent-launch.sh feature "기능 설명"

# 코드 리뷰 (품질 + 보안 병렬)
bash .claude/cmux/multi-agent-launch.sh review

# 버그 디버깅
bash .claude/cmux/multi-agent-launch.sh debug "버그 설명"

# 빌드 오류 수정
bash .claude/cmux/multi-agent-launch.sh build

# QA 테스트 (브라우저 자동화)
bash .claude/cmux/multi-agent-launch.sh qa
```

---

## 사이드바 상태 제어

```bash
bash .claude/cmux/agent-status.sh start "코드베이스 분석 중" 0.1
bash .claude/cmux/agent-status.sh update 0.5 "컴포넌트 구현 중"
bash .claude/cmux/agent-status.sh done "기능 구현 완료"
bash .claude/cmux/agent-status.sh error "빌드 타입 오류"
```

---

## Claude Code 훅 통합

| 이벤트 | 스크립트 | 동작 |
|--------|---------|------|
| `SessionStart` | `session-start.sh` | claude-hook 신호 + 사이드바 초기화 + 레이아웃 |
| `PostToolUse(Edit)` | `post-edit-check.sh` | 패턴 위반 검사 (any, console.log 등) |
| `PreToolUse(Bash)` | `pre-commit-check.sh` | git commit 전 품질 검사 |
| `Notification` | `notification.sh` | claude-hook 신호 + cmux 알림 전달 |
| `Stop` | `stop-check.sh` | claude-hook 신호 + 사이드바 정리 + 미커밋 안내 |

---

## 파일 구조

```
cmux.json                        # 선언적 레이아웃/명령어 정의
.claude/
├── settings.json                # 훅 설정
├── hooks/
│   ├── session-start.sh         # SessionStart: cmux 초기화
│   ├── notification.sh          # Notification: cmux 알림 전달
│   ├── stop-check.sh            # Stop: 정리 + 미커밋 안내
│   ├── pre-commit-check.sh      # PreToolUse(Bash): 품질 검사
│   └── post-edit-check.sh       # PostToolUse(Edit): 패턴 검사
├── cmux/
│   ├── workspace-layout.sh      # 개발 환경 3분할 레이아웃
│   ├── multi-agent-launch.sh    # 멀티 에이전트 실행
│   └── agent-status.sh          # 사이드바 상태 헬퍼
└── rules/
    └── cmux-workflow.md         # 이 문서

scripts/
└── setup-cmux.sh                # 신규 사용자 원클릭 셋업
```

---

## 환경 변수

| 변수 | 설명 |
|------|------|
| `CMUX_SOCKET_PATH` | 소켓 경로 (기본: `~/Library/Application Support/cmux/cmux.sock`) |
| `CMUX_WORKSPACE_ID` | 현재 워크스페이스 ID (cmux 터미널 자동 설정) |
| `CMUX_SURFACE_ID` | 현재 서피스 ID (cmux 터미널 자동 설정) |
| `CMUX_TAB_ID` | 탭 ID (rename-tab 등에서 사용) |
| `TERM_PROGRAM` | `ghostty` |

---

## 문제 해결

**cmux ping 실패:**
```bash
open /Applications/cmux.app   # cmux 앱 재실행
cmux ping                     # 재시도
```

**훅이 작동하지 않음:**
```bash
cat .claude/settings.json | jq '.hooks'   # 경로 확인
ls -la .claude/hooks/*.sh                 # 실행 권한 확인
chmod +x .claude/hooks/*.sh               # 권한 부여
```

**CLI가 작동하지 않음:**
```bash
ls -la /usr/local/bin/cmux
sudo ln -sf "/Applications/cmux.app/Contents/Resources/bin/cmux" /usr/local/bin/cmux
```
