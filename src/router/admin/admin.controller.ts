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
		if (user.isAdmin) {
			return super.response(res, HTTPRequestCode.OK, SchemaManager.getSchemaFrames(), "스키마 가져오기 성공");
		} else return next(new StatusError(HTTPRequestCode.FORBIDDEN, undefined, "권한 없음"));
	}
	/**
	 * @description 모델 데이터를 생성합니다.
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async createSchemaDataset(req: Request, res: Response, next: NextFunction) {
		let user = req.user as IUserSchema;
		let schemaName = req.body.schemaName;
		let data = req.body.data;
		if (user.isAdmin) super.response(res, HTTPRequestCode.OK, await SchemaManager.createSchemaDataset(schemaName, data), "데이터 생성 성공");
		else return next(new StatusError(HTTPRequestCode.FORBIDDEN, undefined, "권한 없음"));
	}
	/**
	 * @description 모델 데이터를 가져옵니다.
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async getSchemaDataset(req: Request, res: Response, next: NextFunction) {
		let user = req.user as IUserSchema;
		let schemaName = req.body.schemaName;
		if (user.isAdmin) super.response(res, HTTPRequestCode.OK, await SchemaManager.getSchemaDataset(schemaName), "스키마 가져오기 성공");
		else return next(new StatusError(HTTPRequestCode.FORBIDDEN, undefined, "권한 없음"));
	}
	/**
	 * @description 모델 데이터를 수정합니다.
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async updateSchemaDataset(req: Request, res: Response, next: NextFunction) {
		let user = req.user as IUserSchema;
		let schemaName = req.body.schemaName;
		let data = req.body.data;
		if (user.isAdmin) super.response(res, HTTPRequestCode.OK, await SchemaManager.updateSchemaDataset(schemaName, data), "데이터 생성 성공");
		else return next(new StatusError(HTTPRequestCode.FORBIDDEN, undefined, "권한 없음"));
	}
	/**
	 * @description 모델 데이터를 제거합니다.
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async deleteSchemaDataset(req: Request, res: Response, next: NextFunction) {
		let user = req.user as IUserSchema;
		let schemaName = req.body.schemaName;
		let _id = req.body.data._id;
		if (user.isAdmin) super.response(res, HTTPRequestCode.OK, await SchemaManager.deleteSchemaDataset(schemaName, _id), "데이터 생성 성공");
		else return next(new StatusError(HTTPRequestCode.FORBIDDEN, undefined, "권한 없음"));
	}
}

export default new AdminController();
