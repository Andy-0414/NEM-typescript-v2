import fs from "fs";
import Log from "./Log";
/**
 * @description .env 등의 프로젝트 설정을 다룹니다.
 */
class ProjectInitializeManager {
	// .env 환경 변수 리스트
	public readonly ENV_LIST: string[] = ["NODE_ENV", "DB_URI", "SECRET_KEY", "PORT", "TOKEN_EXPIRATION", "REQUEST_URI", "TESTUSER_NAME", "SESSION"];
	// 필수 환경 변수 리스트
	public readonly REQUIRED: string[] = ["NODE_ENV", "PORT"];
	// 개발 환경
	public readonly env: string = process.env.NODE_ENV || "development";
	/**
	 * @description .env를 체크합니다.
	 */
	public checkEnv(): void {
		let UNDIFINED_REQUIRED = this.REQUIRED.filter((key: string) => !process.env[key]);

		let informationString = `────────ENV (${this.env})────────`;
		!UNDIFINED_REQUIRED.length || Log.i(informationString);
		try {
			fs.accessSync(".env", fs.constants.F_OK);
			UNDIFINED_REQUIRED.forEach((key: string) => {
				Log.w(`${key} was not found in the .env file.`);
			});
		} catch (err) {
			Log.e(".env file not found");
		}
		!UNDIFINED_REQUIRED.length || Log.i(new Array(informationString.length).fill("─").join(""));
	}
}

export default new ProjectInitializeManager();
