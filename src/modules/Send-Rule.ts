import { Response, Request, NextFunction } from "express";
import Log from "./Log";
import { ErrorHandleFunction } from "connect";
/**
 * @description 상태코드
 */
export enum HTTPRequestCode {
	OK = 200,
	CREATE = 201,
	ACCEPTED = 202,
	NO_CONTENT = 204,

	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,

	INTERNAL_SERVER_ERROR = 500,
}
/**
 * @description 상태코드를 포함한 에러
 */
export class StatusError extends Error {
	status: HTTPRequestCode;
	constructor(status: HTTPRequestCode, message?: string, name?: string) {
		super(message);
		this.name = name;
		this.status = status;
	}
}
class SendRule {
	/**
	 * @description 에러 코드를 문자열로 바꾸어 반환합니다.
	 * @param {HTTPRequestCode} status 에러 코드
	 * @returns {string} 에러 문자
	 */
	public HTTPRequestCodeToMessage(status: HTTPRequestCode): string {
		switch (status) {
			case HTTPRequestCode.OK:
				return "200 OK";
			case HTTPRequestCode.CREATE:
				return "201 CREATE";
			case HTTPRequestCode.ACCEPTED:
				return "202 ACCEPTED";
			case HTTPRequestCode.NO_CONTENT:
				return "204 NO_CONTENT";
			case HTTPRequestCode.BAD_REQUEST:
				return "400 BAD_REQUEST";
			case HTTPRequestCode.UNAUTHORIZED:
				return "401 UNAUTHORIZED";
			case HTTPRequestCode.FORBIDDEN:
				return "403 FORBIDDEN";
			case HTTPRequestCode.NOT_FOUND:
				return "404 NOT_FOUND";
			case HTTPRequestCode.INTERNAL_SERVER_ERROR:
				return "500 INTERNAL_SERVER_ERROR";
			default:
				return null;
		}
	}
	/**
	 * @description 자동으로 에러를 핸들링 해 주는 미들웨어를 반환합니다.
	 * @returns {ErrorHandleFunction} 에러 핸들러
	 */
	public autoErrorHandler(): ErrorHandleFunction {
		return (err: StatusError, req: Request, res: Response, next: NextFunction) => {
			err.status = err.status || 500;
			err.message = err.message || this.HTTPRequestCodeToMessage(err.status);
			Log.e(err.message);
			res.status(err.status).send({ result: false, message: err.message });
		};
	}
}
export default new SendRule();
