import chalk from "chalk";
import moment from "moment";
import "moment-timezone";
moment.tz.setDefault("Asia/Seoul");
/**
 * @description 로그 관리 클래스
 */
class Log {
	public isConsoleOutput: boolean = true;
	/**
	 * @description 콘솔을 끕니다.
	 */
	public enableConsole(): void {
		this.isConsoleOutput = true;
	}
	/**
	 * @description 콘솔을 킵니다
	 */
	public disableConsole(): void {
		this.isConsoleOutput = false;
	}
	/**
	 * @description 현재 시간을 가져옵니다.
	 * @returns {string} 현재 시간을 문자열로 반환 ( YYYY-MM-DD HH:mm:ss )
	 */
	public getTime(): string {
		return moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
	}
	/**
	 * @description 콘솔 출력 기본값
	 * @returns {boolean} 성공 여부
	 */
	private _defaultLogFormat(str: string): boolean {
		if (this.isConsoleOutput) {
			console.log(chalk.grey(`[${this.getTime()}] `) + str);
			return true;
		} else return false;
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
