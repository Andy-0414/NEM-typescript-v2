import { Request, Response, NextFunction } from "express";
import User, { IUser, IUserSchema } from "../../schema/User";
import { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import Controller from "../controller";

class AuthController extends Controller {
	/**
	 * @description 로그인
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async login(req: Request, res: Response, next: NextFunction) {
		try {
			let loginData = req.body;
			let user = await User.loginAuthentication(loginData);

			super.response(res, HTTPRequestCode.OK, user.getUserToken(), "계정 로그인 성공");
		} catch (err) {
			next(err);
		}
	}
	/**
	 * @description 토큰 재발급
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async getToken(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;

			super.response(res, HTTPRequestCode.OK, user.getUserToken(), "토큰 갱신 성공");
		} catch (err) {
			next(err);
		}
	}
	/**
	 * @description 토큰으로 계정에 대한 정보 가져오기
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async my(req: Request, res: Response, next: NextFunction) {
		let user = req.user as IUserSchema;

		super.response(res, HTTPRequestCode.OK, user, "계정 정보 가져오기 성공");
	}

	/**
	 * @description 회원가입
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			let userData: IUser = req.body;
			let user = await User.createUser(userData);

			super.response(res, HTTPRequestCode.CREATE, user, "계정 생성 성공");
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @description 모든 계정를 가져옴
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async getAllUsers(req: Request, res: Response, next: NextFunction) {
		try {
			let users = await User.find();

			super.response(res, HTTPRequestCode.OK, users, "계정 목록 가져오기 성공");
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @description 계정를 가져옴
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async getUser(req: Request, res: Response, next: NextFunction) {
		try {
			let id = req.params.id;

			let users = await User.find({ _id: id }, { password: 0, salt: 0 });
			super.response(res, HTTPRequestCode.OK, users, "계정 가져오기 성공");
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @description 계정 비민번호를 변경함
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async resetPassword(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			let id = req.params.id;

			if (user._id == id) {
				let password = req.body.password;
				super.response(res, HTTPRequestCode.OK, await user.resetPassword(password), "계정 비밀번호 변경 성공");
			} else {
				next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
			}
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @description 계정 정보를 변경함
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async changeInfo(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			let id = req.params.id;

			if (user._id == id) {
				let userInfo = req.body as IUser;
				super.response(res, HTTPRequestCode.OK, await user.changeInfo(userInfo), "계정 정보 변경 성공");
			} else {
				next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
			}
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @description 게정을 삭제함
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async deleteUser(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			let id = req.params.id;

			if (user._id == id) {
				super.response(res, HTTPRequestCode.NO_CONTENT, await user.remove(), "계정 삭제 성공");
			} else {
				next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
			}
		} catch (err) {
			next(err);
		}
	}
}

export default new AuthController();
