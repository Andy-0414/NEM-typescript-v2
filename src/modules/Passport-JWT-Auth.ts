import * as passport from "passport";
import { Handler } from "express";
import { StrategyOptions, Strategy, ExtractJwt } from "passport-jwt";
import User, { IUser, IUserDefaultLogin } from "../schema/User";

class PassportJWTManager {
	private option: StrategyOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.SECRET_KEY || "SECRET"
	};
	private initialize: Handler;

	constructor() {
		passport.use(
			new Strategy(this.option, (data: IUserDefaultLogin, done) => {
				// User.loginValidation(data)
				// 	.then(user => {
				// 		done(null, user);
				// 	})
				// 	.catch(err => {
				// 		done(err);
				// 	});
			})
		);
		this.initialize = passport.initialize();
	}
	/**
	 * @description passport 사용을 위한 기본 세팅 미들웨어를 제공합니다.
	 * @returns {Handler} passport 기본 세팅 미들웨어
	 */
	public getInitialize(): Handler {
		return this.initialize;
	}
	/**
	 * @description Authorization 헤더 안의 Bearer 토큰를 이용하여(기본값) 로그인 후 유저에 대한 정보를 req.user 에 저장합니다. 로그인 실패 시 401을 반환합니다.
	 * @returns {Handler}
	 */
	public authenticate(session: boolean = false): Handler {
		return passport.authenticate("jwt", {
			failWithError: true,
			session: session
		});
	}
	/**
	 * @description passport 세팅을 설정합니다.
	 * @param {StrategyOptions}option
	 */
	public setOption(option: StrategyOptions): void {
		this.option = option;
	}
}

export default new PassportJWTManager();
