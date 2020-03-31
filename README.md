# NEM-typescript-v2

Node.js + Express + MongoDB + Typescript 를 사용하여 서버 탬플릿을 제작했습니다.

기본적인 로그인, 글쓰기, 댓글쓰기가 구현된 탬플릿입니다.

# GET STARTED

.env

```
NODE_ENV=STRING

DB_NAME=STRING
DB_URL=STRING

SECRET_KEY=STRING
PORT=NUMBER
TOKEN_EXPIRATION=NUMBER(ms)
```

설치

```
npm install
```

배포

```
npm start
```

개발

```
npm run serve
```

# TODO LIST

-   테스트 케이스 만들기 ( mocha )
-   프로필 사진 설정 만들어야함
-   env 상세 설명 추가해야함
-   cors 설정
-   개발용 환경변수 추가하기

# Router

| Name         | URL                            | Method | Require Token | Request                                        | Response                             |
| ------------ | ------------------------------ | ------ | ------------- | ---------------------------------------------- | ------------------------------------ |
| 회원가입     | /auth/users                    | POST   | X             | {email:String,password:String,username:String} | {result: true}                       |
| 로그인       | /auth/users/login              | POST   | X             | {email:String,password:String}                 | {result: true,data:"TOKEN"}          |
| 내정보       | /auth/users/my                 | POST   | O             | X                                              | {result:true,data:"USER_DATA"}       |
| 내정보변경   | /auth/users/:id                | PUT    | O             | {username:String}                              | {result:true}                        |
| 비밀번호변경 | /auth/users/:id/reset-password | POST   | O             | {password:String}                              | {result:true}                        |
| 토큰재발급   | /auth/users/token              | POST   | O             | X                                              | {result: true,data:"TOKEN"}          |
| 계정리스트   | /auth/users                    | GET    | X             | X                                              | {result: true,data:["USER DATA"]}    |
| 계정조회     | /auth/users/:id                | GET    | X             | X                                              | {result: true,data:"USER DATA"}      |
| 계정삭제     | /auth/users/:id                | DELETE | O             | X                                              | {result: true}                       |
| 글생성       | /post                          | POST   | O             | {title:String,content:String}                  | {result: true,data:"POST DATA"}      |
| 글리스트     | /post                          | GET    | X             | X                                              | {result: true,data:["POST DATA"]}    |
| 글조회       | /post/:id                      | GET    | X             | X                                              | {result: true,data:"POST DATA"}      |
| 글댓글조회   | /post/:id/get-comments         | GET    | X             | X                                              | {result: true,data:["COMMENT DATA"]} |
| 글갱신       | /post/:id                      | PUT    | O             | {title:String,content:String}                  | {result: true,data:"POST DATA"}      |
| 글삭제       | /post/:id                      | DELETE | O             |                                                | {result: true,data:"POST DATA"}      |
| 댓글생성     | /comment                       | POST   | O             | {post:"POST ID",content:String}                | {result: true,data:"COMMENT DATA"}   |
| 댓글조회     | /comment/:id                   | GET    | X             | X                                              | {result: true,data:"COMMENT DATA"}   |
| 댓글갱신     | /comment/:id                   | PUT    | O             | {title:String,content:String}                  | {result: true,data:"COMMENT DATA"}   |
| 댓글삭제     | /comment/:id                   | DELETE | O             |                                                | {result: true,data:"COMMENT DATA"}   |
