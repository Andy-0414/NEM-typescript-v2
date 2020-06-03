/**
 * @description DB 관리 클래스
 */
export default abstract class DBHelper<DBConnect> {
	public isDatabaseConnect: boolean = false;
	/**
	 * @description DB 활성화
	 */
	public abstract init(): void;
	/**
	 * @description DB 연결 여부 확인
	 * @returns {boolean} DB 연결 여부
	 */
	public isConnectedDB(): boolean {
		return this.isDatabaseConnect;
	}
	public abstract getDB(): DBConnect
}
