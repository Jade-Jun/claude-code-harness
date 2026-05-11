# 테스트 아키텍처

## 테스트 피라미드

| 층 | 도구 | 범위 | 비율 |
|---|---|---|---|
| Unit | Vitest | 순수 로직 (store, utils, entity) | 가장 많음 |
| Component | Vitest + Testing Library | 컴포넌트 격리 (인터랙션, 렌더링) | 중간 |
| E2E | Playwright | 크리티컬 사용자 여정 10~15개 | 가장 적음 |

## 분류 결정 트리

1. DOM이 필요 없는 순수 함수/상수인가? → **Unit**
2. 단일 컴포넌트/훅의 인터랙션인가? → **Component**
3. 여러 페이지에 걸친 사용자 여정인가? → **E2E**

**경계 판단**: "전체 앱을 띄워야만 검증 가능한가?" 아니면 Component, 그래도 아니면 Unit.

## E2E 범위 제한

**원칙: "이 화면에서 이거 누르면 이게 보인다" — 이것만 검증.**

컴포넌트 내부 동작(드래그 정밀도, 스크롤 발생, 픽셀 단위)은 Component 테스트로 내린다.

## 실행 스크립트

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:e2e:headed": "playwright test --workers=1 --headed",
  "test:e2e:ui": "playwright test --ui",
  "test:all": "vitest run && playwright test"
}
```

## 목킹 전략

| 층 | 방식 |
|---|---|
| Unit | `vi.mock()`, `vi.fn()` |
| Component | MSW 또는 직접 mock |
| E2E (개발 중) | `page.route()` 가로채기 |
| E2E (통합) | 실 백엔드 |
