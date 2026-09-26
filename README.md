# Three.js 데모 모음

## GitHub Pages

공개 주소: [Three.js Demo Gallery](https://jskarkady.github.io/3jsdemo/)

저장소: [jskArkady/3jsdemo](https://github.com/jskArkady/3jsdemo). `main` 브랜치의 루트(`/`)를 GitHub Pages 배포 원본으로 사용합니다. 별도 빌드 없이 HTML을 제공하며 `.nojekyll`로 Jekyll 처리를 생략합니다. 업데이트를 `main`에 push하면 Pages가 다시 배포합니다. 데모의 상대 경로는 `/3jsdemo/` 아래에서도 유지됩니다.

루트의 `index.html`이 전체 16개 데모(공간 데모 4개, 확률 데모 3개, 수학·과학·공학 데모 9개)의 실행 메뉴입니다. 메뉴에서 데모를 실행하고 브라우저의 뒤로 가기로 돌아옵니다.

## 실행

WSL2에서 이 폴더를 기준으로 정적 서버를 실행합니다.

```sh
cd /home/bayta/workSpace/threejs-test
python3 -m http.server 8000 --bind 127.0.0.1
```

브라우저에서 <http://localhost:8000>을 엽니다. 종료는 터미널에서 `Ctrl+C`를 누릅니다.
데모는 unpkg CDN의 Three.js 0.183.0 및 addons를 사용하므로 인터넷 연결과 JavaScript, WebGL 지원이 필요합니다.

## 파일 구성과 내용

각 데모는 장면 이름 또는 구슬 수·핀 단수를 나타내는 폴더와 HTML 파일로 관리합니다. 각 파일에 스타일, 장면 구성, 애니메이션이 포함되어 있고 별도의 로컬 리소스는 없습니다. 성소와 포털 실험실에는 아래 미술 개선을 적용했습니다. 모든 데모에서 마우스 이동에 따른 카메라 반응을 제거했으며, 자동 카메라 연출과 확률 시뮬레이션 동작은 유지합니다.

| 실행 파일 | 기존 파일 | 내용 및 조작 |
| --- | --- | --- |
| [ancient-cliff-sanctuary/ancient-cliff-sanctuary.html](ancient-cliff-sanctuary/ancient-cliff-sanctuary.html) | 260621_v1.html | Ancient Cliff Sanctuary: 협곡, 다리, 성소, 거대 생명체, 식생. 일시정지/재생, 배속, 자동 카메라 켜기/끄기, 노출 조절, 갤러리 복귀, FPS 표시. |
| [ruined-portal-test-chamber/ruined-portal-test-chamber.html](ruined-portal-test-chamber/ruined-portal-test-chamber.html) | 260621_v2.html | Ruined Portal Test Chamber: 폐허 실험실, 연결된 포털, 기계 장치, 식생과 잔해. 일시정지/재생, 배속, 자동 카메라 켜기/끄기, 노출 조절, 갤러리 복귀, FPS 표시. |
| [abyssal-observatory/abyssal-observatory.html](abyssal-observatory/abyssal-observatory.html) | 신규 | 심해 생물발광 관측소: 관측창, 발광 해파리 7마리, 해저 지형·장비, 물고기 군집. 탐조등, 해류 강도, 일시정지/재생, 자동 카메라, FPS. |
| [clockwork-orrery/clockwork-orrery.html](clockwork-orrery/clockwork-orrery.html) | 신규 | 태양계 기계식 천문대: 황동 기어, 6개 행성과 달, 일식 원리 시연. 일시정지/재생, 0.25·1·2·4배속, 자동 카메라, 전체/기어 보기, 일식 시연/복귀, FPS. |
| [galton-board-640-14-rows/galton-board-640-14-rows.html](galton-board-640-14-rows/galton-board-640-14-rows.html) | 260703_v1.html | The Shape of Chance: 14단 핀, 구슬 640개, 이항분포 참조 곡선. 재시작 버튼. |
| [galton-board-1000-23-rows/galton-board-1000-23-rows.html](galton-board-1000-23-rows/galton-board-1000-23-rows.html) | 260720_v1.html | The Shape of Chance: 23단 핀, 구슬 1,000개를 2초에 걸쳐 방출. 관측/기대 분포, 진행 통계, 일시정지·배속·새 실험. |
| [galton-board-1000-12-rows/galton-board-1000-12-rows.html](galton-board-1000-12-rows/galton-board-1000-12-rows.html) | 260831_v2.html | The Shape of Chance: 12단 핀, 구슬 1,000개, 13개 결과 구간. 유리 호퍼와 개편된 통계 UI, 일시정지·배속·새 실험. |
| [구조물 공진 실험실](structural-resonance/structural-resonance.html) | 신규 | 같은 지반 가진을 받는 두 4층 건물의 공진·감쇠와 고유모드를 비교합니다. 자유/강제/모드 · 질량·강성·감쇠 · 변위 그래프 · 단계 진행. |
| [파동 간섭 수조](wave-interference/wave-interference.html) | 신규 | 두 파원의 보강·상쇄를 입체 수면, 평균 강도 지도와 탐침 파형으로 비교합니다. 위상·주파수·간격 · 파원 토글 · 탐침 · 상부/입체 보기. |
| [푸리에 합성 조각](fourier-synthesis/fourier-synthesis.html) | 신규 | 회전 벡터로 폐곡선을 복원하며 주파수 성분과 복원 오차를 비교합니다. 직접 그리기 · 1~128개 성분 · 스펙트럼 · 평면/시간축 보기. |
| [선형변환 공간 실험실](linear-transform/linear-transform.html) | 신규 | 3×3 행렬로 기저·격자·단위구를 변형하며 행렬식, 차원과 특이값을 탐구합니다. 행렬 편집 · 보간 · 7개 프리셋 · 기저·고유축·주축. |
| [로렌츠 혼돈 관측소](lorenz-attractor/lorenz-attractor.html) | 신규 | 아주 가까운 두 초기값이 만드는 로렌츠 궤적과 거리 그래프로 결정론적 혼돈을 관측합니다. σ·ρ·β·ε · 궤적 길이 · 선형/로그 거리 · 시점 전환. |
| [전자기 유도 발전기](electromagnetic-induction/electromagnetic-induction.html) | 신규 | 회전 코일의 자세와 자기선속, 유도전압·전류를 3D 모형과 시간 그래프로 연결합니다. rpm·B·N·A·R · 자극 반전 · 법선·투영 · 그래프 축 고정. |
| [PID 서보 실험대](pid-servo/pid-servo.html) | 신규 | 레일 위 카트의 목표 추종으로 P·PI·PID, 힘 포화와 anti-windup, 외란 응답을 비교합니다. 게인·목표 · step/sine · 힘 제한 · anti-windup · 외란. |
| [열전도 단면 실험실](heat-diffusion/heat-diffusion.html) | 신규 | 직육면체 내부의 열확산을 X/Y/Z 단면과 탐침으로 관찰하고 경계조건과 체적 가열을 비교합니다. 재료·경계온도 · 단면 이동 · 탐침 · 열원 · 배속. |
| [트러스 하중 실험실](truss-lab/truss-lab.html) | 신규 | 이동 하중에 따른 부재의 인장·압축, 절점 변위와 지점 반력을 정적 해석으로 살펴봅니다. 구조 프리셋 · 하중 이동 · E·A · 부재 선택 · 변형 배율. |

## 공간 데모 미술과 렌더링

- **Ancient Cliff Sanctuary**: 《완다와 거상》과 《반지의 제왕》 아르고나스의 규모감을 참고한 절벽 수호자 부조, 순례길과 제단, 폭포, 층별 안개, 비대칭 산 능선을 추가했습니다. 차가운 협곡과 따뜻한 성소 조명을 구분하고 카메라가 성소·부조를 보여주도록 조정했습니다.
- **Ruined Portal Test Chamber**: 《Portal 2》의 폐허와 《블레이드 러너 2049》 월레스 집무실의 물결빛을 참고했습니다. 물웅덩이·젖은 타일·벽면 물결빛, 포털 색광, 관찰창과 의자, 간헐 재가동 장치, 붕괴 흔적과 천창 주변 식생을 추가했습니다.
- 텍스처는 코드로 생성합니다. 색상 맵에는 sRGB, 거칠기·높이 맵에는 데이터 색공간을 사용하며, 같은 표면 패턴을 공유해 얼룩과 요철이 일치하도록 했습니다. 외부 이미지나 추가 패키지는 사용하지 않습니다.
- 포털 실험실의 수면 반사는 시선과 포털 평면의 교차로 **발광 테두리만** 계산합니다. 방 전체와 포털 내부 영상을 반사하는 실시간 거울은 아닙니다. 벽면 물결빛도 국소 셰이더 효과입니다.
- 두 장면 모두 후처리 출력에 톤 매핑과 sRGB 변환을 적용하며, 재질 세부가 보이도록 블룸·색수차·필름 그레인을 조정했습니다.
- 성소 절벽은 월드 좌표 기반 삼면 투영으로 긴 지형의 텍스처 늘어짐을 줄였습니다. 폭포는 실제 절벽 끝을 기준으로 배치하고 안개·주변광을 조정해 깊이감을 강화했습니다.
- 성소의 거대 생명체는 굴곡 있는 몸통·머리·주둥이와 휘어진 다리·뿔, 몸에 밀착된 무광 석재 갑주를 사용합니다. 주변 바위·관목·석상도 연속적인 표면 변형을 적용하고, 새 날개는 곡선 윤곽으로 세분화했습니다.
- 거대 생명체의 보행은 네 발을 순차적으로 옮기며 디딘 발의 위치를 고정합니다. 다리 굽힘과 몸통·고개의 무게 이동을 연결하고, 곡선 경로로 부드럽게 방향을 전환합니다. 거대 생명체는 협곡 바닥까지 이어지는 암반 단 위를 순찰하며, 발바닥 높이를 실제 암반 상면에 맞춥니다. 평평한 전용 경로를 사용하며 임의 지형을 위한 충돌 시스템은 아닙니다.
- 실험실의 수면·포털·물결빛·빛줄기 셰이더는 일반 물체와 같은 로그 깊이 및 포털 클리핑을 사용합니다. 타일에는 여러 크기의 얼룩·요철과 인스턴스별 색상 차이를 적용하고, 빛줄기의 가장자리와 양 끝은 부드럽게 감쇠합니다.

## 심해 관측소와 기계식 천문대

- **심해 생물발광 관측소**: 해파리의 종 수축과 촉수 움직임, 해초·입자·유영 편향을 공유 시간과 해류 값으로 연결했습니다. 해류 0에서는 해류의 진행만 멈추고 생물의 자체 유영은 유지합니다. 탐조등 버튼은 실제 조명과 연출용 빛줄기를 함께 전환합니다. 일시정지는 생물·해류·자동 카메라를 함께 멈춥니다. 유리는 가장자리 오염 표현이며, 물고기는 경로 기반 군집 연출로 실제 유체 해석이나 boids 시뮬레이션은 아닙니다.
- **태양계 기계식 천문대**: 태양과 수성·금성·지구·화성·목성·토성, 지구의 달을 표현합니다. 단순 기어 쌍은 톱니 수 비율로 반대 방향 회전하며, 일식은 태양·달·지구의 3D 위치를 이용한 국소 그림자로 시연합니다. 크기·거리·주기를 축약한 원리 모형이며 실제 천체력이나 정밀 기계 해석은 아닙니다.
- 두 새 데모는 reduced-motion 설정에서 자동 카메라를 기본 중지하고 움직임을 줄입니다. 키보드 조작, 좁은 화면 배치, 갤러리 복귀 링크, 초기화 실패 안내와 페이지 수명에 따른 리소스 정리를 제공합니다. 마우스 이동은 카메라에 영향을 주지 않습니다.

## 수학·과학·공학 실험 9종

9개 실험의 조작 패널 상단에 **실험 이해하기 · 원리와 관찰**이 있습니다. 접힌 설명을 펼치면 핵심 원리, 수식과 기호·단위, 직접 해 볼 관찰 3가지, 결과 해석, 모델의 한계와 참고자료를 읽을 수 있습니다. 키보드 Enter/Space로도 펼치고 접을 수 있습니다.

각 데모는 독립된 단일 HTML이며 계산 함수와 3D 표현, 그래프 또는 수치표와 조작 패널을 함께 제공합니다. 3D는 형상과 방향을, 그래프와 수치표는 실제 계산값과 단위를 보여줍니다. 표시 변형·공간 축척은 각 화면에 명시했습니다. 교육용 수학·물리 모형이며 실제 구조물·발전기·제어기·열설계의 안전 판정을 제공하지 않습니다.

물리 계산은 고정 시간 간격 또는 안정 조건을 만족하는 단계로 실행하며 배속은 단계 수에 적용합니다. 이력은 길이를 제한하고 느린 기기에서는 시뮬레이션이 실시간보다 느려질 수 있습니다. 정적 선형변환과 트러스의 재생은 각각 보간과 이동 하중 표시입니다. 파라미터 변경 시 초기화/유지 정책은 각 데모에 안내합니다. 모든 신규 데모는 마우스 이동만으로 카메라가 움직이지 않으며, 명시적 보기·자동 카메라 조작을 사용합니다.

재생/정지, 초기화, 프리셋, 배속 또는 해당 모형의 표시 조작, 갤러리 복귀, FPS를 제공합니다. reduced-motion에서는 정지·고정 카메라로 시작합니다. 390×844와 844×390에서 스크롤로 모든 조작에 접근할 수 있도록 검증했습니다.

| 실험 | 검증 상태 | 모델·검증 기록 |
| --- | --- | --- |
| 구조물 공진 실험실 | Verified | [structural-resonance/VALIDATION.md](structural-resonance/VALIDATION.md) |
| 파동 간섭 수조 | Verified | [wave-interference/VALIDATION.md](wave-interference/VALIDATION.md) |
| 푸리에 합성 조각 | Verified | [fourier-synthesis/VALIDATION.md](fourier-synthesis/VALIDATION.md) |
| 선형변환 공간 실험실 | Verified | [linear-transform/VALIDATION.md](linear-transform/VALIDATION.md) |
| 로렌츠 혼돈 관측소 | Verified | [lorenz-attractor/VALIDATION.md](lorenz-attractor/VALIDATION.md) |
| 전자기 유도 발전기 | Verified | [electromagnetic-induction/VALIDATION.md](electromagnetic-induction/VALIDATION.md) |
| PID 서보 실험대 | Verified | [pid-servo/VALIDATION.md](pid-servo/VALIDATION.md) |
| 열전도 단면 실험실 | Verified | [heat-diffusion/VALIDATION.md](heat-diffusion/VALIDATION.md) |
| 트러스 하중 실험실 | Verified | [truss-lab/VALIDATION.md](truss-lab/VALIDATION.md) |

검증 상태는 2026-09-22의 WSL2 Node 수치 검사, Chromium/SwiftShader 실제 RAF·조작·모바일 배치 검사 및 독립 리뷰 범위를 뜻합니다. 각 기록에는 실제 명령, 오차 기준·실측치, 수정 내역과 미검증 범위가 있습니다. 실제 모바일 GPU, Safari/Firefox, 장시간 실기기 성능은 검증하지 않았습니다. BFCache는 대부분 합성 pagehide/pageshow 이벤트로 경로를 확인했으며 실제 캐시 적중을 보장하지 않습니다. CDN/WebGL이 필요합니다.

수치 검사는 각 HTML의 실제 계산 함수를 추출합니다. 실행 명령은 각 검증 문서를 참조하세요. 브라우저 검사에는 기존 WSL Playwright/Chromium 경로가 사용되므로 다른 환경에서는 경로 조정이 필요합니다. 여러 검사를 실행할 때는 `flock /tmp/threejs-stem-browser.lock`으로 브라우저 전체 수명을 직렬화합니다. 검증 스크립트와 캡처는 데모 실행에 필요하지 않습니다.

## 소스 전용 구조 전환 가능 여부

전환 가능합니다. 루트 `index.html`만 실행 페이지로 두고, 각 데모를 `mount(container)`로 시작하고 `dispose()`로 종료하는 JavaScript 모듈로 분리하면 개별 실행 HTML이 필요 없어집니다. 현재는 독립 단일 HTML 구성을 유지하며, 소스 전용 전환은 수행하지 않았습니다.

전환 시 필요한 작업:

- 동일한 Three.js 0.183.0 import map을 루트에서 공유합니다.
- 각 데모의 HTML UI와 CSS를 분리하고 `body`, `:root`, 중복 ID와 DOM 조회를 데모 컨테이너 범위로 제한합니다.
- 성소·실험실의 기존 종료 함수를 모듈 생명주기에 연결합니다.
- 확률 데모 3개에 애니메이션 취소, 이벤트·타이머·ResizeObserver 해제, 렌더러·재질·텍스처 정리를 추가합니다.
- 구슬 1,000개 확률 데모 2개의 전역 준비 상태 플래그와 모션 설정 변경 시 전체 페이지를 새로고침하는 동작을 모듈 내부 상태로 바꿉니다.

## 관리

- 데모 수정은 해당 폴더의 장면 이름 HTML 파일에서 진행합니다.
- 이미지 등 로컬 리소스를 추가할 때는 해당 데모 폴더에 두고 상대 경로로 연결합니다.
- 새 데모는 별도 폴더에 추가하고 루트 `index.html`의 메뉴와 위 목록에 등록합니다.
- 이동 전 루트 HTML 주소는 변경되었습니다. 기존 즐겨찾기는 위 실행 파일 경로로 갱신합니다.
