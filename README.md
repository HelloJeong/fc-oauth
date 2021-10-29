# OAuth

_Fastcampus Node OAuth 강의 내용을 정리해둔 자료입니다._

`.env`

```
FB_APP_ID=
FB_CLIENT_SECRET=
MONGO_PASSWORD=
MONGO_CLUSTER=
MONGO_USER=
MONGO_DBNAME=
SERVER_SECRET=
```

### 장점

- 유저 진입장벽이 매우 낮아진다.(원 클릭 로그인)
- 유저가 비밀번호를 기억할 필요가 없어진다.
- 유저 허용 여부에 따라 이메일, 프로필 사진, 닉네임 등의 기본 정보를 얻을 수 있다.

## Facebook OAuth(v12.0)

- https 요청을 해야하는데 이 때 `ngrok`을 사용.

  - 특정 포트에 대해 localhost가 아닌 https 도메인을 열어줌

- 흐름

  1. facebook 로그인
  1. facebook에서 전달해준 AccessToken을 획득
  1. 위의 AccessToken을 통해 우리 서비스에서 사용할 AccessToken을 획득
     1. Token 검증을 위해 APP Access Token을 생성
     1. 그 후 Debug Token을 통해 Token을 검증

## Cookie & JWT

## Passport
