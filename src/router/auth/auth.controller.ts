import { Request, Response, NextFunction } from "express";
import User, { IUser, IUserSchema } from "../../schema/User";
import { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import Controller from "../controller";
import ResourceManager from "../../modules/Resource-Manager";
import Base64ToImage from "../../modules/Base64-To-Image";
import PassportManager from "../../modules/Passport-Manager";

class AuthController extends Controller {
	/**
	 * @description 로그인
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async login(req: Request, res: Response, next: NextFunction) {
		try {
			if (PassportManager.SESSION) {
				let user = await User.findByUserID((req.user as IUserSchema).userID);
				return super.response(res, HTTPRequestCode.OK, user.toJSON(), "계정 로그인 성공");
			} else {
				let loginData = req.body;
				let user = await User.loginAuthentication(loginData);
				if ((user.loginType = "local")) return super.response(res, HTTPRequestCode.OK, user.getUserToken(), "계정 로그인 성공");
				else return next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
			}
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 로그아웃
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async logout(req: Request, res: Response, next: NextFunction) {
		try {
			req.logout();
			return super.response(res, HTTPRequestCode.OK, null, "계정 로그아웃 성공");
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 토큰 재발급, 세션 사용중일 시 메인 페이지로 리다이렉트
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async getTokenOrRedirect(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			// 로그인 성공 리다이렉션을 막을 지 여부 (토큰 로그인 사용 시)
			let isRedirect: boolean = req.body.isRedirect || true;
			if (PassportManager.SESSION || isRedirect) return res.redirect(PassportManager.LoginRedirect);
			else return super.response(res, HTTPRequestCode.OK, user.getUserToken(), "토큰 갱신 성공");
		} catch (err) {
			return next(err);
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

		return super.response(res, HTTPRequestCode.OK, user.toJSON(), "계정 정보 가져오기 성공");
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

			return super.response(res, HTTPRequestCode.CREATE, user, "계정 생성 성공");
		} catch (err) {
			return next(err);
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

			return super.response(res, HTTPRequestCode.OK, users, "계정 목록 가져오기 성공");
		} catch (err) {
			return next(err);
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
			return super.response(res, HTTPRequestCode.OK, users, "계정 가져오기 성공");
		} catch (err) {
			return next(err);
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
				return super.response(res, HTTPRequestCode.OK, await user.resetPassword(password), "계정 비밀번호 변경 성공");
			} else {
				return next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
			}
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 계정 프로필 이미지를 변경함
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async changeProfileImage(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			let id = req.params.id;
			if (!req.body.img) return next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
			let imageData = Base64ToImage.getImageData(req.body.img);

			if (user._id == id) {
				user.imgPath = await ResourceManager.save("user", `${id}.${imageData.imgType}`, imageData.imgFile);
				return super.response(res, HTTPRequestCode.OK, await user.save(), "계정 비밀번호 변경 성공");
			} else {
				return next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
			}
		} catch (err) {
			return next(err);
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
				return super.response(res, HTTPRequestCode.OK, await user.changeInfo(userInfo), "계정 정보 변경 성공");
			} else {
				return next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
			}
		} catch (err) {
			return next(err);
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
				return super.response(res, HTTPRequestCode.NO_CONTENT, await User.deleteOne(user), "계정 삭제 성공");
			} else {
				return next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
			}
		} catch (err) {
			return next(err);
		}
	}
}

export default new AuthController();
