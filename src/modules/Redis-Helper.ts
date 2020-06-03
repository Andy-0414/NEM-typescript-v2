import Redis from "redis";
import DBHelper from "./schema/DBHelper";
import Log from "./Log";
/**
 * @description Mongo DB 관리 클래스
 */
class RedisHelper extends DBHelper<Redis.RedisClient> {
	private db: Redis.RedisClient;
	/**
	 * @description MongoDB 활성화
	 * @param {string}url MongoDB URL
	 */
	public init(): void {
		this.db = Redis.createClient();
		// Redis 성공 여부 반환
		this.db.on("error", (err) => {
			// Redis 연결 실패 시 서버 종료
			this.db.quit();
			Log.e("Redis connected fail");
			Log.e("Server stop");
			process.exit();
		});
		this.db.on("ready", () => {
			// Redis 연결 성공 시
			Log.c("Redis connected");
		});
	}
	/**
	 * @description DB 객체 반환
	 */
	public getDB(): Redis.RedisClient {
		return this.db;
	}
}
export default new RedisHelper();
