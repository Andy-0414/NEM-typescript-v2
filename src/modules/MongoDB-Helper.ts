import mongoose from "mongoose";
import Log from "./Log";
import User from "../schema/User";
/**
 * @description Mongo DB 관리 클래스
 */
class DB {
	private isDatabaseConnect: boolean = false;
	private db: mongoose.Connection;

	public readonly env: string = process.env.NODE_ENV || "development";
	public readonly dbName: string = process.env.DB_NAME || `NEM-TEMPLATE-V2_${this.env}`;
	public readonly dbUrl: string = process.env.DB_URL || "mongodb://localhost/NEM-TEMPLATE-V2";
	public readonly dbUser: string = process.env.DB_USER || "";
	public readonly dbPass: string = process.env.DB_PASS || "";
	/**
	 * @description MongoDB 활성화
	 * @param {string}url MongoDB URL
	 */
	public init(url?: string): void {
		this.db = mongoose.connection;
		// 접속 실패 시
		this.db.on("error", () => {
			Log.e("Mongo DB connected fail");
			this.isDatabaseConnect = false;
		});
		// 접속 성공 시
		this.db.once("open", () => {
			Log.c("Mongo DB connected");
			this.isDatabaseConnect = true;
			User.createTestUser().then((user) => {
				if (user) Log.c("Create Test User");
			});
		});

		mongoose.set("useCreateIndex", true);
		mongoose.set("useUnifiedTopology", true);
		mongoose.connect(url || this.dbUrl, { user: this.dbUser, pass: this.dbPass, dbName: this.dbName, useNewUrlParser: true, useUnifiedTopology: true });
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
