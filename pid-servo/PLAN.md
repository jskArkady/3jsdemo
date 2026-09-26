# 7. PID 서보 실험대

## 목표
- ../stem-demos/PLAN.md 준수. pid-servo.html.
- 카트 위치 제어의 목표값·실제값·제어력을 연결하고 P/PI/PID, 외란과 포화를 비교한다.

## 모델
- 1축 질량–점성마찰 카트: x'=v, m v'=u-bv+d. 기본 m=1 kg, b=0.8 N·s/m. 중력·레일 마찰의 비선형성은 제외한다.
- e=r-x, 제어 u_raw=Kp e + Ki I - Kd v_f. 미분은 측정 속도에 적용해 setpoint kick을 줄인다. v_f는 선택한 저역필터 정의에 따라 갱신한다.
- u=clamp(u_raw, -u_max,+u_max), 기본 u_max=10 N. 적분 anti-windup은 조건부 적분(포화에서 회복 방향일 때만 적분) 또는 검증된 back-calculation 중 하나로 구현·표시한다.
- 기본 예: Kp=12, Ki=3, Kd=4. 제어기와 plant 업데이트 순서, 샘플 주기(예: 0.005 s)를 명시하고 실제 모델과 같은 함수로 테스트한다.
- 명령 step 및 sine tracking. 외란은 한 번 가하는 유한시간 힘 펄스(예: +2 N, 0.5 s). 충격량·순간 속도 변경과 혼동하지 않는다.
- 레일 끝은 시각 범위이며 숨겨진 clamp로 안정된 것처럼 보이게 하지 않는다. 수치 발산/표시 범위 초과는 정지와 안내·reset으로 처리한다.

## 화면
- 눈금이 있는 레일, 이동 카트, 목표 위치 ghost, 제어력과 외란 화살표. 현재 위치는 실제 계산 결과.
- r/x 그래프, 제어력 그래프 및 포화선, 오차 지표. 비교 preset은 동일 목표·외란 조건으로 시작한다.
- 성능 지표: step 기준 overshoot, 측정 중 최대오차, settling 여부. 정착시간은 관측 구간 내 ±2% 밴드 유지 조건을 정의하고 미래를 보장하지 않는다. 관측 부족은 '측정 중'.
- 이동 목표에서 step용 overshoot/정착시간을 그대로 사용하지 말고 RMS 추종 오차 등으로 전환한다.

## 조작
- Kp 0~40, Ki 0~15, Kd 0~15, m 0.5~3 kg, b 0~3, 목표 -1~1 m, 힘 제한 2~20 N(수치 검증 후 조정).
- 프리셋: P, PI, 감쇠 좋은 PID, overshoot 큰 제어, 포화·anti-windup 비교. 같은 실험 초기값으로 reset.
- anti-windup 토글, 외란 가하기, 목표 step/sine, pause/reset/한 제어 주기/0.25·1·2배속, 정면/사선/자동 카메라.
- 질량·제어기 프리셋 변경은 reset; 목표·gain 실시간 변경 시 지표 구간과 적분 상태 정책을 설명한다. 일시정지 중 외란은 다음 step부터 시작한다.

## 검증
1. 제어 OFF에서 외력 없음: b=0 등속, b>0 v=v0 exp(-bt/m)와 비교. 일정 힘·b=0 해와 비교.
2. Ki=0·포화 없음의 PD 특성 m s²+(b+Kd)s+Kp 확인; 임계감쇠 preset을 실제 시간응답으로 검증한다.
3. 상수 외란에서 P 정상오차 d/Kp, PI/PID의 오차 감소를 충분한 시간 적분해 확인(포화되지 않는 조건).
4. 힘 포화가 항상 u_max 이하, anti-windup ON이 포화 중 적분 폭주를 막고 회복하는지 확인. OFF 대비는 실측으로 보고한다.
5. dt/2 수렴·UI 최대값에서 finite 상태, pause 중 외란/step/reset, setpoint 변경 시 미분 kick 없는지 확인.
6. 측정 지표의 정의·부호·단위, 실제 RAF·화면·콘솔·자원 정리 검증을 기록.

## 참고
https://ctms.engin.umich.edu/CTMS/?example=Introduction&section=ControlPID
