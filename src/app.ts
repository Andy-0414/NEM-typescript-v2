import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import "dotenv/config";
import Log from "./modules/Log";
import SendRule from "./modules/Send-Rule";
import PassportManager from "./modules/Passport-Manager";
import Router from "./router/index";
import Socket from "./socket/index";
import ProjectInitializeManager from "./modules/Project-Initialize-Manager";
import MongoDBHelper from "./modules/MongoDB-Helper";
import RedisHelper from "./modules/Redis-Helper";

const app: express.Application = express(); // 서버 객체
const port = process.env.PORT || 3000;
const NODE_ENV = ProjectInitializeManager.env;

MongoDBHelper.init(); // MongoDB 연결
PassportManager.SESSION_REDIS && RedisHelper.init(); // Redis 연결

// 테스트 코드일 시 따로 처리
if (NODE_ENV == "TEST") Log.disableConsole();
else app.use(morgan("dev")); // 서비스 시 로그 출력

// .env 체크
ProjectInitializeManager.checkEnv();

app.use(
	cors({
		origin: NODE_ENV === "development" ? "*" : process.env.REQUEST_URI || "*", // FIXME: CORS 토큰 처리 안됨
		credentials: true,
	})
); // CORS 설정 미들웨어
app.use(helmet()); // 보안 미들웨어
app.use(compression()); // 데이터 압축 미들웨어

app.use(express.static("public")); // public 폴더의 파일을 제공함
app.use(express.urlencoded({ limit: "20mb", extended: true })); // urlencode 지원
app.use(express.json({ limit: "20mb" })); // json 지원

const server = app.listen(port, () => {
	// 서버가 열렸을 시 콜백
	Log.i(`port : ${port}`);
});

// passport 로그인 연결
PassportManager.setApplication(app);

app.use(Router); // 라우터 연결
app.use(SendRule.autoErrorHandler()); // 에러 핸들링

// 소켓 시작
Socket.start(server);

export default app;
