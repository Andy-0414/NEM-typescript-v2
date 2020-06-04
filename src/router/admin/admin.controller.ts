import Controller from "../controller";
import { NextFunction, Response, Request } from "express";
import SchemaManager from "../../modules/Schema-Manager";
import { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import PassportManager from "../../modules/Passport-Manager";
import { IUserSchema } from "../../schema/User";
SchemaManager;
class AdminController extends Controller {
	/**
	 * @description 로그인 타입을 가져옵니다. (SESSION|TOKEN)
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public getLoginType(req: Request, res: Response, next: NextFunction) {
		super.response(res, HTTPRequestCode.OK, PassportManager.SESSION ? "SESSION" : "TOKEN", "로그인 타입 가져오기 성공");
	}
	/**
	 * @description 모델 정보를 가져옵니다.
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public getSchemaShape(req: Request, res: Response, next: NextFunction) {
		let user = req.user as IUserSchema;
		if (user.isAdmin) super.response(res, HTTPRequestCode.OK, SchemaManager.getSchemaFrames(), "스키마 가져오기 성공");
		else return next(new StatusError(HTTPRequestCode.FORBIDDEN, undefined, "권한 없음"));
	}
}

export default new AdminController();
