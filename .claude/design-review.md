# 디자인 리뷰 체크리스트

UI 변경 작업 완료 후 아래 항목을 검증한다.

## 레이아웃
- [ ] calc(100vh - ...) 패턴 없음 (flex 구조 사용)
- [ ] 카드 간격, 섹션 간격이 프로젝트 규정 값과 일치
- [ ] 카드 내부 패딩이 일관적
- [ ] 라운드 값이 프로젝트 규정과 일치

## 색상/스타일
- [ ] Semantic 변수(`--sem-*`)를 우선 사용
- [ ] Primitive 직접 사용은 Semantic에 없을 때만
- [ ] hex 하드코딩 없음 (차트 라이브러리 예외)
- [ ] `bg-[#hex]`, `style={{ color: '#hex' }}`, `rgba()` 직접 사용 없음
- [ ] `--todo-*` 사용 시 "디자인팀 등록 요청" 주석 있음
- [ ] Tailwind 기본 색상 직접 사용 없음

## 타이포그래피
- [ ] 각 역할(본문/라벨/배지/KPI)에 맞는 폰트 크기/굵기

## 아키텍처
- [ ] View에서 Repository/UseCase 직접 호출 없음
- [ ] page.tsx에 'use client' 없음
- [ ] Entity에 initData 있음

## AI 슬롭 체크
- [ ] 과도한 그라데이션 없음
- [ ] 불필요한 이모지 없음
- [ ] 둥근 모서리 과용 없음
- [ ] 그림자 과용 없음
- [ ] 불필요한 애니메이션 없음

## 의존성 문서 갱신

코드 리뷰 완료 후, 아래 조건에 해당하면 `docs/dependency-map/`의 해당 문서를 갱신한다.

| 변경 내용 | 갱신 대상 파일 |
|----------|-------------|
| 공용 컴포넌트 추가/삭제 | `component-usage.md` |
| store atom/slice 추가/변경 | `store-map.md` |
| 라우트 추가/변경 | `route-map.md` |
| Entity/ViewModel 변경 | `entity-viewmodel.md` |
