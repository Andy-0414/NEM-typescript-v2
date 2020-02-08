import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../../schema/User";
import SendRule, { HTTPRequestCode } from "../../modules/Send-Rule";

/**
 * @description 로그인
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const Login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let loginData = req.body;
		let user = await User.loginAuthentication(loginData);
		SendRule.response(res, HTTPRequestCode.OK, user.getUserToken(), "계정 로그인 성공");
	} catch (err) {
		next(err);
	}
};

/**
 * @description 회원가입
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let userData: IUser = req.body;
		let user = await User.createUser(userData);
		SendRule.response(res, HTTPRequestCode.CREATE, user, "계정 생성 성공");
	} catch (err) {
		next(err);
	}
};

/**
 * @description 모든 계정를 가져옴
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const GetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let users = await User.find({}, { password: 0, salt: 0 });
		SendRule.response(res, HTTPRequestCode.OK, users, "계정 목록 가져오기 성공");
	} catch (err) {
		next(err);
	}
};

/**
 * @description 계정를 가져옴
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const GetUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let id = req.params.id;
		let users = await User.find({ _id: id }, { password: 0, salt: 0 });
		SendRule.response(res, HTTPRequestCode.OK, users, "계정 가져오기 성공");
	} catch (err) {
		next(err);
	}
};
