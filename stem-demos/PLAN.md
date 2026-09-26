# 수학·과학·공학 시각화 9종 공통 실행 계획

## 요청과 완료 범위
사용자는 아래 9종 모두를 세부 계획한 뒤 각각 다른 세션에서 실제 구현 시작을 요청했다. 각 구현 작업은 독립 실행 데모, 계산 검증, 브라우저 검증, 결과 문서까지 완료한다. 사용자에게 추가 착수 승인을 요구하지 않는다.

|번호|작업|폴더·HTML 이름|
|---|---|---|
|1|구조물 공진 실험실|structural-resonance|
|2|파동 간섭 수조|wave-interference|
|3|푸리에 합성 조각|fourier-synthesis|
|4|선형변환 공간 실험실|linear-transform|
|5|로렌츠 혼돈 관측소|lorenz-attractor|
|6|전자기 유도 발전기|electromagnetic-induction|
|7|PID 서보 실험대|pid-servo|
|8|열전도 단면 실험실|heat-diffusion|
|9|트러스 하중 실험실|truss-lab|

각 진입점은 `<폴더>/<폴더>.html`, 세부 계획은 각 폴더의 PLAN.md이다. 이번 프로젝트는 정상 Git 저장소가 아니므로 별도 Git worktree 없이 동일 WSL 프로젝트에서 폴더 소유권을 나눈다.

## 반드시 지킬 작업 원칙
- WSL2 Linux 파일시스템에서 수행한다. Inspect before assuming, Reuse before creating, Test before claiming, Review before completing.
- README와 직접 관련된 기존 HTML을 먼저 읽는다. 기존 단일 HTML, Three.js 0.183.0 import map, 절차적 재질, 조작 UI, 수명 관리 패턴을 필요한 범위만 재사용한다.
- 새 런타임 패키지·외부 이미지·모델·불필요한 공용 추상화·무관한 리팩터링은 추가하지 않는다. 파일 안에서는 수치 계산, 상태, 렌더링, UI 책임을 함수로 구분한다.
- 각 작업은 자신의 데모 폴더만 수정한다. **1번 구조물 공진 작업만 루트 index.html과 README.md 등록을 담당**한다. 나머지 작업은 두 공통 파일과 다른 데모 폴더를 수정하지 않는다.
- 기존 데모 7종을 보존한다. 공통 계획과 TASKS.md를 다른 작업이 덮어쓰지 않는다.
- 별도 세션은 사용자가 직접 소유하는 작업이다. 다른 작업에 변경을 요청하는 메시지는 이 9종 구현·검증·등록 범위에 한한다.

## 공통 제품 구성
- 기존 새 데모처럼 전체 화면 3D 장면, 한국어 제목·설명, 갤러리 복귀, 반투명 컨트롤, 상태·FPS 표시를 사용한다. 밝은 배경에서도 텍스트 대비를 유지한다.
- 3D는 공간·방향·형상을 설명하는 데 쓰고, 시간 그래프와 수치표는 2D canvas/HTML로 명확하게 표시한다. 데이터에 단위·축·범례를 붙인다.
- 재생/일시정지, 초기화, 프리셋, 속도 선택, 카메라 고정/자동 또는 명시적 보기 버튼을 제공한다. 필요한 데모에는 한 단계 진행을 추가한다. 정적 해석 데모에 무의미한 시간 조작을 억지로 붙이지 않는다.
- 마우스를 움직이기만 해도 카메라가 반응하는 동작은 금지한다. 별도 버튼이나 의도적 드래그는 데모 목적상 필요한 경우만 쓴다.
- 일시정지는 물리/수학 시간과 자동 카메라를 함께 멈춘다. 카메라만 멈추면 계산은 계속된다. 파라미터 변경 시 유지/재시작 정책을 표시하고 일관되게 적용한다.
- reduced-motion에서는 자동 카메라를 기본 끄고 필요시 정지 상태로 시작한다. 접근 가능한 label, aria-pressed, 키보드 focus, 스크린리더용 요약과 390×844/844×390 배치를 갖춘다.
- 모델의 가정과 실제 물리량, 표시용 변형 배율·축척을 짧게 표기한다. 실제 계산하지 않은 물리량이나 검증하지 않은 정확도를 주장하지 않는다.

## 계산과 성능
- 수치 적분은 고정 시간 간격 또는 안정 조건을 만족하는 substep으로 실행하고 렌더링 프레임률과 분리한다. 배속은 계산 단계 수에 적용하며 적분 간격을 무작정 키우지 않는다.
- 백그라운드 복귀 시 지난 시간을 한꺼번에 따라잡지 않는다. frame delta와 accumulator를 관리한다. 한 프레임 처리 한도를 두고 초과 시 시뮬레이션이 느려짐을 허용하되 수치 안정성을 지킨다.
- 검증에는 실제 구현된 계산 함수를 사용한다. 별개의 복사 알고리즘만 테스트하고 본 구현을 검증했다고 주장하지 않는다.
- 길어지는 궤적과 그래프는 제한 길이 버퍼로 관리한다. material/geometry를 재사용하고 DPR은 1.5~2 이하로 제한한다. 정확한 값은 실제 화면·성능에 맞춰 결정한다.
- resize, visibilitychange, pagehide/pageshow(BFCache), dispose, WebGL/CDN 로드 실패 안내를 처리한다. 종료 시 RAF, 이벤트, GPU 자원을 해제한다.

## 검증 도구와 경합 방지
- node/python3와 기존 도구를 먼저 확인한다. /tmp/check-scene-ui.cjs, /tmp/orrery-check.cjs는 이전 검증의 참고자료이며 덮어쓰지 않는다.
- 기존 Playwright 패키지 후보: /home/bayta/.cache/ms-playwright-go/1.57.0/package.
- WSL Chromium 후보: /snap/chromium/current/usr/lib/chromium-browser/chrome. 기존 검증은 headless SwiftShader, --no-sandbox, --enable-unsafe-swiftshader, --disable-dev-shm-usage 및 /snap 관련 LD_LIBRARY_PATH를 사용했다. 실제 존재 여부를 다시 확인한다.
- 폰트 설정 후보: /tmp/abyssal-fonts.conf. 공용 런타임·폰트 파일은 읽기만 한다.
- 임시 파일/서버 포트는 각 작업별로 분리한다. 서버는 가능한 port 0으로 빈 포트를 배정받는다.
- **브라우저 검증은 전체 9작업에서 동시에 한 개만 실행한다.** `flock /tmp/threejs-stem-browser.lock <자신의 검증 명령>`으로 프로세스 수명 동안 잠금을 유지한다. 다른 작업의 프로세스를 종료하거나 잠금 파일을 삭제하지 않는다. 수치 검증·코드 리뷰·문서는 기다리는 동안 진행 가능하다.
- UI 검증용으로 시간을 제어한 결과와 실제 RAF 실행 검증을 구분한다. 인위적 시간 진행의 FPS 수치는 성능 측정값이 아니다.

## 완료 게이트
1. 구문 검사와 데모별 의미 있는 수치 검증.
2. 로컬 HTTP, 실제 브라우저 렌더, 콘솔 오류, 주요 컨트롤, pause/resume/reset, 화면 크기, reduced-motion, 복귀·종료 검증.
3. 실제 변경 파일과 사용자 요구를 기준으로 최종 리뷰. 발견한 중대한 문제를 수정하고 관련 검증 재실행.
4. 각 폴더에 VALIDATION.md 작성: 실제 기능/조작/가정/테스트 명령과 결과/미검증 사유/위험/최종 상태(Verified, Partially Verified, Blocked, Failed). 숫자 허용오차와 실측 오차를 기록한다.
5. 자신의 최종 보고에 정확한 HTML 경로·짧은 카드 설명·조작 목록·상태를 포함한다. 1번 작업은 이를 읽어 공통 등록한다.

## 갤러리 통합: 1번 작업 전담
- stem-demos/TASKS.md에서 2~9번 작업 ID를 확인하고 wait_threads의 묶음 조회(최대 8개, cursor 재사용)로 결과를 기다린다. 필요한 결과만 read_thread로 읽는다.
- 신규 '수학·과학·공학' 섹션을 추가하고 실제 생성되어 실행 가능한 데모만 연결한다. 카드 설명과 README는 최종 구현 기준으로 쓴다.
- 모든 데모가 구현되면 기존 7종 + 신규 9종 = 총 16종이 된다. 번호·카드 수·href·README를 실제 파일과 대조한다. 실패/미완료 데모를 완성했다고 표시하지 않는다.
- 브라우저 확인이 불가능한 데모는 Partially Verified 사유를 보존한다. 다른 작업의 구현을 무단 덮어쓰기보다는 해당 작업에 구체적인 수정 요청을 전달한다.
- 통합 후 루트 링크 검증과 갤러리 화면 검토를 수행하고 최종 상태를 보고한다.

## 참고 자료
- 모델링·제어: https://ctms.engin.umich.edu/CTMS/?example=Introduction&section=SystemModeling
- 파동: https://phet.colorado.edu/en/simulations/wave-interference
- 푸리에: https://www.3blue1brown.com/lessons/discrete-fourier-transform/
- 선형변환: https://www.3blue1brown.com/lessons/linear-transformations/
- 유도: https://phet.colorado.edu/en/simulations/faradays-electromagnetic-lab
참고자료의 시각 디자인을 그대로 복제하지 않는다. 수식과 가정은 각 구현자가 원자료 또는 신뢰 가능한 대학 강의/공식 문서로 확인한다.
