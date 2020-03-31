import fs from "fs";
import path from "path";
import Log from "./Log";

class ProjectInitializeManager {
	public env: string = process.env.NODE_ENV || "development";
	checkEnv() {
		Log.i(`NODE_ENV : ${this.env}`);
		try {
			fs.accessSync(path.join(__dirname, ".env"), fs.constants.F_OK);
		} catch (err) {
			Log.e(".env file not found");
		}
		// TODO: ENV 개인설정 만들어야함
	}
}

export default new ProjectInitializeManager();
