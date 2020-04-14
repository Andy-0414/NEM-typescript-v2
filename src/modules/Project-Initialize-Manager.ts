import fs from "fs";
import Log from "./Log";

class ProjectInitializeManager {
	public readonly ENV_LIST: string[] = ["NODE_ENV", "DB_NAME", "DB_URL", "SECRET_KEY", "PORT", "TOKEN_EXPIRATION", "REQUEST_URI"];
	public readonly REQUIRED: string[] = ["NODE_ENV", "PORT"];

	public readonly env: string = process.env.NODE_ENV || "development";
	checkEnv() {
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
