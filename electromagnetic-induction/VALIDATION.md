# 전자기 유도 발전기 검증

최종 상태: **Verified** (2026-09-22, WSL2 Linux).

## 구현과 조작

- 실행 파일: `electromagnetic-induction/electromagnetic-induction.html`
- 갤러리 설명: **회전 코일의 자세와 자기선속, 유도전압·전류를 3D 모형과 시간 그래프로 연결하는 교류 발전기 실험실.**
- 단일 HTML, 기존 Three.js 0.183.0 import map 사용. 외부 모델·이미지·새 런타임 의존성 없음.
- 두 자극, 회전 코일, 구동축, 축약 슬립링/접촉 배선, 저항 부하, 법선, 정적 균일 장선, θ 호, 투영면적. 5개 시각 권선은 실제 권선 N의 축약 표현.
- rpm −120~120, B 0~1 T, N 1~100, A 0.01~0.1 m², R 10~100 Ω.
- 재생/일시정지, 초기화, 정지 중 1/60초 진행, 0.25/1/2/4배속.
- 정지/저속/두 배 회전속도/역회전/두 배 권선 프리셋, 자극 반전.
- 정면/측면/사선 보기, 자동 카메라, 법선·호/장선/투영 토글, 그래프 축 고정.
- θ는 +z 기준 누적 회전 위상. B는 signed 값이고 실제 B와 법선의 각도 α도 별도 표시. rpm 변경은 θ 유지. B/N/A/자극 변경은 θ 유지와 기록 초기화, 임펄스 제외. R 변경도 기록 초기화. 초기화/프리셋은 θ와 시간을 0으로 설정. 초기화는 정지 상태와 표시 토글·고정축 선택을 유지.
- Φ [Wb], λ [Wb·turn], e [V], i [A], f [Hz], P [W] 수치. 최근 4초 그래프, 각각 0선/단위/±범위 표시. 고정축 초과 시 잘림 정책 명시.
- 작은 화면에서는 세로 스크롤. 폼 label, keyboard focus, 상태 알림. reduced-motion은 초기 정지·자동 카메라 끄기.

## 모델과 단위

`Φ=BA cosθ`, `λ=NΦ`, `e=NBAω sinθ`, `i=e/R`, `P=i²R`, `ω=2π rpm/60`.
코일의 xy 평면과 y축 회전으로 법선 `(sinθ,0,cosθ)`가 구현된다. +전류는 +법선 방향에서 보아 반시계 방향이다. B=0에서는 B와 법선의 각도를 정의하지 않는다.

[OpenStax University Physics 2, 13.6](https://openstax.org/books/university-physics-volume-2/pages/13-6-electric-generators-and-back-emf)의 균일 자기장 회전 코일 유도기전력 식과 대조했다. 외부 구동의 일정 속도, 순저항, 인덕턴스/접점 손실/전기자 반작용/속도 저하 제외. 부하 발광은 `P/(1 W+P)` 정규화 연출이고 전류 화살표는 방향만 나타낸다. 실제 장선 해석이나 전자 드리프트 속도 모델이 아니다.

## 실행 명령과 결과

프로젝트 루트에서:

```sh
node electromagnetic-induction/validate-numerics.cjs
flock /tmp/threejs-stem-browser.lock node electromagnetic-induction/validate-browser.cjs
```

수치 테스트는 HTML의 실제 `Induction` 함수를 추출해서 실행하며 module script 구문도 검사한다. Node의 experimental VM 경고는 정상 안내이다.

VM 모듈이 비활성화되어 있으면 검증기가 `--experimental-vm-modules`를 추가해 한 번 재실행합니다. 기존 Node 옵션과 스크립트 인자를 유지하며, 자식 검증기의 종료 코드를 반환합니다. 프로세스 시작 오류나 시그널 종료도 실패로 처리합니다.

기준 N=40, B=0.5 T, A=0.05 m², rpm=30, R=40 Ω:

| 검사 | 기준/허용오차 | 실측 결과 |
|---|---|---|
| θ=0, π에서 e=0; π/2 최대 | 최대 π V, 절대 1e−12 | 통과, peak=3.141592653589793 V |
| 선속쇄교 중앙차분과 −e | dt=1e−5 s, peak 정규화 상대 1e−5 | 최대 1.6853038331347377e−10 |
| N/B/A/rpm 2배 | e peak 2배, 절대 1e−12 | 통과 |
| R 2배, 역회전/극성 반전 | i 절반/전압 부호 반전, 절대 1e−12 | 통과 |
| 한 주기 평균 전압 | 0 V, 절대 1e−12 | 1.4427139496085707e−17 V |
| 한 주기 평균 전류 | 0 A, 절대 1e−12 | −2.649942151968605e−18 A |
| RMS 전압 | π/√2 V, 절대 1e−12 | 오차 3.552713678800501e−15 V |
| i²R = ei | 부동소수점 일치 | 최대 차 5.551115123125783e−17 W |
| 480 × 1/240초 위상 | 2π rad, 절대 1e−12 | 오차 2.842170943040401e−14 rad |
| 렌더 법선 dot B 단위벡터 | sign(B)cosθ, 절대 1e−12 | 브라우저 오차 0 |

rpm=0/B=0의 e=i=0, 모든 UI 범위 끝점 조합의 finite 값, 정/역방향 위상 복귀도 통과.

브라우저: 기존 Playwright `/home/bayta/.cache/ms-playwright-go/1.57.0/package`, WSL Chromium `/snap/chromium/current/usr/lib/chromium-browser/chrome`, headless SwiftShader. 임시 HTTP 서버는 127.0.0.1의 자동 할당 포트. 공용 flock으로 실행 직렬화. 샌드박스 내 포트 개설 EPERM 후 승인된 확장 권한으로 실행했다.

- 실제 RAF로 시뮬레이션 시간 진행 및 WebGL draw 확인.
- 이후 결정적 상태 검증용 프레임 제어: pause 시 θ/time/자동 카메라 정지, resume, 한 단계, reset, 배속, 프리셋, rpm 연속성, 반복 반전, B=0, N 변경 기록 초기화.
- 보기/표시 토글과 고정축 UI, 1440×1000/390×844/844×390 가로 넘침 없음. 스크롤 후 모든 조작 요소 도달 가능.
- reduced-motion 런타임 변경 및 재로드 초기 상태, visibility accumulator 초기화.
- pagehide/pageshow의 persisted 합성 이벤트로 RAF 정지·재개, 비persisted 종료 시 dispose와 canvas 제거.
- 2000 tick 이후 기록 길이 961 유지. WebGL draw calls >0, 정상 검증 console/page 오류 0.
- 별도 페이지에서 CDN 차단 시 실패 안내, 실제 WEBGL_lose_context 확장으로 context 손실 시 실패 안내·dispose.
- 캡처: `/tmp/induction-desktop.png`, `/tmp/induction-390.png`, `/tmp/induction-844.png`. 화면의 코일·자극·장선과 시간 그래프, 모바일 세로 배치를 직접 확인.

## 최종 리뷰와 한계

별도 Reviewer가 요구 문서/HTML/테스트를 읽고 수치 검증을 독립 실행했다. 수식, 좌표, 오른손 전류 방향, 수명 처리에서 중대한 오류 없음. 부하 양단 연결선을 최종 정리하고 관련 검증을 재실행했다. 다른 데모·루트 갤러리·README는 수정하지 않았다.

실제 브라우저 이력 이동에 따른 BFCache 진입은 측정하지 않았다(합성 persisted 이벤트 경로 검증). 실제 물리 모바일 기기, GPU별 성능·장시간 FPS는 측정하지 않았다. 프레임 제어 테스트의 FPS를 성능 결과로 사용하지 않는다. 정상 실행은 인터넷의 unpkg CDN과 WebGL에 의존한다. 표시 형상·부하 발광·배선은 교육용 축약이며 정밀 발전기 설계에는 사용할 수 없다.
