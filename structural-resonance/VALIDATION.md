# 구조물 공진 실험실 검증

## 구현
- 실행: `structural-resonance.html` (Three.js 0.183.0, 단일 HTML)
- 4층 전단 모형 A/B, 질량 정규화 Jacobi 고유모드, 모드별 점성 감쇠와 RK4 Δt=1/960 s.
- 자유/강제/1~4차 모드, 공진 근처/공진 밖/감쇠 프리셋, 질량·강성·최상층 질량비·가진·B 감쇠 조절.
- 재생/정지/초기화/한 단계, 배속, 정면/사선/자동 카메라, 변위 그래프(최근12초), 실제 최대 층간변위·모드 주파수.
- 모든 물리 파라미터 변경은 시간·입력 위상·이력을 재시작한다. 표시는 A/B·지반 공통 12배이며 수치/그래프는 실제 mm.
- 감쇠 행렬은 질량 정규화 모드 Φ에 대해 C=MΦ diag(2ζω) ΦᵀM에 해당한다. ζ≥0 범위에서 양의 반정부호.

## 수치·구문 검증
실행: `node structural-resonance/validate.cjs` 및 `node --check /tmp/resonance-module.mjs`.
테스트는 HTML의 실제 `Dynamics` 계산 함수를 추출해 실행하며 별도 계산 구현을 복사하지 않는다.

|검증|실측|기준/결과|
|---|---|---|
|1자유도 고유진동수|1.5915494309189535 Hz|√(k/m)/(2π), 오차 <1e-12|
|감쇠 자유진동 해 10초|최대 오차 3.0143e-12 m|<1e-8 m 통과|
|상수 외력 정적 F/k|오차 2.819e-18 m|<1e-10 m 통과|
|27개 질량/강성 조합 모드 잔차|최대 1.2188e-13|정규화 잔차 <1e-8 통과|
|질량 직교성|최대 6.6613e-16|<1e-8 통과|
|최대 고유각주파수|39.2314 rad/s|hω=0.04087|
|무감쇠 자유진동 10초 에너지 drift|3.8148e-7 (0.00003815%)|0.1% 이내 통과|
|감쇠 에너지|매 단계 단조 감소|허용오차 1e-12 통과|
|h, h/2, h/4 RK4 수렴비|16.2015|12~20 통과; h와 h/2 차이 9.1276e-8|
|최대 입력 120초|5 Hz,20 mm,최소 질량,최대 강성,ζ=0/.01/.3|모든 상태 유한값 통과|
|ES module 구문|node --check|통과|

## 브라우저 검증
실행: `flock /tmp/threejs-stem-browser.lock node structural-resonance/browser-check.cjs`.
- 최초 sandbox 실행은 로컬 HTTP listen EPERM으로 실패. 승인된 sandbox 외부 실행으로 검증 완료.
- Chromium/SwiftShader, 실제 CDN 0.183.0, HTTP port 0. 실제 RAF 시간 증가·정지·재생 및 렌더 84 draw calls, 21 frames, context loss 없음.
- 한 단계 1/60초, 초기화, 배속 선택, 정면/사선/자동, 마우스 이동 무반응, 모든 모드/자유진동 전환 통과.
- 60초 공진 강제응답에서 A/B modal state norm 78.6609 / 3.58241, A가 B보다 큰 응답. 이 값은 표시용 물리 변위가 아닌 테스트용 상태 norm.
- 강제응답 가속 실행은 명시적 advance 호출이며 FPS 성능 측정이 아니다. 이력 721개 이하 확인.
- 1440×1000, 390×844, 844×390 화면: 가로 넘침 없음, 모든 조작은 스크롤 접근 가능. `/tmp/resonance-wide.png`, `/tmp/resonance-390.png` 화면 직접 검토 완료.
- reduced-motion 정지/자동 OFF 기본값, visibility·persisted pagehide/pageshow 이벤트, dispose 후 RAF/캔버스 제거, CDN 실패 안내 통과.
- 정상 경로 콘솔·페이지 오류 0건. 실제 BFCache 적중은 검사하지 않았으며 이벤트 경로를 검사했다.
- 브라우저에서 발견한 자동 카메라 OFF 시 위치 복귀를 수정하고 전체 브라우저 검증 재실행 통과.

## 독립 리뷰
별도 Reviewer가 계획과 실제 소스를 검토했다. FPS의 실제 경과 시간 집계 및 정면→자동 카메라 전환 결함 2건을 수정했고 재검토에서 추가 결함이 발견되지 않았다.

## 모델 근거와 한계
- [MIT OpenCourseWare: Modal analysis, orthogonality, mass/stiffness/damping](https://ocw.mit.edu/courses/2-003sc-engineering-dynamics-fall-2011/resources/lecture-24-modal-analysis-orthogonality-mass-stiffness-damping-matrix/)
- [Steeneken: Free damped vibrations](https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Introductory_Dynamics%3A_2D_Kinematics_and_Kinetics_of_Point_Masses_and_Rigid_Bodies_%28Steeneken%29/04%3A_Vibrations_and_Strategy/13%3A_Vibrations/13.03%3A_Free_damped_vibrations)
- 교육용 선형 작은 변위 모형으로 지진 예측·응력·붕괴·설계 판정 기능은 없다. 큰 응답에서도 선형 계산을 유지하며 실제 구조 안전성을 의미하지 않는다.
- 수치/프레임 부하는 한 프레임 192 substep으로 제한하고 느린 기기에서는 실시간보다 느리게 진행할 수 있다.
- CDN 연결·WebGL 필요. 실제 모바일 GPU 및 실제 브라우저 BFCache 적중 여부는 별도 기기 검증 대상이다.

최종 상태: Verified — 구현·수치·구문·실제 브라우저·독립 리뷰 통과.
