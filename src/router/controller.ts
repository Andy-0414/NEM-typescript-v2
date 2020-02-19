import SendRule, { HTTPRequestCode } from "../modules/Send-Rule";
import { Response } from "express";

export default class Controller {
	/**
	 * @description 데이터 리스폰스 규격
	 * @param {Response} res Express Response
	 * @param {number} status 상태 코드
	 * @param {any} data 전송할 데이터
	 * @param {string} message 메세지
	 * @param {boolean} result 성공 여부
	 */
	public response(res: Response, status: HTTPRequestCode, data?: any, message?: string, result: boolean = true) {
		res.status(status)
			.send({
				result,
				data,
				message: message || SendRule.HTTPRequestCodeToMessage(status)
			})
			.end();
	}
}
