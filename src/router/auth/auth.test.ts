import request from "supertest";
import app from "../../app";

describe("ROUTER /auth/users", () => {
	let token: string = "";
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
	it("login", (done) => {
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
	it("getUserData", (done) => {
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
	it("deleteUser", (done) => {
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
