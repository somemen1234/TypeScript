<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) Nestjs를 이용한 공연 예매 웹 서비스
---
## 1. user & auth
 ### 1-1. 회원가입
   - 비밀번호과 가입 유형이 두 가지 형태로만 들어오도록 파이프를 만들어 validation check(기본 형식은 내장 validationPipe 사용)
   - 이미지 업로드는 업로드 미들웨어 작성해서 미들웨어를 통해 이미지가 업로드 되도록 설정
   - DB에 접근해야 하는 valiation(존재하는 이메일인지 여부)은 서비스에 넘겨줘서 유효성 검사 실시(암호는 bycrypt사용)
 ### 1-2. 로그인
   - DB에 접근해야 하는 validation은 서비스에서 처리
   - 이메일과 암호가 맞다면 jwt를 생성하고 생성된 토큰을 헤더에 담아 프론트에 전달(프론트는 이 토큰을 react의 보관하는 장소 같은 곳에 보관해 두었다가 인증이 필요할 때 넣어서 보냄)
 ### 1-3. 내 정보조회
   - 자체적으로 authGuard를 만들어 전달받은 토큰이 redis에 블랙리스트로 등록되어 있는 토큰인지 검증 후 검증이 완료되면 jwt생성 시, 담아준 Payload내의 값(user 정보)을 출력해줌으로서 구현
 ### 1-4. 로그아웃
   - 로그아웃 시, 우선 전달 받은 토큰을 검증 후 해당 토큰과 해당 토큰의 남은 유효시간(토큰 유효시간-현재시간)을 redis에 저장(redis에 저장된 토큰 값은 해당 토큰의 남은 유효시간 동안 존재하게 되며 같은 토큰을 헤더로 담아 보낼 경우 이미 로그아웃된 토큰(만료된 토큰)이라는 것을 식별하기 위함)
---
## 2. show
 ### 2-1. 공연 등록
   - 커스텀한 authGuard를 통해 검증을 먼저 하고 해당 유저가 공연을 등록할 권한이 있는지(is_admin이 ORGANIZER인지) 확인하는 유효성 검사
   - 입력받은 좌석의 등급/좌석수(등급은 4가지 enum, 좌석수는 최대 40석으로 고정)를 입력받되, 좌석수를 입력했으나 금액을 입력하지 않은 경우 오류로 판단하고 금액만 입력할 시, 인식하지 못하는 로직으로 구현 & 최초 등록하는 좌석수와 각 등급별 좌석 수의 합이 같은 지 또한 검증 후 틀리다면 오류 반환하는 validation check
   - 이미지는 part 1에서처럼 미들웨어를 통해 해당 이미지의 주소값이 저장되도록 설정
   - 우선 같은 지역과 같은 시간 대의 공연이 있는지 validation check를 하고 없다면 공연부터 만든 후 입력받은 등급과 좌석 수만큼의 seat 데이터를 생성(좌석 생성 과정은 모두 트랜잭션을 걸었으며 만일 오류가 나서 rollback이 되었다면 생성한 공연도 삭제되도록 설정
 ### 2-2. 공연 전체 조회
   - 전체 조회는 조건 없이 조회가 가능하며 최신순으로 정렬되도록 함
 ### 2-3. 공연 검색
   - 검색 키워드는 쿼리에서 받고(키워드는 두글자 이상의 문자열) 해당 키워드가 포함되는 이름이 모두 검색이 되도록 구현(최신 순)
 ### 2-4. 공연 상세 조회
   - param으로 공연id를 받게 되면 해당 id를 가진 공연을 출력해주는 데, 공연이 없다면 오류 반환 & 해당 공연의 좌석이 모두 예약이 되어있는지 확인하는 로직을 추가 해 빈 좌석이 있는 경우 available을 true로 보여주도록 구현
---
## 3. reservation
 ### 3-1. 공연 예약
   - 여러 좌석 번호를 body로 입력받고 공연id는 param으로 입력 받아 입력받은 좌석 번호들이 유효한지(해당 공연에 없는 좌석번호가 아닌지 & 이미 예약이 되어있는지를 커스텀 pip를 통해 validation check) 확인
   - 또한 유효성 검사를 하면서 해당 좌석의 금액들을 미리 totalPrice에 더해둔 후 요청을 보낸 유저의 point가 적다면 예매를 못하게 처리
   - 예약은 먼저 reservation 데이터가 만들어지고 내부 로직을 모두 트랜잭션 처리를 해서 오류가 나서 rollback되었다면 만들어진 reservation 데이터 또한 사라지도록 처리
   - 트랜잭션 내용은 reservation_details에 데이터가 추가되고 해당 좌석의 reservation을 false로 막아 예약이 되었다고 식별할 수 있게 해줌, 그리고 유저의 point를 totalPrice만큼 차감하는 것으로 구현
 ### 3-2. 내 예약 전체 조회
   - 내가 예약했었던 내역을 전체 조회해주도록 구현했고 현재 예약상태를 보여줘(0이면 예약취소, 1이면 예약완료) 예약이 취소 되었는지를 구분 할 수 있게 구현(1인 경우에는 예약한 좌석 수 도 표시되도록 설정)
 ### 3-3. 내 예약 상세 조회
   - 해당 개별 예약의 상세조회를 위해서는 예약이 취소가 되지 않았을 경우에만 조회가 가능하도록 설정(우선적으로 예약 정보가 존재하는 지 & 취소된 예약 정보인지를 validation check)
 ### 3-4. 예약 취소
   - 취소 또한 예약이 이미 취소가 되어있지 않고 존재하는지 확인하는 로직을 먼저 수행하도록 설정 & 추가로 해당 공연 시간을 가져와 현재 시간이 공연 시간의 3시간 전내에 속해있을 경우에도 취소할 수 없도록 validation check를 추가
   - 취소 시, 해당 예약의 reservation_status를 false로 바꾸고 트랜잭션을 걸어 reservation_details에 있는 데이터를 삭제(해당 예약id)하고 좌석의 reservation 상태도 false로 만들어주고 유저에게 totalPrice만큼 금액을 환불 해주는 것으로 구현(트랜잭션 오류 시, reservation_status는 다시 true로 돌아가도록 함)
---
## 4. etc
 ### 4-1. httpExceptionFilter
   - 컨트롤 / 서비스 / 커스텀 파이프 / 커스텀 가드 등등에서 사용되는 에러가 발생되는 throw 구문에서의 에러를 global로 선언해 줌으로서 해당 httpExceptionFilter에서 받아서 일괄적으로 처리가 되도록 filter를 추가했었는데, 내장 validationPipe에서 수행되는 유효성 검사에 경우는 작성한 오류 메시지가 반환되지 않는 현상이 발생되어서 일단은 제외해두고 추후 알아본 후 변경해서 추가 예정
 ### 4-2. JwtStrategy
   - jwt 전략은 passportStrategy를 상속받아 작성했고 해당 토큰의 유효성을 검증한 후 검증이 되었다면 토큰에 해당하는(Payload에 담겨있는 id)유저를 찾아 해당 유저의 정보를 authGuard로 반환
