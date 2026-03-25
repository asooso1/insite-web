#!/bin/bash
# 멀티 에이전트 병렬 실행 스크립트
# cmux claude-teams를 활용하여 병렬 Claude Code 에이전트 실행
#
# 사용법:
#   bash .claude/cmux/multi-agent-launch.sh feature  "기능 설명"
#   bash .claude/cmux/multi-agent-launch.sh review
#   bash .claude/cmux/multi-agent-launch.sh debug    "버그 설명"
#   bash .claude/cmux/multi-agent-launch.sh build

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
MODE="${1:-feature}"
TASK_DESC="${2:-}"

usage() {
  echo "사용법: $(basename "$0") <모드> [\"작업 설명\"]"
  echo ""
  echo "모드:"
  echo "  feature  <설명>  기능 개발 (분석 + 구현 + 검증)"
  echo "  review           전체 코드 리뷰 (품질 + 보안 + 성능)"
  echo "  debug    <설명>  버그 분석 및 수정"
  echo "  build            빌드 오류 자동 수정"
  echo "  qa               QA 테스트 (브라우저 자동화)"
  echo ""
  echo "예시:"
  echo "  $(basename "$0") feature '건물 목록 페이지에 엑셀 다운로드 추가'"
  echo "  $(basename "$0") review"
  echo "  $(basename "$0") debug '로그인 후 대시보드 이동 시 404 오류'"
  exit 0
}

[ "$MODE" = "--help" ] || [ "$MODE" = "-h" ] && usage

# cmux 실행 확인
CMUX_AVAILABLE=false
if cmux ping &>/dev/null; then
  CMUX_AVAILABLE=true
fi

show_status() {
  local label="$1"
  local icon="${2:-activity}"
  local color="${3:-#f59e0b}"
  echo "  -> $label"
  if [ "$CMUX_AVAILABLE" = true ]; then
    cmux set-status "agent" "$label" --icon "$icon" --color "$color" 2>/dev/null || true
  fi
}

cd "$PROJECT_ROOT"

echo ""
echo "멀티 에이전트 모드: $MODE"
[ -n "$TASK_DESC" ] && echo "   작업: $TASK_DESC"
echo ""

case "$MODE" in
  feature)
    if [ -z "$TASK_DESC" ]; then
      echo "기능 설명이 필요합니다."
      echo "   예: $(basename "$0") feature '건물 목록 페이지에 엑셀 다운로드 추가'"
      exit 1
    fi

    show_status "기능 개발 시작" "zap" "#4f9cf9"

    if [ "$CMUX_AVAILABLE" = true ]; then
      cmux claude-teams \
        --dangerously-skip-permissions \
        --add-dir "$PROJECT_ROOT" \
        -p "다음 기능을 구현해주세요: $TASK_DESC

        /oh-my-claudecode:ultrawork" \
        2>/dev/null || {
          echo "  (단일 에이전트 모드로 실행)"
          claude --dangerously-skip-permissions \
            -p "$TASK_DESC - /oh-my-claudecode:ralph" 2>/dev/null || claude
        }
    else
      echo "  cmux 없음 - 단일 에이전트 모드"
      claude
    fi
    ;;

  review)
    show_status "코드 리뷰 중" "search" "#8b5cf6"

    if [ "$CMUX_AVAILABLE" = true ]; then
      cmux claude-teams \
        --dangerously-skip-permissions \
        --add-dir "$PROJECT_ROOT" \
        -p "/oh-my-claudecode:code-review" \
        2>/dev/null || {
          claude --dangerously-skip-permissions \
            -p "/oh-my-claudecode:code-review"
        }
    else
      claude -p "/oh-my-claudecode:code-review"
    fi
    ;;

  debug)
    if [ -z "$TASK_DESC" ]; then
      echo "버그 설명이 필요합니다."
      echo "   예: $(basename "$0") debug '로그인 후 대시보드 이동 시 404 오류'"
      exit 1
    fi

    show_status "버그 분석 중" "alert-circle" "#ef4444"

    if [ "$CMUX_AVAILABLE" = true ]; then
      cmux claude-teams \
        --dangerously-skip-permissions \
        --add-dir "$PROJECT_ROOT" \
        -p "다음 버그를 분석하고 수정해주세요: $TASK_DESC

        /oh-my-claudecode:analyze" \
        2>/dev/null || {
          claude --dangerously-skip-permissions \
            -p "버그 수정: $TASK_DESC"
        }
    else
      echo "  cmux 없음 - 단일 에이전트 모드"
      claude
    fi
    ;;

  build)
    show_status "빌드 오류 분석 중" "tool" "#f59e0b"
    echo "  빌드 실행 후 오류 자동 수정..."

    BUILD_OUTPUT=$(npm run build 2>&1 || true)
    echo "$BUILD_OUTPUT" | tail -30

    if echo "$BUILD_OUTPUT" | grep -qiE "error TS|Type error|Build failed"; then
      echo ""
      echo "  빌드 오류 발견 -> build-fixer 에이전트 실행"
      show_status "빌드 오류 수정 중" "tool" "#ef4444"

      ERROR_SNIPPET=$(echo "$BUILD_OUTPUT" | grep -A3 -B1 -iE "error TS|Type error" | head -40)

      if [ "$CMUX_AVAILABLE" = true ]; then
        cmux claude-teams \
          --dangerously-skip-permissions \
          --add-dir "$PROJECT_ROOT" \
          -p "다음 빌드 오류를 수정해주세요:

$ERROR_SNIPPET

/oh-my-claudecode:build-fix" \
          2>/dev/null || {
            claude --dangerously-skip-permissions \
              -p "빌드 오류 수정: $ERROR_SNIPPET"
          }
      else
        claude --dangerously-skip-permissions \
          -p "빌드 오류 수정: $ERROR_SNIPPET"
      fi
    else
      echo ""
      echo "  빌드 성공!"
      if [ "$CMUX_AVAILABLE" = true ]; then
        cmux notify --title "빌드 성공" --body "insite-web 빌드가 완료되었습니다." 2>/dev/null || true
        cmux set-status "agent" "빌드 성공" --icon "check-circle" --color "#22c55e" 2>/dev/null || true
      fi
    fi
    ;;

  qa)
    show_status "QA 테스트 중" "monitor" "#06b6d4"

    DEV_URL="http://localhost:3000"
    if ! curl -s --max-time 2 "$DEV_URL" &>/dev/null; then
      echo "  개발 서버가 실행 중이 아닙니다."
      echo "     먼저 npm run dev 실행 후 다시 시도하세요."
      exit 1
    fi

    if [ "$CMUX_AVAILABLE" = true ]; then
      cmux browser open-split "$DEV_URL" 2>/dev/null || true

      cmux claude-teams \
        --dangerously-skip-permissions \
        --add-dir "$PROJECT_ROOT" \
        -p "다음 URL의 UI를 QA 테스트해주세요: $DEV_URL

        cmux browser 도구를 활용하여:
        1. 주요 페이지 스크린샷
        2. 콘솔 오류 확인
        3. 접근성 검사
        4. 반응형 레이아웃 확인" \
        2>/dev/null || {
          echo "  단일 에이전트 QA 모드"
          claude
        }
    else
      echo "  cmux 없음 - 브라우저 자동화 불가"
      echo "     수동으로 $DEV_URL 에서 테스트하세요."
    fi
    ;;

  *)
    echo "알 수 없는 모드: $MODE"
    usage
    ;;
esac
