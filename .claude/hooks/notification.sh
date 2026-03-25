#!/bin/bash
# Notification 훅: Claude 알림을 cmux 네이티브 알림으로 전달
# cmux 없는 환경에서는 macOS 네이티브 알림으로 폴백

INPUT=$(cat)
MESSAGE=$(echo "$INPUT" | jq -r '.message // ""' 2>/dev/null || echo "")
TITLE=$(echo "$INPUT" | jq -r '.title // "Claude Code"' 2>/dev/null || echo "Claude Code")

# 빈 메시지 무시
if [ -z "$MESSAGE" ]; then
  exit 0
fi

# cmux가 실행 중인 경우: cmux 네이티브 알림
if cmux ping &>/dev/null; then
  cmux claude-hook notification 2>/dev/null || true
  cmux notify --title "$TITLE" --body "$MESSAGE" 2>/dev/null || true
  cmux set-status "alert" "$MESSAGE" --icon "bell" --color "#f59e0b" 2>/dev/null || true
  exit 0
fi

# 폴백: macOS 네이티브 알림 (cmux 없을 때)
osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\"" 2>/dev/null || true

exit 0
