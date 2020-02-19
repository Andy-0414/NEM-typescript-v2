# NEM-typescript-v2

Node.js + Express + MongoDB + Typescript 를 사용하여 서버 탬플릿을 제작했습니다.

기본적인 로그인, 글쓰기, 댓글쓰기가 구현된 탬플릿입니다.

# GET STARTED

.env
```
SECRET_KEY=STRING
PORT=NUMBER
```

```
npm install
```
```
npm start
```

# TODO LIST

-   ~~express를 사용하여 기본적인 템플릿 환경 구성~~
-   ~~MVC 패턴을 참고하여 기본적인 템플릿 환경 구성~~
-   ~~RESTful API 가이드라인을 참고하여 템플릿 환경 구성~~
-   ~~사용자인 User 스키마를 구현 ( JWT를 사용하여 인증함 )~~
-   ~~게시글인 Post 스키마를 구현~~
-   ~~댓글인 Comment 스키마를 구현~~~
-   ~~async, await을 사용해서 구현하기~~
-   ~~User 최근 로그인 시간 버그 픽스~~
-   ~~클래스를 사용해서 SendRule 병합하기~~
-   테스트 케이스 만들기
-   토큰 만료 및 갱신 제작하기
-   RESTfulAPI 문서만들기