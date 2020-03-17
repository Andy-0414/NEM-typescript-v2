# NEM-typescript-v2

Node.js + Express + MongoDB + Typescript 를 사용하여 서버 탬플릿을 제작했습니다.

기본적인 로그인, 글쓰기, 댓글쓰기가 구현된 탬플릿입니다.

# GET STARTED

.env

```
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
-   주석 개선

# Router

| Name         | URL                            | Method | Require Token | Request                                        | Response                          |
| ------------ | ------------------------------ | ------ | ------------- | ---------------------------------------------- | --------------------------------- |
| 회원가입     | /auth/users                    | POST   | X             | {email:String,password:String,username:String} | {result: true}                    |
| 로그인       | /auth/users/login              | POST   | X             | {email:String,password:String}                 | {result: true,data:"TOKEN"}       |
| 내정보       | /auth/users/my                 | POST   | O             | X                                              | {result:true,data:"USER_DATA"}    |
| 내정보변경   | /auth/users/:id                | PUT    | O             | {username:String}                              | {result:true}                     |
| 비밀번호변경 | /auth/users/:id/reset-password | POST   | O             | {password:String}                              | {result:true}                     |
| 토큰재발급   | /auth/users/token              | POST   | O             | X                                              | {result: true,data:"TOKEN"}       |
| 계정리스트   | /auth/users                    | GET    | X             | X                                              | {result: true,data:["USER DATA"]} |
| 계정조회     | /auth/users/:id                | GET    | X             | X                                              | {result: true,data:"USER DATA"}   |
| 계정삭제     | /auth/users/:id                | DELETE | O             |                                                | {result: true}                    |

-   POST /post
-   GET /post
-   GET /post/:id
-   PUT /post/:id
-   DELETE /post/:id

-   POST /comment
-   GET /comment
-   GET /comment/:id
-   PUT /comment/:id
-   DELETE /comment/:id
