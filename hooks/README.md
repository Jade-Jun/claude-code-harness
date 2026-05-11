# 하네스 엔지니어링 훅

## guard-branch.mjs

### 역할
develop/main 브랜치에서 파일 수정 도구(Edit, Write, Update, Create)를 **물리적으로 차단**한다.

### 왜 필요한가
CLAUDE.md에 "develop에 직접 커밋하지 마"라고 적어도 Auto 모드에서 무시되는 사례가 반복되었다.
판단형 룰은 컨텍스트가 길어지면 우선순위가 밀리고, "이번만 예외"라는 임의 판단이 발생한다.
물리적 차단은 예외 없이 작동한다.

### 설치
`.claude/settings.json`에 이미 등록되어 있다. 레포를 클론하면 자동으로 활성화.

### 커스터마이즈
`guard-branch.mjs` 상단의 `PROTECTED_BRANCHES` 배열을 프로젝트에 맞게 수정:

```javascript
const PROTECTED_BRANCHES = ['main', 'develop', 'master'];
```

### 추가 훅 만들기
PostToolUse 훅으로 커밋 후 자동 검증을 추가할 수 있다:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hook": "node hooks/verify-commit.mjs"
      }
    ]
  }
}
```

`verify-commit.mjs` 예시: tsc --noEmit + eslint 자동 실행.
