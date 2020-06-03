import { Handler, Application } from "express";
import ExpressSession from "express-session";

import Passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github";
import { Strategy as NaverStrategy } from "passport-naver";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";

import RedisStore from "connect-redis";
import MongoStore from "connect-mongo";

import { StatusError, HTTPRequestCode } from "./Send-Rule";
import User, { IUserToken, IUserSchema } from "../schema/User";
import Log from "./Log";

import auth from "../../config/auth";
import MongoDBHelper from "./MongoDB-Helper";
import RedisHelper from "./Redis-Helper";
/**
 * @description 로그인 타입
 */
export enum LOGIN_TYPE {
	JWT = "jwt", // o
	LOCAL = "local", // o
	NAVER = "naver", // o
	GITHUB = "github", // o
	DISCORD = "discord",
	GOOGLE = "google", // o
	FACEBOOK = "facebook",
	TWITTER = "twitter",
	KAKAO = "kakao", // o
}
/**
 * @description 패스포트를 사용한 로그인 관리 클래스
 */
class PassportManager {
	public readonly SESSION: boolean = (process.env.SESSION || "FALSE") == "TRUE"; // 세션 사용 여부
	public readonly SESSION_REDIS: boolean = (process.env.SESSION_REDIS || "FALSE") == "TRUE"; // 세션 레디스DB 사용 여부
	public readonly SECRET_KEY: string = process.env.SECRET_KEY || "SECRET"; // 암호화 키
	public readonly SESSION_EXPIRATION: number = Number(process.env.SESSION_EXPIRATION) || 1000 * 60 * 60 * 4; // 세션 만료 시간
	public readonly LoginAbleOAuth: LOGIN_TYPE[] = []; // 로그인 가능한 로그인 타입 나열
	public readonly LoginRedirect = auth.loginRedirect; // 로그인 후 리다이렉트 시킬 경로 (/config/auth.ts에서 변경 가능)

	private readonly OAuthCertification = auth; // 각종 로그인 플랫폼에 대한 인증키 (/config/auth.ts에서 변경 가능)

	constructor() {
		// Github 로그인
		if (this.OAuthCertification.github.clientID) {
			this.LoginAbleOAuth.push(LOGIN_TYPE.GITHUB);
			Passport.use(
				LOGIN_TYPE.GITHUB,
				new GithubStrategy(
					{
						clientID: this.OAuthCertification.github.clientID,
						clientSecret: this.OAuthCertification.github.clientSecret,
						callbackURL: this.OAuthCertification.github.callbackURL,
					},
					async (accessToken, refreshToken, profile, done) => {
						try {
							let userID = this.createUserID(LOGIN_TYPE.GITHUB, profile.id);
							let user: IUserSchema = await User.findByUserID(userID);
							if (user) {
								user.imgPath = profile.photos[0].value;
								return done(null, await user.save());
							} else {
								user = await User.createUser({
									loginType: LOGIN_TYPE.GITHUB,
									imgPath: profile.photos[0].value,
									userID,
									password: "",
									username: profile.username,
								});
								return done(null, user);
							}
						} catch (err) {
							return done(err);
						}
					}
				)
			);
		}
		// Naver 로그인
		if (this.OAuthCertification.naver.clientID) {
			this.LoginAbleOAuth.push(LOGIN_TYPE.NAVER);
			Passport.use(
				LOGIN_TYPE.NAVER,
				new NaverStrategy(
					{
						clientID: this.OAuthCertification.naver.clientID,
						clientSecret: this.OAuthCertification.naver.clientSecret,
						callbackURL: this.OAuthCertification.naver.callbackURL,
					},
					async (accessToken, refreshToken, profile, done) => {
						try {
							let userID = this.createUserID(LOGIN_TYPE.NAVER, profile.id);
							let user: IUserSchema = await User.findByUserID(userID);
							if (user) {
								user.imgPath = profile._json.profile_image || "";
								return done(null, await user.save());
							} else {
								user = await User.createUser({
									loginType: LOGIN_TYPE.NAVER,
									imgPath: profile._json.profile_image || "",
									userID,
									password: "",
									username: profile.displayName,
									email: profile.emails[0].value || "",
								});
								return done(null, user);
							}
						} catch (err) {
							return done(err);
						}
					}
				)
			);
		}
		// Google 로그인
		if (this.OAuthCertification.google.clientID) {
			this.LoginAbleOAuth.push(LOGIN_TYPE.GOOGLE);
			Passport.use(
				LOGIN_TYPE.GOOGLE,
				new GoogleStrategy(
					{
						clientID: this.OAuthCertification.google.clientID,
						clientSecret: this.OAuthCertification.google.clientSecret,
						callbackURL: this.OAuthCertification.google.callbackURL,
						scope: ["profile"],
					},
					async (accessToken, refreshToken, profile, done) => {
						try {
							let userID = this.createUserID(LOGIN_TYPE.GOOGLE, profile.id);
							let user: IUserSchema = await User.findByUserID(userID);
							if (user) {
								user.imgPath = profile.photos[0].value || "";
								return done(null, await user.save());
							} else {
								user = await User.createUser({
									loginType: LOGIN_TYPE.GOOGLE,
									imgPath: profile.photos[0].value || "",
									userID,
									password: "",
									username: profile.displayName,
								});
								return done(null, user);
							}
						} catch (err) {
							return done(err);
						}
					}
				)
			);
		}
		// Kakao 로그인
		if (this.OAuthCertification.kakao.clientID) {
			this.LoginAbleOAuth.push(LOGIN_TYPE.KAKAO);
			Passport.use(
				LOGIN_TYPE.KAKAO,
				new KakaoStrategy(
					{
						clientID: this.OAuthCertification.kakao.clientID,
						clientSecret: this.OAuthCertification.kakao.clientSecret,
						callbackURL: this.OAuthCertification.kakao.callbackURL,
					},
					async (accessToken, refreshToken, profile, done) => {
						try {
							let userID = this.createUserID(LOGIN_TYPE.KAKAO, profile.id);
							let user: IUserSchema = await User.findByUserID(userID);
							if (user) {
								user.imgPath = profile._json.properties.profile_image || "";
								return done(null, await user.save());
							} else {
								user = await User.createUser({
									loginType: LOGIN_TYPE.KAKAO,
									imgPath: profile._json.properties.profile_image || "",
									userID,
									email: profile._json.kakao_account ? profile._json.kakao_account.email : "",
									password: "",
									username: profile.displayName,
								});
								return done(null, user);
							}
						} catch (err) {
							return done(err);
						}
					}
				)
			);
		}

		// 세션 사용 설정 시
		if (this.SESSION) {
			// Local 로그인
			this.LoginAbleOAuth.push(LOGIN_TYPE.LOCAL);
			Passport.use(
				LOGIN_TYPE.LOCAL,
				new LocalStrategy({ usernameField: "userID", passwordField: "password", session: true, passReqToCallback: true }, async (req, userID: string, password: string, done) => {
					try {
						let user = await User.loginAuthentication({ userID, password });
						if (user) return done(null, user);
						else new StatusError(HTTPRequestCode.UNAUTHORIZED, "인증 실패");
					} catch (err) {
						return done(err);
					}
				})
			);
			// 최초 로그인 성공 시 세션을 저장하는 곳
			Passport.serializeUser((user: IUserSchema, done) => {
				done(null, user);
			});
			// 이후 로그인 성공 시도 시 세션을 갱신하는 곳
			Passport.deserializeUser(async (user: IUserSchema, done) => {
				try {
					let nUser = await User.loginAuthentication(user, true, true);
					if (nUser) done(null, nUser);
					else new StatusError(HTTPRequestCode.UNAUTHORIZED, "인증 실패");
				} catch (err) {
					done(err);
				}
			});
		} else {
			// JWT 토큰 로그인
			this.LoginAbleOAuth.push(LOGIN_TYPE.JWT);
			Passport.use(
				LOGIN_TYPE.JWT,
				new JWTStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: this.SECRET_KEY }, async (data: IUserToken, done) => {
					try {
						let user = await User.loginAuthentication(data, true);
						if (user) return done(null, user);
						else new StatusError(HTTPRequestCode.UNAUTHORIZED, "인증 실패");
					} catch (err) {
						return done(err);
					}
				})
			);
		}
	}

	/**
	 * @description 외부 계정의 아이디를 생성합니다.
	 * @returns {Handler} id
	 */
	public createUserID(type: LOGIN_TYPE, id: string): string {
		return `${type}-${id}`;
	}

	/**
	 * @description passport 사용을 위한 기본 세팅 미들웨어를 제공합니다.
	 * @returns {Handler} passport 기본 세팅 미들웨어
	 */
	public setApplication(app: Application): void {
		let store;
		// Redis 사용
		if (this.SESSION) {
			store = null;
			// Redis 사용 설정을 했을 시
			if (this.SESSION_REDIS) {
				store = new (RedisStore(ExpressSession))({ client: RedisHelper.getDB() });
				Log.c("Reids Session connected");
			} else {
				// Redis 사용 안할 시 MongoDB 사용
				store = new (MongoStore(ExpressSession))({ mongooseConnection: MongoDBHelper.getDB() });
				Log.c("Mongo Session connected");
			}
			// express-session 사용
			app.use(
				ExpressSession({
					secret: this.SECRET_KEY,
					store,
					cookie: {
						maxAge: this.SESSION_EXPIRATION, // 4 시간
					},
					saveUninitialized: true,
					resave: true,
				})
			);
			// passport 세팅
			app.use(Passport.initialize());
			// passport 세션 사용
			app.use(Passport.session());
		} else {
			// passport 세팅
			app.use(Passport.initialize());
		}
		// 로그인 가능한 OAuth 출력
		Log.i(this.SESSION ? "[SESSION MODE]" : "[TOKEN MODE]");
		this.LoginAbleOAuth.forEach((loginType) => {
			Log.c(`- ${loginType.toUpperCase()} Auth is ready`);
		});
	}
	/**
	 * @description Authorization 헤더 안의 Bearer 토큰를 이용하여(기본값) 로그인 후 계정에 대한 정보를 req.user 에 저장합니다.
	 * @description 세션 사용 시 로그인 체크 미들웨어를 반환합니다.
	 * @param {String}type 로그인 방식
	 * @returns {Handler} 미들웨어
	 */
	public authenticate(type?: LOGIN_TYPE): Handler {
		// 특정 타입을 입력받았을 시 해당 타입에 대한 로그인 미들웨어 반환
		if (type) return Passport.authenticate(type, { session: this.SESSION });
		// 세션 사용 시 로그인 여부를 체크하는 미들웨어 반환 (세션을 통한 자동 로그인)
		else if (this.SESSION)
			return (req, res, next) => {
				if (req.isAuthenticated()) next();
				else next(new StatusError(HTTPRequestCode.UNAUTHORIZED, "인증 실패"));
			};
		// 세션을 사용하지 않을 시 토큰을 사용하여 로그인하는 미들웨어 반환
		else
			return Passport.authenticate("jwt", {
				failWithError: true,
				session: false,
			});
	}
	/**
	 * @description 세션 로그인 시 토큰 로그인 대신 세션을 사용하는 Local 형식으로 변경합니다.
	 * @description 세션 사용 시 로그인 미들웨어를 반환합니다.
	 * @returns {Handler} 미들웨어
	 */
	public getLoginMiddleware(): Handler {
		// 세션 사용 시 로그인 후 세션에 저장하는 미들웨어를 반환
		if (this.SESSION) return Passport.authenticate("local");
		// 세션을 사용하지 않을 시 미들웨어를 반환하지 않고 token을 가져오도록 유도함
		else return (req, res, next) => next();
	}
	/**
	 * @description 로그인 시도 후 리다이렉션 되는 링크를 반환함.
	 * @returns {String} 리다이렉션 링크
	 */
	public getCallbackURLByLoginType(type: LOGIN_TYPE): string {
		let url: string = this.OAuthCertification[type].callbackURL;
		return url.replace("/auth", "");
	}
}

export default new PassportManager();
