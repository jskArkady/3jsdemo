# 선형변환 공간 실험실 · 검증 기록

최종 상태: 완료(Verified). 소유 범위는 `linear-transform/`이며 공통 메뉴·README는 변경하지 않았다.

## 산출물과 갤러리 등록

- 진입 파일: `linear-transform/linear-transform.html`
- 카드 제목: 선형변환 공간 실험실
- 카드 설명: 3×3 행렬로 기저·격자·단위구를 변형하며 행렬식, 차원과 특이값을 탐구합니다.
- 새 런타임 의존성 없음. 기존과 같은 단일 HTML, Three.js 0.183.0 import map/CDN 사용.
- 실제 조작: 9칸 행렬 입력 후 적용, 7개 프리셋(항등·축별 확대·xy 전단·z 회전·반사·평면 투영·대칭 결합), 보간 슬라이더, 재생/일시정지, 0.5/1/2배속, 초기화, 격자/구/큐브/기저/대칭 고유축/특이값 주축 토글, 정면/상부/사선 보기, 자동 카메라.
- 모바일은 장면 다음에 세로 스크롤하는 조작 패널, 데스크톱·가로 모바일은 독립 스크롤 패널을 사용한다.

## 수학과 표시의 범위

열벡터 `y = Ax`, 입력·계산 배열은 row-major다. 실제 점 좌표에 같은 `apply` 함수를 적용하므로 Three.js column-major 배열로 전환하지 않는다. 원점 고정, 길이·부피비 무차원, 단위구 반지름 1, 큐브 `[0,1]³`. 원본은 ghost 선, 결과는 청록 선이며 특이행렬의 역행렬·법선은 사용하지 않는다. 영행렬도 원점의 점이 남는다.

현재 행렬은 `A(u)=(1-u)I+uA`이며 수치·기저·격자·구·큐브가 동일 행렬을 사용한다. 회전 프리셋의 중간 경로는 순수 회전이 아니며 반사 보간 중 rank가 줄 수 있다. 재생은 편도 4초(1×)의 왕복이다. 대수 계산이므로 물리 시간 적분/단위/적분 안정 조건은 해당하지 않는다. 보간은 RAF delta를 최대 0.05초로 제한해 숨김·지연 복귀 시 큰 점프를 방지한다. 부하 상황에서는 실제 보간이 느려질 수 있다. FPS는 제한 전 실제 경과시간을 사용한다.

`A`를 `max|A|`로 정규화한 뒤 `AᵀA`의 대칭 Jacobi 고유값을 제곱근하고 원래 스케일을 복원해 특이값을 구한다. 영행렬은 별도로 0을 유지한다. 이 방식은 극소 입력에서 Gram 언더플로로 rank가 0이 되는 문제를 피한다. Double 표현 범위보다 작은 비영 행렬식은 정규화 행렬식과 로그값으로 지수표기한다. 음의 고유값은 `64·ε·max|정규화된 AᵀA|` 이내일 때만 0으로 처리하고 그보다 음수이면 오류로 판단한다. rank는 `σ > 10⁻⁷σmax`의 개수이며 영행렬은 0이다. 정상방정식 방식의 정밀도 한계에 맞춘 교육용 수치 rank이며 정확한 기호 rank가 아니다. 조건수가 큰 행렬의 작은 특이값은 정확도가 낮을 수 있다.

특이값 주축은 `±Avᵢ` 끝점으로 그려 타원체 반축 길이가 σ가 되며 σ=0에서 붕괴한다. 대칭 행렬에만 단위 고유축을 제공하고 λ 수치를 별도로 표시한다. 대칭 판정 상대 허용오차는 `10⁻¹² max|A|`, 중복 방향 안내 기준은 값의 상대 차 `10⁻⁶`. 중복 축의 방향은 유일하지 않으며 개별 축 연속성을 보장하지 않는다. 일반 비대칭 행렬의 복소 고유벡터는 범위 밖이다.

시작·적용·프리셋은 u=1에서 정지. 빈칸·NaN·Infinity·범위 초과는 기존 행렬을 유지한다. 슬라이더 조작은 정지, 초기화는 모든 시작 설정 복원. 자동 카메라는 명시적으로 켜야 하며 재생 중에만 회전한다. reduced-motion은 정지/고정 상태로 시작하고 실행 중 설정이 바뀌어도 정지한다. 마우스 이동 반응은 없다.

## 실행 검증

WSL2 Linux / Node v24.16.0. 실제 HTML의 `math-core`를 추출·실행하므로 별도 복사 수학 구현을 검증한 것이 아니다.

```sh
node linear-transform/test-math.cjs
node --check /tmp/linear-transform-module.mjs
flock /tmp/threejs-stem-browser.lock node linear-transform/test-browser.cjs
```

수치 검사 2,013개 행렬: 항등·대각·전단·반사·rank2·영행렬, 회전 직교성/det/σ, 대칭·중복 고유값, 작은 스케일·수치 rank 임계값, 반사 보간 중간 특이행렬, 1,000개 고정 시드 일반행렬과 1,000개 대칭행렬. `1e-200 I`와 `1e-5 I` 경계 사례, 입력 유효성 및 열벡터 좌표도 검사한다.

| 항목 | 허용오차 | 실측 최대 오차 |
| --- | --- | --- |
| 고유방정식 잔차 / max(1, Frobenius norm) | 1e-9 | 1.5731618486893707e-15 |
| 고유벡터 직교성 | 1e-9 | 1.3322676295501878e-15 |
| 특이값 곱−abs(det) / max(1, abs(det)) | 1e-7 | 7.582977431738747e-12 |
| 보간 실제 기저 좌표(Float32 GPU buffer) | 1e-6 | 통과 |
| 보간 현재 행렬(Double) | 1e-12 | 통과 |

구문 검사 통과. 브라우저는 기존 Playwright `/home/bayta/.cache/ms-playwright-go/1.57.0/package`, `/snap/chromium/current/usr/lib/chromium-browser/chrome`와 SwiftShader를 재사용한다. port 0으로 로컬 HTTP 서버를 띄우며 브라우저 수명 전체에 공통 flock을 적용한다. 기본 sandbox의 listen EPERM 때문에 승인된 권한 확장으로 같은 검증을 실행했다.

실제 RAF를 실행한 Chromium 검증: 렌더·콘솔 오류 0, 모든 프리셋, 빈칸 거부와 행렬 유지, 영행렬/rank2/중간 반사, 실제 보간 기저 좌표와 행렬 일치, 비대칭 고유축 비활성화, 주축 토글, 재생·정지·자동 카메라 동시 정지, 카메라만 고정 후 보간 진행, 보기 3종, 초기화, 마우스 이동 무반응, 갤러리 링크, 1440×1000/390×844/844×390에서 편집·수평 넘침 없음, reduced-motion 시작, 수명 이벤트·자원 정리, CDN 차단 실패 안내를 통과했다. 추가로 `1e-200 I`/`1e-5 I`의 rank3·비영 det 표기, 721×1440에서 모든 행렬 원소가 3인 경우 카메라 far가 장면을 포함하는 조건도 통과했다.

스크린샷은 `/tmp/linear-transform-desktop.png`, `/tmp/linear-transform-390.png`, `/tmp/linear-transform-844.png` 및 모바일 `-top.png`에 기록한다. 스크린샷은 테스트 결과로서 데모 런타임에 필요하지 않다.

## 미검증 및 남은 위험

- 실제 모바일 기기 GPU·Safari/Firefox 및 실제 브라우저 BFCache 입출력은 미검증. BFCache의 pagehide/pageshow와 visibilitychange 처리는 합성 이벤트로 확인했다.
- 장시간 백그라운드 탭 전환·OS suspend, 실제 GPU 컨텍스트 손실은 미검증. 처리 코드를 리뷰하며 CDN 로드 실패는 실제 요청 차단으로 시험했다.
- headless SwiftShader의 FPS를 실제 GPU 성능으로 일반화하지 않는다.
- 네트워크/CDN·WebGL이 필요하며 실패 시 안내를 표시한다. 매우 조건이 나쁜 행렬의 작은 특이값 및 중복 고유축 방향의 비유일성은 위 수치 한계를 따른다. GPU 좌표는 Float32이므로 극소 도형은 점으로 보일 수 있으며 수치표(Double 및 로그 표기)와 표현 정밀도가 다르다.

## 참고한 수학 원자료

- [3Blue1Brown: Linear transformations and matrices](https://www.3blue1brown.com/lessons/linear-transformations/): 기저 열벡터와 공간 변환 설명.
- [3Blue1Brown: Eigenvectors and eigenvalues](https://www.3blue1brown.com/lessons/eigenvalues/): 고유방향 해석.
- [Netlib LAPACK: Symmetric Eigenproblems](https://netlib.org/lapack/lug/node30.html): 대칭 고유문제와 직교 고유벡터.
- [Netlib LAPACK Working Note 169](https://www.netlib.org/lapack/lawnspdf/lawn169.pdf): Jacobi/SVD의 정확도와 정상방정식의 한계.

## 최종 독립 리뷰

별도 Reviewer가 실제 계획·HTML·테스트를 읽고 세 문제를 발견했다: 작은 비영 값의 0 표기, 극소 입력 Gram 언더플로, 세로 화면의 고정 far 잘림. 지수표기/정규화 계산/거리 기반 far 갱신으로 수정하고 각 재현 사례를 회귀 테스트에 추가했다. 수치·구문·전체 Chromium 검증을 수정 후 다시 실행했다. 재리뷰에서 극소 비중복 축을 중복으로 오판하는 절대 하한도 발견해 상대 기준으로 수정하고 실제 분석 함수의 회귀 테스트를 추가했다. 그 외 새 중대 문제는 발견되지 않았다.
