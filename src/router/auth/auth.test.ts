import request from "supertest";
import app from "../../app";
import { ResponseData } from "../controller";
import { IUserSchema } from "../../schema/User";
const TESTUSER_NAME = `${process.env.TESTUSER_NAME}_tmp` || "testuser_tmp";

describe("/auth/user", () => {
	let token: string = "";
	let userData: IUserSchema | null = null;
	// 회원가입
	it("POST /auth/user", (done) => {
		request(app)
			.post("/auth/user")
			.send({ userID: TESTUSER_NAME, password: TESTUSER_NAME })
			.expect("Content-Type", /json/)
			.expect(200)
			.end((err, res) => {
				let body: ResponseData = res.body;
				if (body.result) {
					token = body.data;
					done();
				} else {
					done(err);
				}
			});
	});
	// 로그인 (토큰 발급)
	it("POST /auth/user/login", (done) => {
		request(app)
			.post("/auth/user/login")
			.send({ userID: TESTUSER_NAME, password: TESTUSER_NAME })
			.expect("Content-Type", /json/)
			.expect(200)
			.end((err, res) => {
				let body: ResponseData = res.body;
				if (body.result) {
					token = body.data;
					done();
				} else {
					done(err);
				}
			});
	});
	// 내 정보 확인
	it("POST /auth/user/my", (done) => {
		request(app)
			.post("/auth/user/my")
			.set("Authorization", token)
			.expect(200)
			.end((err, res) => {
				let body: ResponseData = res.body;
				userData = body.data;
				if (err) return done(err);
				else return done();
			});
	});
	// 계정 삭제
	it("DELETE /auth/user/{_id}", (done) => {
		if (!userData) {
			return done("NO ACCOUNT");
		} else {
			request(app)
				.delete(`/auth/user/${userData._id}`)
				.set("Authorization", token)
				.expect(204)
				.end((err, res) => {
					if (err) return done(err);
					else return done();
				});
		}
	});
});
