# 열전도 단면 실험실 검증

## 산출물과 범위

- 진입점: `heat-diffusion/heat-diffusion.html` (독립 단일 HTML, Three.js 0.183.0).
- 갤러리 설명: **직육면체 내부의 열확산을 X/Y/Z 단면과 탐침으로 관찰하고, 단열·고정온도 경계·중앙 체적 가열을 비교합니다.**
- 이 작업은 heat-diffusion/만 변경. 공통 메뉴와 루트 README 등록은 통합 작업 담당.
- `numerical-test.cjs`: HTML의 실제 physics script를 vm으로 실행. 복사된 별개 계산식을 구현 테스트로 대체하지 않음.
- `browser-test.cjs`: 실제 RAF와 WSL Chromium/SwiftShader로 실행하는 재현 가능한 UI 검사. 새 의존성 설치 없음.

## 모델과 조작

120×80×80 mm, 24×16×16 cell-centered 격자, 각 간격 5 mm. 온도는 °C, 온도차는 K. α=k/(ρcₚ) 단위 m²/s. 균질 등방성, 대류·복사·상변화 제외.

- 예시 A: k=200 W/(m·K), ρ=2700 kg/m³, cₚ=900 J/(kg·K), α=8.230452675e−5 m²/s.
- 예시 B: k=16, ρ=8000, cₚ=500 (같은 단위), α=4e−6 m²/s.
- 특정 실제 재료의 설계용 데이터가 아닌 교육용 수치임을 UI에 표시.
- 단열 경계는 외부 face flux 0. 고정온도는 X 양 끝 면에서 셀 중심까지 거리 dx/2이므로 2α(Tboundary−Tcell)/dx² 사용. Y/Z 면은 단열.
- 안전 dt = 0.8 / [α (2Σ1/d² + I_Dirichlet/dx²)]. 내부 안정수 αdtΣ1/d² ≤ 0.5보다 보수적이며, 경계 셀의 양의 계수 조건도 만족.
- 체적 가열 영역: 중심의 20 mm 정육면체, UI 격자에서 4×4×4개 셀. s=0~10 K/s. 주입전력은 ρcₚ Vsource s [W]. 기본 2 K/s, A일 때 38.88 W.
- 에너지: E₂₀=ρcₚ ΔV Σ(T−20) [J]. 경계 열저장고 실험에서는 에너지 보존을 기대하지 않음.
- 실험 3종 / 재료 2종 / X 경계온도 / 열원 ON·OFF와 세기 / X·Y·Z 단면과 셀 위치 / 탐침 X·Y·Z / 일시정지·재생·초기화·한 step / 1·10·50·200배속 / 사선·정면·자동 카메라.
- 실험·재료·경계온도 변경은 재시작. 단면 이동은 물리 상태 유지. 탐침 변경은 온도장 유지, 탐침 이력만 초기화. 열원 변경은 현재 상태 유지.
- 흰 구는 탐침, 황금색 상자는 실제 열원 영역. 외면 2개는 반투명 색상으로 공간 문맥 제공. 선택 단면은 불투명.
- 고정 20~100°C 범례와 단면에 같은 sRGB HSL 색을 적용. 범위 밖 색은 clipping하며 수치와 그래프는 실제 온도 표시.
- 한 프레임 최대 160 수치 step, 물리 frame delta 최대 0.05s. 200배속에서 처리 한도에 걸리면 안정 dt를 늘리지 않고 실제 시뮬레이션이 느려짐. UI 안내 표시.
- 탐침 최근 240점, 선택 단면 중앙선 온도(온도 °C / 위치 mm) 그래프. 시간축은 실제 물리 시간 s.

## 수치 검증

작업 디렉터리 `/home/bayta/workSpace/threejs-test`에서:

```sh
node heat-diffusion/numerical-test.cjs
```

2026-09-22 실행 PASS:

| 검사 | 기준 | 결과 |
| --- | --- | --- |
| 균일 42°C 단열장, 100 step | 정확히 유지 | 최대 오차 0 |
| hot spot 단열 확산, 1000 step 에너지 | 상대 drift < 1e−9 | 8.3267e−14 |
| 같은 실험 평균 보존 | 참고 실측 | 1.3500e−13 °C |
| 무열원 최대 원리 | 1000 step 매 단계 초기 min/max 범위 ±1e−12 | PASS |
| X 고정온도, 12×8×8 격자 9000 step | cell center 선형장 오차 <1e−5°C | 최대 6.6791e−13°C |
| 중앙 체적 가열, 400 step | 에너지 주입 상대 오차 <1e−9 | 2.3948e−13 |
| Neumann cosine 해, 5s, dt/8, 12→24 격자 | 세분화 오차비 <0.3 | 0.0216708→0.00545528°C (약 0.252) |
| dt→dt/2→dt/4, 동일 24 격자 | 인접 해 차이 비 <0.55 | 0.00241492→0.00121028°C (약 0.501) |
| α 변경 후 같은 100 step (시간 역비례) | 온도장 차이 <1e−11°C | 0, 시간비 20.5761317 |
| 재료/실험 6개 조합 | 안정수 ≤0.5 | 단열 0.4 / Dirichlet 0.342857 |
| 허용 dt 초과 입력 | 거부 | PASS |

A: 단열 dt=0.0405s / Dirichlet dt=0.0347143s. B: 0.833333s / 0.714286s. 배속은 이 dt를 바꾸지 않음.

모듈 구문은 HTML의 module script를 `/tmp/heat-module.mjs`로 추출하고 `node --check /tmp/heat-module.mjs`로 검사.

## 브라우저 검증

```sh
flock /tmp/threejs-stem-browser.lock node heat-diffusion/browser-test.cjs
```

기존 Playwright `/home/bayta/.cache/ms-playwright-go/1.57.0/package`, WSL Chromium `/snap/chromium/current/usr/lib/chromium-browser/chrome`, 기존 폰트 설정 재사용. 임시 HTTP 서버는 port 0으로 할당하고 종료 시 정리. 초기 sandbox 실행에서 localhost listen EPERM이 발생하여 실행 권한 승격 후 검증.

초기 렌더 검사에서 canvas 크기가 stage 레이아웃에 되먹임되어 resize가 반복되는 문제를 발견. canvas를 절대 배치하고 content 크기 기준 `setSize(width,height,false)`로 수정. 수정 후 1440×1000, 390×844, 844×390 스크린샷을 직접 검토. 가로 화면에서 블록이 잘리는 문제도 카메라 거리에 aspect를 반영하여 수정. 모바일 경계 검사에는 scroll rounding을 위한 1 CSS px 허용오차를 적용.

## 리뷰와 한계

독립 Reviewer가 최초 계획과 실제 HTML·테스트를 검토하고 수치 테스트를 직접 재실행. 색 범례 불일치와 물리 시간 clamp로 인한 FPS 집계 오류를 지적하여 수정. 색은 명시적 sRGB, FPS는 실제 wall delta로 계산.

실제 온도장 검증은 교육용 PDE 모형에 대한 검증이며 실재 부품 열설계를 보증하지 않음. 외부 CDN 필요. 실기기 GPU·터치 조작·장시간 soak·실제 브라우저 BFCache 탐색은 별도 환경에서 미검증. 합성 pagehide/pageshow/visibility 및 contextlost 이벤트 검증은 이벤트 핸들러 수준이며 실제 OS/GPU 장애 복구 검증과 구분. FPS 성능 목표나 실기기 프레임률을 주장하지 않음.

원리 참고: [MIT OCW, Strang §5.4 Heat Equation](https://ocw.mit.edu/courses/18-086-mathematical-methods-for-engineers-ii-spring-2006/5db29e69494eb09a26f7224d43adc6f6_am54.pdf)에서 열방정식, explicit 안정 조건, 무유속에서의 열 보존 및 αt 시간척도를 확인. 3D와 반 셀 경계의 계수는 실제 이산식에서 직접 유도하고 위 테스트로 검증.


## 최종 브라우저 결과 및 완료 판정

- 실제 HTTP/CDN import, WebGL 렌더와 물리시간 진행 확인.
- pause/resume/reset/한 step, 3 실험, 2 재료, 경계온도, 열원 toggle/강도, 3 단면 축·위치, 탐침, 200배속, 정면·사선·자동 카메라 검사 PASS.
- 정지 시 물리와 자동 카메라 모두 정지. 고정 카메라는 mousemove로 바뀌지 않음.
- 데스크톱·모바일 세로·가로 화면에 수평 overflow 없음. 모든 조작에 스크롤로 접근 가능. 모바일은 장면/그래프/조작을 세로로 배열하므로 스크롤이 필요함.
- reduced-motion에서는 정지·사선 고정으로 시작. 합성 BFCache 왕복/visibility 이벤트, 명시적 dispose, CDN 차단 안내, contextlost 핸들러 검사 PASS.
- 정상 페이지 콘솔 오류 및 pageerror: 0.
- 검증 스크린샷: `/tmp/heat-desktop.png`, `/tmp/heat-390.png`, `/tmp/heat-844.png` (임시 산출물).
- 실제 RAF 사용. FPS에 대한 별도 벤치마크나 보장 수치는 제시하지 않음.
- 변경 파일 최종 검토: 소유 폴더 내 HTML, 수치 테스트, 브라우저 테스트, 이 검증 문서만 작성. 공통/다른 데모 파일 변경 없음.

최종 상태: **완료 (Verified)** — 교육용 모형, 수치 검증, 실제 브라우저 기능 검증 완료. 실기기/실제 BFCache·GPU 장애 등 위 한계는 남음.
