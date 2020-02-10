import { Request, Response, NextFunction } from "express";
import User, { IUser, IUserSchema } from "../../schema/User";
import SendRule, { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";

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
 * @description 토큰으로 계정에 대한 정보 가져오기
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const My = (req: Request, res: Response, next: NextFunction) => {
	let user = req.user as IUserSchema;
	SendRule.response(res, HTTPRequestCode.OK, user, "계정 정보 가져오기 성공");
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
		let users = await User.find();
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

/**
 * @description 계정 비민번호를 변경함
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const ResetPassword = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = req.user as IUserSchema;
		let id = req.params.id;
		if (user._id == id) {
			let password = req.body.password;
			SendRule.response(res, HTTPRequestCode.OK, await user.resetPassword(password), "계정 비밀번호 변경 성공");
		} else {
			next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
		}
	} catch (err) {
		next(err);
	}
};

/**
 * @description 계정 정보를 변경함
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const ChangeInfo = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = req.user as IUserSchema;
		let id = req.params.id;
		if (user._id == id) {
			let userInfo = req.body as IUser;
			SendRule.response(res, HTTPRequestCode.OK, await user.changeInfo(userInfo), "계정 정보 변경 성공");
		} else {
			next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
		}
	} catch (err) {
		next(err);
	}
};

/**
 * @description 게정을 삭제함
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const DeleteUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = req.user as IUserSchema;
		let id = req.params.id;
		if (user._id == id) {
			SendRule.response(res, HTTPRequestCode.OK, await user.remove(), "계정 삭제 성공");
		} else {
			next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
		}
	} catch (err) {
		next(err);
	}
};
