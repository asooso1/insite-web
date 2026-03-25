#!/bin/bash
# insite-web cmux 개발 환경 원클릭 셋업
#
# 사용법:
#   bash scripts/setup-cmux.sh          # 전체 셋업
#   bash scripts/setup-cmux.sh --check  # 환경 확인만
#   bash scripts/setup-cmux.sh --skip-deps  # 의존성 설치 생략

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MODE="${1:-}"
ERRORS=0
WARNINGS=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

ok()   { echo -e "  ${GREEN}OK${NC} $1"; }
warn() { echo -e "  ${YELLOW}!!${NC} $1"; WARNINGS=$((WARNINGS + 1)); }
fail() { echo -e "  ${RED}XX${NC} $1"; ERRORS=$((ERRORS + 1)); }
info() { echo -e "  ${BLUE}->${NC} $1"; }
hr()   { echo ""; echo "=============================================="; echo ""; }

clear
echo ""
echo -e "${BOLD}  insite-web - cmux 개발 환경 셋업${NC}"
echo "  Next.js 15 + Claude Code + cmux 통합"
hr

# 1. cmux 설치 확인
echo -e "${BOLD}[1/6] cmux 확인${NC}"
echo ""

CMUX_BIN="/Applications/cmux.app/Contents/Resources/bin/cmux"

if [ -x "$CMUX_BIN" ]; then
  export PATH="/Applications/cmux.app/Contents/Resources/bin:$PATH"
  ok "cmux 발견: $CMUX_BIN"
elif command -v cmux &>/dev/null; then
  ok "cmux 발견: $(which cmux)"
else
  fail "cmux가 설치되어 있지 않습니다"
  echo ""
  echo "  설치 방법:"
  echo "    DMG: https://github.com/manaflow-ai/cmux/releases/latest/download/cmux-macos.dmg"
  echo "    Homebrew: brew tap manaflow-ai/cmux && brew install --cask cmux"
  echo ""
  echo -e "  ${YELLOW}참고:${NC} cmux 없이도 Claude Code는 정상 작동합니다."
  echo ""

  if [ "$MODE" = "--check" ]; then
    exit 1
  fi

  read -rp "  cmux 없이 계속 진행하시겠습니까? [y/N] " REPLY
  if [[ ! "$REPLY" =~ ^[Yy]$ ]]; then
    exit 1
  fi
  CMUX_AVAILABLE=false
fi

# cmux 실행 중인지 확인
if cmux ping &>/dev/null; then
  ok "cmux 실행 중 (소켓 연결됨)"
  CMUX_AVAILABLE=true
else
  warn "cmux 앱이 실행 중이 아닙니다 (셋업 후 실행 필요)"
  CMUX_AVAILABLE=false
fi

# CLI 심볼릭 링크 확인
if [ -x "$CMUX_BIN" ] && [ ! -L "/usr/local/bin/cmux" ]; then
  info "CLI 심볼릭 링크가 없습니다. 다음 명령으로 생성하세요:"
  info "sudo ln -sf \"$CMUX_BIN\" /usr/local/bin/cmux"
fi

# 2. 쉘 통합 설정
hr
echo -e "${BOLD}[2/6] 쉘 통합 설정${NC}"
echo ""

setup_shell_integration() {
  local SHELL_RC INTEGRATION_FILE SHELL_NAME

  if [ -n "$ZSH_VERSION" ] || [ "$SHELL" = "/bin/zsh" ]; then
    SHELL_NAME="zsh"
    SHELL_RC="$HOME/.zshrc"
    INTEGRATION_FILE="/Applications/cmux.app/Contents/Resources/shell-integration/cmux-zsh-integration.zsh"
  elif [ -n "$BASH_VERSION" ] || [ "$SHELL" = "/bin/bash" ]; then
    SHELL_NAME="bash"
    SHELL_RC="$HOME/.bashrc"
    INTEGRATION_FILE="/Applications/cmux.app/Contents/Resources/shell-integration/cmux-bash-integration.bash"
  else
    warn "지원하지 않는 쉘 ($SHELL) - 수동 설정 필요"
    return
  fi

  if [ ! -f "$INTEGRATION_FILE" ]; then
    warn "쉘 통합 파일 없음: $INTEGRATION_FILE"
    return
  fi

  if ! grep -q "cmux.app.*bin" "$SHELL_RC" 2>/dev/null; then
    {
      echo ""
      echo "# cmux 셋업 (insite-web) - $(date +%Y-%m-%d)"
      echo "export PATH=\"/Applications/cmux.app/Contents/Resources/bin:\$PATH\""
      echo "source '$INTEGRATION_FILE'"
    } >> "$SHELL_RC"
    ok "쉘 통합 추가됨: $SHELL_RC"
    info "적용: source $SHELL_RC"
  else
    ok "쉘 통합 이미 설정됨 ($SHELL_NAME)"
  fi

  export PATH="/Applications/cmux.app/Contents/Resources/bin:$PATH"
}

setup_shell_integration

# 3. 스크립트 실행 권한
hr
echo -e "${BOLD}[3/6] 스크립트 실행 권한 설정${NC}"
echo ""

chmod +x "$PROJECT_ROOT/.claude/hooks/"*.sh 2>/dev/null && ok ".claude/hooks/*.sh 실행 권한" || warn ".claude/hooks/ 권한 설정 실패"
chmod +x "$PROJECT_ROOT/.claude/cmux/"*.sh 2>/dev/null && ok ".claude/cmux/*.sh 실행 권한" || warn ".claude/cmux/ 권한 설정 실패"
chmod +x "$PROJECT_ROOT/scripts/"*.sh 2>/dev/null && ok "scripts/*.sh 실행 권한" || warn "scripts/ 권한 설정 실패"

# 4. Claude Code 확인
hr
echo -e "${BOLD}[4/6] Claude Code 확인${NC}"
echo ""

if command -v claude &>/dev/null; then
  CLAUDE_VER=$(claude --version 2>/dev/null || echo "버전 확인 불가")
  ok "Claude Code: $CLAUDE_VER"
else
  fail "Claude Code가 설치되어 있지 않습니다"
  echo "  설치: npm install -g @anthropic-ai/claude-code"
fi

# 5. Node.js 의존성
hr
echo -e "${BOLD}[5/6] Node.js 의존성${NC}"
echo ""

if ! command -v node &>/dev/null; then
  fail "Node.js가 설치되어 있지 않습니다 (https://nodejs.org)"
elif ! command -v npm &>/dev/null; then
  fail "npm이 설치되어 있지 않습니다"
else
  NODE_VER=$(node --version)
  ok "Node.js: $NODE_VER"

  if [ "$MODE" != "--skip-deps" ]; then
    if [ ! -d "$PROJECT_ROOT/node_modules" ] || [ ! -f "$PROJECT_ROOT/node_modules/.package-lock.json" ]; then
      info "node_modules 설치 중..."
      cd "$PROJECT_ROOT" && npm install --prefer-offline 2>&1 | tail -3
      ok "의존성 설치 완료"
    else
      ok "의존성 이미 설치됨"
    fi
  else
    info "의존성 설치 생략 (--skip-deps)"
  fi
fi

# 6. 설정 파일 확인
hr
echo -e "${BOLD}[6/6] 설정 파일 확인${NC}"
echo ""

SETTINGS_FILE="$PROJECT_ROOT/.claude/settings.json"
if [ -f "$SETTINGS_FILE" ]; then
  if grep -q "/Users/" "$SETTINGS_FILE" 2>/dev/null; then
    warn "settings.json에 하드코딩된 절대 경로 감지됨"
  else
    ok "settings.json 포터블 경로 사용 중"
  fi

  HOOK_COUNT=$(grep -c '"type": "command"' "$SETTINGS_FILE" 2>/dev/null || echo "0")
  ok "설정된 훅: ${HOOK_COUNT}개"
else
  fail "settings.json 파일이 없습니다: $SETTINGS_FILE"
fi

# cmux.json 확인
CMUX_JSON="$PROJECT_ROOT/cmux.json"
if [ -f "$CMUX_JSON" ]; then
  CMD_COUNT=$(python3 -c "import json; print(len(json.load(open('$CMUX_JSON'))['commands']))" 2>/dev/null || echo "?")
  ok "cmux.json 발견 (명령 ${CMD_COUNT}개)"
else
  warn "cmux.json 없음 - 프로젝트 명령어 미설정"
fi

# 결과 요약
hr
echo -e "${BOLD}  셋업 결과${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "  ${GREEN}모든 설정이 완료되었습니다!${NC}"
elif [ $ERRORS -eq 0 ]; then
  echo -e "  ${YELLOW}경고 ${WARNINGS}개 있음 (동작에는 영향 없음)${NC}"
else
  echo -e "  ${RED}오류 ${ERRORS}개, 경고 ${WARNINGS}개${NC}"
  echo "     위 항목을 해결 후 다시 실행하세요."
fi

hr
echo -e "${BOLD}  시작 방법${NC}"
echo ""
echo "  1. cmux.json 명령어 실행 (권장):"
echo -e "     ${BLUE}cmux 앱에서 프로젝트 폴더 열기 -> 명령어 팔레트에서 'Dev Environment' 선택${NC}"
echo ""
echo "  2. 수동 레이아웃 설정:"
echo -e "     ${BLUE}bash .claude/cmux/workspace-layout.sh${NC}"
echo ""
echo "  3. 멀티 에이전트 실행:"
echo -e "     ${BLUE}bash .claude/cmux/multi-agent-launch.sh feature '기능 설명'${NC}"
echo -e "     ${BLUE}bash .claude/cmux/multi-agent-launch.sh review${NC}"
echo ""
echo "  4. 일반 실행 (cmux 없이):"
echo -e "     ${BLUE}npm run dev${NC}   # 개발 서버"
echo -e "     ${BLUE}claude${NC}        # Claude Code"
echo ""
