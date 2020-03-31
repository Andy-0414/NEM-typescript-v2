import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import "dotenv/config";
import Log from "./modules/Log";
import DB from "./modules/MongoDB-Helper";
import SendRule from "./modules/Send-Rule";
import PassportJWTManager from "./modules/Passport-JWT-Auth";
import Router from "./router/index";
import ProjectInitializeManager from "./modules/Project-Initialize-Manager";

const app: express.Application = express(); // 서버 객체

app.use(morgan("dev")); // 개발용 로그 미들웨어
app.use(cors()); // CORS 설정 미들웨어
app.use(helmet()); // 보안 미들웨어
app.use(compression()); // 데이터 압축 미들웨어

app.use(express.static("public")); // public 폴더의 파일을 제공함
app.use(express.urlencoded({ limit: "20mb", extended: true })); // urlencode 지원
app.use(express.json({ limit: "20mb" })); // json 지원
app.use(PassportJWTManager.getInitialize());

app.listen(process.env.PORT || 3000, () => {
    // 서버가 열렸을 시 콜백
    // TODO: 로그 통일화 시켜야함
	Log.i(`server port : ${process.env.PORT || 3000}`);
});

ProjectInitializeManager.checkEnv();
DB.init(); // DB 연결

app.use(Router); // 라우터 연결
app.use(SendRule.autoErrorHandler()); // 에러 핸들링

export default app;
