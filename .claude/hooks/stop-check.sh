#!/bin/bash
# Stop 훅: 세션 종료 시 미커밋 변경사항 안내 + cmux 상태 초기화

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# cmux 정리
if cmux ping &>/dev/null; then
  cmux claude-hook stop 2>/dev/null || true
  cmux clear-progress 2>/dev/null || true
  cmux set-status "agent" "종료됨" --icon "circle" --color "#94a3b8" 2>/dev/null || true
  cmux notify --title "Claude Code" --subtitle "$(basename "$PROJECT_ROOT")" --body "세션이 종료되었습니다." 2>/dev/null || true
  cmux log "세션 종료" --level "info" --source "claude" 2>/dev/null || true
fi

# .omc/, CLAUDE.md 등 비소스 파일 제외하고 실제 소스 변경사항 확인
CHANGES=$(git -C "$PROJECT_ROOT" status --short 2>/dev/null \
  | grep -v "^??" \
  | grep -v "\.omc/\|CLAUDE\.md\|\.claude/\|settings\.json")

if [ -n "$CHANGES" ]; then
  COUNT=$(echo "$CHANGES" | wc -l | tr -d ' ')
  jq -n --arg msg "미커밋 소스 변경사항 ${COUNT}개 있음. 커밋 전 /pre-commit 검증 권장." \
    '{"hookSpecificOutput": {"hookEventName": "Stop", "additionalContext": $msg}}'
fi
