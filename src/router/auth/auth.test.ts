import request from "supertest";
import app from "../../app";
import { ResponseData } from "../controller";
import { IUserSchema } from "../../schema/User";
const TESTUSER_NAME = `${process.env.TESTUSER_NAME}_tmp` || "testuser_tmp";

describe("/auth/users", () => {
	let token: string = "";
	let userData: IUserSchema | null = null;
	// 회원가입
	it("POST /auth/users", (done) => {
		request(app)
			.post("/auth/users")
			.send({ email: TESTUSER_NAME, password: TESTUSER_NAME })
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
	it("POST /auth/users/login", (done) => {
		request(app)
			.post("/auth/users/login")
			.send({ email: TESTUSER_NAME, password: TESTUSER_NAME })
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
	it("POST /auth/users/my", (done) => {
		request(app)
			.post("/auth/users/my")
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
	it("DELETE /auth/users/{_id}", (done) => {
		if (!userData) {
			return done("NO ACCOUNT");
		} else {
			request(app)
				.delete(`/auth/users/${userData._id}`)
				.set("Authorization", token)
				.expect(204)
				.end((err, res) => {
					if (err) return done(err);
					else return done();
				});
		}
	});
});
