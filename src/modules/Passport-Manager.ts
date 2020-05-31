import { Handler, Application } from "express";
import ExpressSession from "express-session";

import Passport from "passport";
import PassportJWT from "passport-jwt";
import PassportLocal from "passport-local";
import PassportGithub from "passport-github";

import RedisStore from "connect-redis";
import Redis from "redis";

import { StatusError, HTTPRequestCode } from "./Send-Rule";
import User, { IUserToken, IUserSchema } from "../schema/User";
import Log from "./Log";

import auth from "../../auth";

/**
 * @description 패스포트를 사용한 로그인 관리 클래스
 */
class PassportManager {
	public readonly SESSION: boolean = (process.env.SESSION || "FALSE") == "TRUE";
	public readonly SESSION_REDIS: boolean = (process.env.SESSION_REDIS || "FALSE") == "TRUE";
	public readonly SECRET_KEY: string = process.env.SECRET_KEY || "SECRET";
	public readonly SESSION_EXPIRATION: number = Number(process.env.SESSION_EXPIRATION) || 1000 * 60 * 60 * 4;

	private readonly jwtOption: PassportJWT.StrategyOptions = {
		jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: this.SECRET_KEY,
	};

	constructor() {
		// JWT 토큰 로그인
		Passport.use(
			new PassportJWT.Strategy(this.jwtOption, async (data: IUserToken, done) => {
				try {
					let user = await User.loginAuthentication(data, true);
					if (user) return done(null, user);
					else new StatusError(HTTPRequestCode.UNAUTHORIZED, "인증 실패");
				} catch (err) {
					return done(err);
				}
			})
		);
		// Local 로그인
		Passport.use(
			"local",
			new PassportLocal.Strategy({ usernameField: "userID", passwordField: "password", session: true, passReqToCallback: true }, async (req, userID: string, password: string, done) => {
				try {
					let user = await User.loginAuthentication({ userID, password });
					if (user) return done(null, user);
					else new StatusError(HTTPRequestCode.UNAUTHORIZED, "인증 실패");
				} catch (err) {
					return done(err);
				}
			})
		);
		// Github Auth가 있을 시
		if (auth.github.clientID)
			Passport.use(
				"github",
				new PassportGithub.Strategy(
					{
						clientID: auth.github.clientID,
						clientSecret: auth.github.clientSecret,
						callbackURL: auth.github.callbackURL,
					},
					async (accessToken, refreshToken, profile, done) => {
						try {
							let userID = this.createUserID("github", profile.id);
							let user: IUserSchema = await User.findByUserID(userID);
							if (user) {
								user.imgPath = profile.photos[0].value;
								return done(null, await user.save());
							} else {
								user = await User.createUser({ loginType: "github", imgPath: profile.photos[0].value, userID, password: "", username: profile.username });
								return done(null, user);
							}
						} catch (err) {
							return done(err);
						}
					}
				)
			);

		// 세션 사용 설정 시
		if (this.SESSION) {
			Passport.serializeUser((user: IUserSchema, done) => {
				done(null, user);
			});
			Passport.deserializeUser(async (user: IUserSchema, done) => {
				try {
					let nUser = await User.loginAuthentication(user, true, true);
					if (nUser) done(null, nUser);
					else new StatusError(HTTPRequestCode.UNAUTHORIZED, "인증 실패");
				} catch (err) {
					done(err);
				}
			});
		}
	}

	/**
	 * @description 외부 계정의 아이디를 생성합니다.
	 * @returns {Handler} id
	 */
	public createUserID(type: string, id: string): string {
		return `${type}-${id}`;
	}

	/**
	 * @description passport 사용을 위한 기본 세팅 미들웨어를 제공합니다.
	 * @returns {Handler} passport 기본 세팅 미들웨어
	 */
	public setApplication(app: Application): void {
		if (this.SESSION) {
			// app.use(Passport.authenticate("local", { failWithError: true }));
			// Redis 사용
			let store = null;
			// Redis 사용 설정을 했을 시
			if (this.SESSION_REDIS) {
				let client = Redis.createClient();
				store = new (RedisStore(ExpressSession))({ client: client });
				// Redis 성공 여부 반환
				client.on("error", (err) => {
					// Redis 연결 실패 시 서버 종료
					client.quit();
					Log.e("Redis connected fail");
					Log.e("Server stop");
					process.exit();
				});
				client.on("ready", () => {
					// Redis 연결 성공 시
					Log.c("Redis connected");
				});
			} else {
				// Redis 사용 안할 시
				Log.c("Local Session connected");
			}

			app.use(
				ExpressSession({
					secret: this.SECRET_KEY,
					store,
					cookie: {
						maxAge: this.SESSION_EXPIRATION, // 4 시간
					},
					saveUninitialized: true,
				})
			);
			// passport 세션 사용
			app.use(Passport.initialize());
			app.use(Passport.session());
		} else {
			app.use(Passport.initialize());
		}
	}
	/**
	 * @description Authorization 헤더 안의 Bearer 토큰를 이용하여(기본값) 로그인 후 계정에 대한 정보를 req.user 에 저장합니다.
	 * @description 세션 사용 시 로그인 체크 미들웨어를 반환합니다.
	 * @param {String}type 로그인 방식
	 * @returns {Handler} 미들웨어
	 */
	public authenticate(type?: string): Handler {
		if (type) return Passport.authenticate(type, { session: this.SESSION });
		else if (this.SESSION)
			return (req, res, next) => {
				if (req.isAuthenticated()) next();
				else next(new StatusError(HTTPRequestCode.UNAUTHORIZED, "인증 실패"));
			};
		else
			return Passport.authenticate("jwt", {
				failWithError: true,
				session: false,
			});
	}
	public getLoginMiddleware(): Handler {
		if (this.SESSION) return Passport.authenticate("local");
		else return (req, res, next) => next();
	}
}

export default new PassportManager();
