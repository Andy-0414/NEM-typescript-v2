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

```
npm install
```

```
npm start
```

# TODO LIST

-   테스트 케이스 만들기 ( mocha )
-   라우터 문서 구체화해야함

# Router

-   auth

    -   POST /auth/users/login
    -   POST /auth/users/my
    -   POST /auth/users/token
    -   POST /auth/users
    -   GET /auth/users
    -   GET /auth/users/:id
    -   POST /auth/users/:id/reset-password
    -   PUT /auth/users/:id
    -   DELETE /auth/users/:id

-   post

    -   POST /post
    -   GET /post
    -   GET /post/:id
    -   PUT /post/:id
    -   DELETE /post/:id

-   comment
    -   POST /comment
    -   GET /comment
    -   GET /comment/:id
    -   PUT /comment/:id
    -   DELETE /comment/:id
