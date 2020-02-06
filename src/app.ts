import * as express from "express";
import * as cors from "cors";
import * as helmet from "helmet";
import * as compression from "compression";
import * as morgan from "morgan";

import "dotenv/config";
import Log from "./modules/Log";
import DB from "./modules/MongoDB-Helper";
import SendRule from "./modules/Send-Rule";

const app: express.Application = express(); // 서버 객체

app.use(morgan("dev")); // 개발용 로그 미들웨어
app.use(cors()); // CORS 설정 미들웨어
app.use(helmet()); // 보안 미들웨어
app.use(compression()); // 데이터 압축 미들웨어

app.use(express.static("public")); // public 폴더의 파일을 제공함
app.use(express.urlencoded({ limit: "20mb", extended: true })); // urlencode 지원
app.use(express.json({ limit: "20mb" })); // json 지원

app.listen(process.env.PORT || 3000, () => {
	// 서버가 열렸을 시 콜백
	Log.i(`SERVER OPEN | PORT : ${process.env.PORT || 3000}`);
});

DB.init();

app.use(SendRule.autoErrorHandler()); // 에러 핸들링

export default app;
