# NEM-typescript-v2

Node.js + Express + MongoDB + Typescript 를 사용하여 서버 탬플릿을 제작했습니다.

기본적인 로그인, 글쓰기, 댓글쓰기가 구현된 탬플릿입니다.

# GET STARTED

.env

```
NODE_ENV=STRING // 개발환경 'development' , 'production'
REQUEST_URI=STRING // 배포 URL

DB_NAME=STRING
DB_URL=STRING

SECRET_KEY=STRING
TOKEN_EXPIRATION=NUMBER(ms)

SESSION=TRUE|FALSE(default:FALSE)
SESSION_REDIS=TRUE|FALSE(default:FALSE)
SESSION_EXPIRATION=NUMBER(ms)

PORT=NUMBER // default 3000
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
router 폴더 안에 ***.router.ts 파일을 자동으로 인식하여 라우팅해줍니다. (Router-Manager.ts 에서 바꿀 수 있음)

socket 폴더 안에 ***.socket.ts 파일을 자동으로 인식하여 소켓에 등록시킵니다. (Socket-Manager.ts 에서 바꿀 수 있음)

# TODO LIST

-   입력값 유효성 검사
-   이메인 인증 추가하기 // node mailer
-   영어 docs 만들어야함
-   다른 oAuth 추가해야함 (Naver, Google, Facebook, ...)

# Router

| Name             | URL                                  | Method | Require Token | Request                                        | Response                             |
| ---------------- | ------------------------------------ | ------ | ------------- | ---------------------------------------------- | ------------------------------------ |
| 회원가입         | /auth/users                          | POST   | X             | {userID:String,password:String,username:String} | {result: true}                       |
| 로그인           | /auth/users/login                    | POST   | X             | {userID:String,password:String}                 | {result: true,data:"TOKEN"}          |
| 내정보           | /auth/users/my                       | POST   | O             | X                                              | {result:true,data:"USER_DATA"}       |
| 내정보변경       | /auth/users/:id                      | PUT    | O             | {username:String}                              | {result:true}                        |
| 비밀번호변경     | /auth/users/:id/reset-password       | POST   | O             | {password:String}                              | {result:true}                        |
| 프로필이미지변경 | /auth/users/:id/change-profile-image | POST   | O             | {img:Base64}                                   | {result:true}                        |
| 토큰재발급       | /auth/users/token                    | POST   | O             | X                                              | {result: true,data:"TOKEN"}          |
| 계정리스트       | /auth/users                          | GET    | X             | X                                              | {result: true,data:["USER DATA"]}    |
| 계정조회         | /auth/users/:id                      | GET    | X             | X                                              | {result: true,data:"USER DATA"}      |
| 계정삭제         | /auth/users/:id                      | DELETE | O             | X                                              | {result: true}                       |
| 글생성           | /post                                | POST   | O             | {title:String,content:String}                  | {result: true,data:"POST DATA"}      |
| 글리스트         | /post                                | GET    | X             | X                                              | {result: true,data:["POST DATA"]}    |
| 글조회           | /post/:id                            | GET    | X             | X                                              | {result: true,data:"POST DATA"}      |
| 글댓글조회       | /post/:id/get-comments               | GET    | X             | X                                              | {result: true,data:["COMMENT DATA"]} |
| 글갱신           | /post/:id                            | PUT    | O             | {title:String,content:String}                  | {result: true,data:"POST DATA"}      |
| 글삭제           | /post/:id                            | DELETE | O             |                                                | {result: true,data:"POST DATA"}      |
| 댓글생성         | /comment                             | POST   | O             | {post:"POST ID",content:String}                | {result: true,data:"COMMENT DATA"}   |
| 댓글조회         | /comment/:id                         | GET    | X             | X                                              | {result: true,data:"COMMENT DATA"}   |
| 댓글갱신         | /comment/:id                         | PUT    | O             | {title:String,content:String}                  | {result: true,data:"COMMENT DATA"}   |
| 댓글삭제         | /comment/:id                         | DELETE | O             |                                                | {result: true,data:"COMMENT DATA"}   |
