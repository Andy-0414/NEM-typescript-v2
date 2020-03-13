import * as mongoose from "mongoose";
import Log from "./Log";
/**
 * @description Mongo DB 관리 클래스
 */
class DB {
	private isDatabaseConnect: boolean = false;
	private db: mongoose.Connection;
	/**
	 * @description MongoDB 활성화
	 * @param {string}url MongoDB URL
	 */
	public init(url?: string): void {
		this.db = mongoose.connection;
		// 접속 실패 시
		this.db.on("error", () => {
			Log.e("Mongo DB 연결 실패");
			this.isDatabaseConnect = false;
		});
		// 접속 성공 시
		this.db.once("open", () => {
			Log.c("Mongo DB 연결 성공");
			this.isDatabaseConnect = true;
		});

		mongoose.set("useCreateIndex", true);
		mongoose.set("useUnifiedTopology", true);
		mongoose.connect(url || process.env.DB_URL || "mongodb://localhost/NEM-TEMPLATE-V2", { useNewUrlParser: true });
	}
	/**
	 * @description DB 연결 여부 확인
	 * @returns {boolean} DB 연결 여부
	 */
	public isConnectedDB(): boolean {
		return this.isDatabaseConnect;
	}
	/**
	 * @description DB 객체 반환
	 * @returns {mongoose.Connection} DB 객체
	 */
	public getDB(): mongoose.Connection {
		return this.db;
	}
}
export default new DB();
