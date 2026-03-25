#!/bin/bash
# cmux 사이드바 에이전트 상태 업데이트 헬퍼
#
# 사용법:
#   bash .claude/cmux/agent-status.sh start  "분석 중..." 0.1
#   bash .claude/cmux/agent-status.sh update 0.5 "구현 중..."
#   bash .claude/cmux/agent-status.sh done   "구현 완료"
#   bash .claude/cmux/agent-status.sh error  "빌드 오류"
#   bash .claude/cmux/agent-status.sh log    "파일 수정: components/foo.tsx"

COMMAND="${1:-help}"

# cmux 없는 환경에서 조용히 종료
if ! cmux ping &>/dev/null; then
  exit 0
fi

case "$COMMAND" in
  start)
    LABEL="${2:-작업 중...}"
    PROGRESS="${3:-0.1}"
    cmux set-status "agent" "$LABEL" --icon "activity" --color "#f59e0b" 2>/dev/null || true
    cmux set-progress "$PROGRESS" --label "$LABEL" 2>/dev/null || true
    cmux log "시작: $LABEL" --level "info" --source "claude" 2>/dev/null || true
    ;;

  update)
    PROGRESS="${2:-0.5}"
    LABEL="${3:-진행 중...}"
    cmux set-progress "$PROGRESS" --label "$LABEL" 2>/dev/null || true
    ;;

  done)
    LABEL="${2:-완료}"
    cmux clear-progress 2>/dev/null || true
    cmux set-status "agent" "$LABEL" --icon "check-circle" --color "#22c55e" 2>/dev/null || true
    cmux notify --title "Claude Code" --subtitle "insite-web" --body "$LABEL" 2>/dev/null || true
    cmux log "완료: $LABEL" --level "success" --source "claude" 2>/dev/null || true
    ;;

  error)
    LABEL="${2:-오류 발생}"
    cmux clear-progress 2>/dev/null || true
    cmux set-status "agent" "$LABEL" --icon "alert-circle" --color "#ef4444" 2>/dev/null || true
    cmux notify --title "Claude Code" --subtitle "insite-web" --body "$LABEL" 2>/dev/null || true
    cmux log "오류: $LABEL" --level "error" --source "claude" 2>/dev/null || true
    ;;

  warn)
    LABEL="${2:-경고}"
    cmux set-status "agent" "$LABEL" --icon "alert-triangle" --color "#f59e0b" 2>/dev/null || true
    cmux log "경고: $LABEL" --level "warning" --source "claude" 2>/dev/null || true
    ;;

  log)
    MESSAGE="${2:-}"
    [ -z "$MESSAGE" ] && exit 0
    cmux log "$MESSAGE" --source "claude" 2>/dev/null || true
    ;;

  clear)
    cmux clear-progress 2>/dev/null || true
    cmux set-status "agent" "대기 중" --icon "circle" --color "#94a3b8" 2>/dev/null || true
    ;;

  status)
    cmux sidebar-state 2>/dev/null | jq '.' 2>/dev/null || \
      echo "cmux sidebar-state 조회 실패"
    ;;

  help|--help|-h|*)
    echo "사용법: $(basename "$0") <명령> [인수...]"
    echo ""
    echo "명령:"
    echo "  start  <레이블> [진행률]   작업 시작 표시 (진행률: 0.0~1.0)"
    echo "  update <진행률> <레이블>   진행률 업데이트"
    echo "  done   [레이블]            작업 완료 + 알림"
    echo "  error  <메시지>            오류 표시 + 알림"
    echo "  warn   <메시지>            경고 표시"
    echo "  log    <메시지>            로그 기록"
    echo "  clear                      상태 초기화"
    echo "  status                     현재 사이드바 상태 조회"
    exit 0
    ;;
esac
