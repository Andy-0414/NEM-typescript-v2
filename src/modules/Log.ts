import * as chalk from "chalk";
import * as moment from "moment";
import "moment-timezone";
moment.tz.setDefault("Asia/Seoul");
class Log {
	/**
	 * @description 현재 시간을 가져옵니다.
	 * @returns {string} 현재 시간을 문자열로 반환 ( YYYY-MM-DD HH:mm:ss )
	 */
	public getTime(): string {
		return moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
	}
	private _defaultLogFormat(str: string): boolean {
		console.log(chalk.grey(`[${this.getTime()}] `) + str);
		return true;
	}
	/**
	 * @description 디버그 로그입니다.
	 * @param {string} 출력 문자열
	 * @returns {boolean} 성공 여부
	 */
	public d(str: string): boolean {
		return this._defaultLogFormat(chalk.underline.cyan(str));
	}
	/**
	 * @description 정보 로그입니다.
	 * @param {string} 출력 문자열
	 * @returns {boolean} 성공 여부
	 */
	public i(str: string): boolean {
		return this._defaultLogFormat(chalk.white(str));
	}
	/**
	 * @description 성공 로그입니다.
	 * @param {string} 출력 문자열
	 * @returns {boolean} 성공 여부
	 */
	public c(str: string): boolean {
		return this._defaultLogFormat(chalk.green(str));
	}
	/**
	 * @description 경고 로그입니다.
	 * @param {string} 출력 문자열
	 * @returns {boolean} 성공 여부
	 */
	public w(str: string): boolean {
		return this._defaultLogFormat(chalk.yellow(str));
	}
	/**
	 * @description 에러 로그입니다.
	 * @param {string} 출력 문자열
	 * @returns {boolean} 성공 여부
	 */
	public e(str: string): boolean {
		return this._defaultLogFormat(chalk.red(str));
	}
}
export default new Log();
