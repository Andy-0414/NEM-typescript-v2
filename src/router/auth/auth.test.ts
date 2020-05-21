import request from "supertest";
import app from "../../app";

describe("/auth/users", () => {
	let token: string = "";
	// 회원가입
	let userData: any = {};
	it("createUSer", (done) => {
		request(app)
			.post("/auth/users")
			.send({ email: "test", password: "test" })
			.expect("Content-Type", /json/)
			.expect(200)
			.end((err, res) => {
				let body: any = res.body;
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
			.send({ email: "test", password: "test" })
			.expect("Content-Type", /json/)
			.expect(200)
			.end((err, res) => {
				let body: any = res.body;
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
				userData = res.body.data;
				if (err) return done(err);
				else return done();
			});
	});
	// 계정 삭제
	it("DELETE /auth/users/{_id}", (done) => {
		request(app)
			.delete(`/auth/users/${userData._id}`)
			.set("Authorization", token)
			.expect(204)
			.end((err, res) => {
				if (err) return done(err);
				else return done();
			});
	});
});
