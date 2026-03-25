#!/bin/bash
# SessionStart 훅: cmux 사이드바 초기화 + 개발 환경 자동 구성
# cmux 없는 환경에서는 조용히 종료

INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"' 2>/dev/null || echo "unknown")
CWD=$(echo "$INPUT" | jq -r '.cwd // "."' 2>/dev/null || echo ".")
PROJECT_NAME=$(basename "$CWD")

# cmux 없으면 종료
if ! cmux ping &>/dev/null; then
  exit 0
fi

# ─── 1. cmux 네이티브 Claude 훅 신호 ────────────────
cmux claude-hook session-start 2>/dev/null || true

# ─── 2. 사이드바 초기화 ─────────────────────────────
cmux set-status "project" "$PROJECT_NAME" --icon "folder" --color "#4f9cf9" 2>/dev/null || true
cmux set-status "agent" "활성" --icon "activity" --color "#22c55e" 2>/dev/null || true
cmux log "세션 시작: ${SESSION_ID:0:8} | $PROJECT_NAME" --level "info" --source "claude" 2>/dev/null || true
cmux rename-workspace "[$PROJECT_NAME]" 2>/dev/null || true

# ─── 3. 레이아웃 자동 구성 (Dev Server + Browser) ────
# 이미 Dev Server pane이 있으면 건너뜀
TREE_OUTPUT=$(cmux tree 2>/dev/null || echo "")
if echo "$TREE_OUTPUT" | grep -q "Dev Server"; then
  exit 0
fi

DEV_URL="http://localhost:3000"

# 오른쪽 pane 분할 → Dev Server 터미널
SPLIT_OUTPUT=$(cmux new-split right 2>/dev/null || echo "")
DEV_SURFACE=$(echo "$SPLIT_OUTPUT" | grep -o 'surface:[0-9]*')

if [ -n "$DEV_SURFACE" ]; then
  cmux rename-tab --surface "$DEV_SURFACE" "Dev Server" 2>/dev/null || true

  # 이미 3000 포트가 사용 중이면 서버 시작 생략
  if lsof -ti:3000 &>/dev/null; then
    cmux send --surface "$DEV_SURFACE" "echo '✅ Dev server already on $DEV_URL'" 2>/dev/null || true
  else
    cmux send --surface "$DEV_SURFACE" "cd '$CWD' && npm run dev" 2>/dev/null || true
  fi
  cmux send-key --surface "$DEV_SURFACE" enter 2>/dev/null || true
fi

# 브라우저 패널 열기 (서버 준비 전이라도 열림 → 자동 새로고침)
cmux browser open-split "$DEV_URL" 2>/dev/null || true

# 사이드바 서버 상태
cmux set-status "dev-server" "$DEV_URL" --icon "globe" --color "#22c55e" 2>/dev/null || true

# Claude 터미널로 포커스 복귀
cmux focus-pane --pane "pane:1" 2>/dev/null || true

exit 0
