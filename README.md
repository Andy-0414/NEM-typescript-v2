# NEM-typescript-v2

Node.js + Express + MongoDB + Typescript 를 사용하여 서버 탬플릿을 제작했습니다.

기본적인 로그인, 글쓰기, 댓글쓰기가 구현된 탬플릿입니다.

# GET STARTED

.env

```
NODE_ENV=STRING // 개발환경 'development' , 'production'
REQUEST_URI=STRING // 배포 URL

DB_URI=STRING // DB 접근 주소 (mongodb://....)
MONGODB_URI=STRING // DB 접근 주소 (heroku) (mLab 기본제공 URI)

SECRET_KEY=STRING // 암호화 키
TOKEN_EXPIRATION=NUMBER(ms) // 토큰 만료 시간

SESSION=TRUE|FALSE(default:FALSE) // 세션 모드 사용 여부
SESSION_REDIS=TRUE|FALSE(default:FALSE) // 세션 REDIS 사용 여부
SESSION_EXPIRATION=NUMBER(ms) // 세션 만료 시간

PORT=NUMBER (default 3000) // 포트
```

실행

```
npm install
npm start
```

개발

```
npm run serve
```

테스트

```
npm test
```

# AUTO ROUTING

router 폴더 안에 \*\*\*.router.ts 파일을 자동으로 인식하여 라우팅해줍니다. (Router-Manager.ts 에서 바꿀 수 있음)

socket 폴더 안에 \*\*\*.socket.ts 파일을 자동으로 인식하여 소켓에 등록시킵니다. (Socket-Manager.ts 에서 바꿀 수 있음)

# TODO LIST

-   이메인 인증 추가하기 // node mailer
-   라우터 설명 다시 작성 필요함.
-   어드민 계정 생성

# Router

## admin

## auth

-   POST /auth/user : 회원가입

> Body

    userID: 유저 아이디 [String] REQUIRE
    password: 유저 비밀번호 [String] REQUIRE

    username?: 유저 이름 [String]
    email?: 이메일 [String]

> Response

    result: 결과 [Boolean]
    data: {
        _id: 고유 번호 [String]
        userID: 유저 아이디 [String]
        ...
    }

-   GET /auth/user

> Response

    result: 결과 [Boolean]
    data: [{
        _id: 고유 번호 [String]
        userID: 유저 아이디 [String]
        ...
    }]

-   GET /auth/user/:\_id

> Response

    result: 결과 [Boolean]
    data: {
        _id: 고유 번호 [String]
        userID: 유저 아이디 [String]
        ...
    }

-   PUT /auth/user/:\_id

> Header - Token

    Authorization: 유저 토큰 [String]

> Body

    username?: 유저 이름 [String]
    email?: 이메일 [String]

> Response

    result: 결과 [Boolean]
    data: [{
        _id: 고유 번호 [String]
        userID: 유저 아이디 [String]
        ...
    }]

-   DELETE /auth/user/:\_id

> Header - Token

    Authorization: 유저 토큰 [String]

> Response

    result: 결과 [Boolean]
    data: {
        _id: 고유 번호 [String]
        userID: 유저 아이디 [String]
        ...
    }

-   POST /auth/user/login

> Body

    userID: 유저 아이디 [String] REQUIRE
    password: 유저 비밀번호 [String] REQUIRE

> Response - Token

    result: 결과 [Boolean]
    data: 유저 토큰 [String]

> Response - Session

    result: 결과 [Boolean]
    data: {
        _id: 고유 번호 [String]
        userID: 유저 아이디 [String]
        ...
    }

-   POST /auth/user/logout

> Header - Token

    Authorization: 유저 토큰 [String]

> Response

    result: 결과 [Boolean]

-   POST /auth/user/:\_id/reset-password

> Header - Token

    Authorization: 유저 토큰 [String]

> Body

    password: 새 비밀번호 [String]

> Response

    result: 결과 [Boolean]
    data: {
        _id: 고유 번호 [String]
        userID: 유저 아이디 [String]
        ...
    }

-   POST /auth/user/:\_id/change-profile-image

> Header - Token

    Authorization: 유저 토큰 [String]

> Body

    img: BASE64 이미지 문자열 [String]

> Response

    result: 결과 [Boolean]
    data: {
        _id: 고유 번호 [String]
        userID: 유저 아이디 [String]
        ...
    }

-   POST /auth/user/token

> Header - Token

    Authorization: 유저 토큰 [String]

> Response

    result: 결과 [Boolean]
    data: 새 유저 토큰 [String]

-   GET /auth/user/my

> Header - Token

    Authorization: 유저 토큰 [String]

> Response

    result: 결과 [Boolean]
    data: {
        _id: 고유 번호 [String]
        userID: 유저 아이디 [String]
        ...
    }

## post

TODO

## comment

TODO
