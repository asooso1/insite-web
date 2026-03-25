#!/bin/bash
# insite-web 개발 환경을 cmux에서 자동으로 설정
# Claude Code + Dev Server + Browser Preview 레이아웃
#
# 사용법:
#   bash .claude/cmux/workspace-layout.sh           # 수동 실행
#   bash .claude/cmux/workspace-layout.sh --auto    # 자동 실행 (SessionStart 훅)
#   bash .claude/cmux/workspace-layout.sh --minimal # 터미널만 (브라우저 없음)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PROJECT_NAME="$(basename "$PROJECT_ROOT")"
DEV_URL="http://localhost:3000"
MODE="${1:---full}"

SILENT=false
[ "$MODE" = "--auto" ] && SILENT=true

log() { [ "$SILENT" = false ] && echo "$1" || true; }

# cmux 실행 확인 (최대 5회 재시도)
PING_OK=false
for _i in 1 2 3 4 5; do
  if cmux ping &>/dev/null; then
    PING_OK=true
    break
  fi
  sleep 1
done
if [ "$PING_OK" = false ]; then
  log "cmux가 실행 중이 아닙니다. cmux 앱을 먼저 실행하세요."
  exit 0
fi

# 사이드바 상태 업데이트
cmux set-status "agent" "활성" --icon "activity" --color "#22c55e" 2>/dev/null || true
cmux set-status "project" "$PROJECT_NAME" --icon "folder" --color "#4f9cf9" 2>/dev/null || true
cmux rename-workspace "[$PROJECT_NAME]" 2>/dev/null || true

# Dev Server pane이 이미 있는지 확인
TREE_OUTPUT=$(cmux tree 2>/dev/null || echo "")
if echo "$TREE_OUTPUT" | grep -q "Dev Server"; then
  log "Dev Server pane 이미 존재함 - 건너뜀"
  cmux clear-progress 2>/dev/null || true
  exit 0
fi

# 개발 서버 이미 실행 중인지 확인
DEV_ALREADY_RUNNING=false
lsof -ti:3000 &>/dev/null && DEV_ALREADY_RUNNING=true

log "insite-web 개발 환경 설정 중..."
cmux set-progress 0.2 --label "Dev Server 터미널 생성 중..." 2>/dev/null || true

# 오른쪽 pane 분할
log "  [1/3] 터미널 분할 중..."
SPLIT_OUTPUT=$(cmux new-split right 2>/dev/null || echo "")
DEV_SURFACE=$(echo "$SPLIT_OUTPUT" | grep -o 'surface:[0-9]*')

if [ -n "$DEV_SURFACE" ]; then
  cmux rename-tab --surface "$DEV_SURFACE" "Dev Server" 2>/dev/null || true

  if [ "$DEV_ALREADY_RUNNING" = false ]; then
    cmux send --surface "$DEV_SURFACE" "cd '$PROJECT_ROOT' && npm run dev" 2>/dev/null || true
    cmux send-key --surface "$DEV_SURFACE" enter 2>/dev/null || true
    log "  npm run dev 시작됨 ($DEV_SURFACE)"
  else
    cmux send --surface "$DEV_SURFACE" "echo 'Dev server already on $DEV_URL'" 2>/dev/null || true
    cmux send-key --surface "$DEV_SURFACE" enter 2>/dev/null || true
    log "  개발 서버 이미 실행 중"
  fi
else
  log "  터미널 분할 실패 (출력: '$SPLIT_OUTPUT')"
fi

cmux set-progress 0.5 --label "개발 서버 응답 대기 중..." 2>/dev/null || true

# 개발 서버 응답 대기
log "  [2/3] 개발 서버 응답 대기 중..."
DEV_READY=false
for i in $(seq 1 25); do
  if curl -s --max-time 1 "$DEV_URL" &>/dev/null; then
    log "  서버 준비됨 (${i}초)"
    DEV_READY=true
    break
  fi
  sleep 1
done
[ "$DEV_READY" = false ] && log "  서버 응답 없음 (25초 초과)"

# 브라우저 패널
if [ "$MODE" != "--minimal" ]; then
  log "  [3/3] 브라우저 패널 오픈 중..."
  cmux browser open-split "$DEV_URL" 2>/dev/null \
    && log "  브라우저 준비됨" \
    || log "  브라우저 패널 생성 실패"
fi

# 사이드바 완료 상태
if [ "$DEV_READY" = true ]; then
  cmux set-status "dev-server" "$DEV_URL" --icon "globe" --color "#22c55e" 2>/dev/null || true
else
  cmux set-status "dev-server" "시작 중..." --icon "zap" --color "#f59e0b" 2>/dev/null || true
fi
cmux set-progress 1.0 --label "환경 설정 완료" 2>/dev/null || true
sleep 1
cmux clear-progress 2>/dev/null || true

# Claude 터미널로 포커스 복귀
cmux focus-pane --pane "pane:1" 2>/dev/null || true

# 완료 알림
cmux notify --title "insite-web 준비됨" --subtitle "$PROJECT_NAME" --body "Claude + Dev Server + 브라우저 설정 완료" 2>/dev/null || true

log ""
log "  +------------------+-------------------+"
log "  |  Claude Code     |  npm run dev      |"
log "  |  (이 창)          |  $DEV_URL         |"
log "  +------------------+-------------------+"
log "  |         브라우저 미리보기              |"
log "  +---------------------------------------+"

exit 0
