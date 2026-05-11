# Claude Code Harness

> Claude Code를 위한 하네스 엔지니어링 스타터 킷.
> 에이전트 팀 · 브랜치 보호 훅 · 워크트리 워크플로우 · 테스트 피라미드가 사전 구성된 Next.js 프로젝트.

---

## 이 프로젝트가 해결하는 문제

Claude Code는 강력하지만, 규칙만으로는 제어가 불충분합니다.

- **"develop에 직접 커밋하지 마"** 라고 써놔도 Auto 모드에서 무시됩니다
- **에이전트가 "사용 안 되는 것 같다"고 판단해서 기능을 삭제**합니다
- **리팩토링 중 import만 끊어서 기능이 사라지는데** 파일은 남아있어 발견이 늦습니다
- **컨텍스트가 길어지면 초반 지시를 잊습니다**

이 프로젝트는 **판단형 룰이 아닌 물리적 차단**으로 이 문제를 해결합니다.

---

## 핵심 구성

### 🔒 하네스 엔지니어링

`hooks/guard-branch.mjs`가 PreToolUse 훅으로 develop/main 브랜치에서 파일 수정 도구(Edit, Write, Update)를 **물리적으로 차단**합니다. 규칙을 "지키도록 부탁"하는 게 아니라 "못 하게 막는" 것입니다.

### 👥 에이전트 팀 시스템

6명의 서브에이전트가 역할 분리되어 메인 세션의 조율 아래 작업합니다.

| 에이전트 | 역할 | 모델 |
|---|---|---|
| 설계자 (architect) | 아키텍처 설계, 영향 범위 분석 | Opus |
| 개발자d (data-engineer) | 데이터 계층 구현 | Sonnet |
| 개발자f (frontend) | UI/스타일 구현 | Sonnet |
| 리뷰어 (reviewer) | 코드 규칙 검증 | Sonnet |
| 검토자 (design-checker) | 디자인 품질 검증 | Sonnet |
| 테스터 (qa) | 기능/엣지케이스 검증 | Sonnet |

메인 세션이 팀장을 겸하며, 서브에이전트 간 직접 소통 없이 PLAN.md를 통해 핸드오프합니다.

### 📋 PLAN.md 기반 상태 관리

작업 상태를 컨텍스트에 누적하지 않고 `PLAN.md` 파일에 기록합니다. 컨텍스트가 날아가도(`/compact`, `/clear`) PLAN.md가 살아있어 맥락 복구가 가능합니다.

### 🌳 워크트리 워크플로우

모든 feature 작업은 Git worktree에서 진행합니다. `scripts/worktree.sh`로 생성/제거하고, `hooks/guard-branch.mjs`가 develop/main 직접 수정을 차단합니다.

### 🧪 테스트 피라미드

| 층 | 도구 | 범위 |
|---|---|---|
| Unit | Vitest | 순수 로직 (store, utils, entity) |
| Component | Vitest + Testing Library | 컴포넌트 격리 (인터랙션, 렌더링) |
| E2E | Playwright | 크리티컬 사용자 여정 10~15개만 |

"이건 Unit인가 Component인가 E2E인가?"의 결정 트리가 `CLAUDE.md`에 내장되어 있어 에이전트가 테스트를 올바른 층에 작성합니다.

---

## 빠른 시작

### 1. 클론 및 설치

```bash
git clone https://github.com/{your-username}/claude-code-harness.git
cd claude-code-harness
pnpm install
```

### 2. Claude Code에서 열기

```bash
claude
```

`CLAUDE.md`가 자동으로 로드되고, `.claude/agents/`의 에이전트 팀이 활성화됩니다.

### 3. 첫 작업 시작

```
새 기능을 만들어줘: 사용자 프로필 페이지
```

메인 세션이 자동으로:
1. 워크트리 생성 (`scripts/worktree.sh create profile`)
2. 설계자 소환하여 구조 설계
3. PLAN.md 작성
4. 개발자 소환하여 구현
5. 리뷰어 + 검토자 소환하여 검증

---

## 디렉토리 구조

```
claude-code-harness/
├── CLAUDE.md                    ← Claude Code 프로젝트 가이드
├── .claude/
│   ├── agents/                  ← 6명 에이전트 역할 정의
│   ├── settings.json            ← 권한 설정
│   ├── team-workflow.md         ← 팀 운용 흐름
│   └── design-review.md        ← 디자인 리뷰 체크리스트
├── hooks/
│   └── guard-branch.mjs        ← 브랜치 보호 훅
├── scripts/
│   └── worktree.sh             ← 워크트리 라이프사이클
├── docs/
│   ├── design-decisions-log.md  ← 설계 결정 로그
│   ├── testing-architecture.md  ← 테스트 전략 설계
│   └── dependency-map/          ← 의존성 추적 문서
├── templates/
│   └── PLAN.md                  ← 작업 계획서 템플릿
├── src/                         ← Next.js 앱 스켈레톤
│   ├── app/                     ← App Router
│   ├── data/                    ← Entity, Domain, UseCase, Repository
│   ├── presenter/               ← Component, ViewModel, View (3파일 세트)
│   ├── store/                   ← 상태 관리
│   └── lib/                     ← 유틸, 훅
├── e2e/                         ← Playwright E2E 테스트
├── vitest.config.ts
└── playwright.config.ts
```

---

## 커스터마이즈 가이드

이 프로젝트는 **스타터 킷**입니다. 클론 후 프로젝트에 맞게 수정하세요.

### 에이전트 팀 조정

- 1인 개발: 개발자d + 개발자f를 하나의 `developer.md`로 통합
- 프로토타입 단계: 개발자f + 검토자 + 리뷰어 3명만 운용
- 디자인 시스템 없음: `design-checker.md` 제거

### CLAUDE.md 규칙 조정

- 상태 관리: Jotai → Redux, Zustand 등으로 변경
- 스타일링: Tailwind → CSS Modules, styled-components 등으로 변경
- 테이블: TanStack Table 관련 규칙 제거/변경
- 아키텍처: 3파일 세트를 프로젝트 구조에 맞게 조정

### 훅 조정

- `hooks/guard-branch.mjs`: 보호할 브랜치명 변경 (기본: main, develop)
- verify 훅 추가: PostToolUse에 tsc, lint, 커스텀 검증 스크립트 연결

---

## 배경

이 프로젝트는 보안 컴플라이언스 점검 솔루션을 Claude Code로 개발하면서 6개월간 축적한 패턴입니다.

초기에는 CLAUDE.md에 규칙을 적는 것만으로 충분할 거라 생각했지만, 실제 운용에서 다음을 발견했습니다:

- **판단형 룰은 Auto 모드에서 무시된다** → PreToolUse 훅으로 물리 차단 도입
- **단일 에이전트는 설계와 구현을 동시에 잘 못한다** → 역할 분리 에이전트 팀 도입
- **컨텍스트가 길어지면 작업 상태를 잃는다** → PLAN.md 기반 영속 상태 관리 도입
- **E2E에 모든 테스트를 넣으면 유지보수가 터진다** → 테스트 피라미드 결정 트리 도입

각 결정의 상세 근거는 `docs/design-decisions-log.md`에 기록되어 있습니다.

---

## 라이선스

MIT License
