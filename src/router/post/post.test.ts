import request from "supertest";
import app from "../../app";
import { ResponseData } from "../controller";
import { IPost, IPostSchema } from "../../schema/Post";
const TESTUSER_NAME = process.env.TESTUSER_NAME || "testuser";

describe("/post", () => {
	let token: string = "";
	let postData: IPostSchema | null = null;
	request(app)
		.post("/auth/users/login")
		.send({ email: TESTUSER_NAME, password: TESTUSER_NAME })
		.expect("Content-Type", /json/)
		.expect(200)
		.end((err, res) => {
			let body: ResponseData = res.body;
			token = body.data;
		});
	it("POST /post", (done) => {
		if (token)
			request(app)
				.post("/post")
				.send({ title: "Test", content: "Test" })
				.expect("Content-Type", /json/)
				.set("Authorization", token)
				.expect(200)
				.end((err, res) => {
					let body: ResponseData = res.body;
					if (body.result) {
						postData = body.data;
						done();
					} else {
						done(err);
					}
				});
		else done("NO LOGIN");
	});
	it("PUT /post/{_id}", (done) => {
		if (postData && token)
			request(app)
				.put(`/post/${postData._id}`)
				.send({ title: "Test_Fix", content: "Test_Fix" })
				.set("Authorization", token)
				.expect(204)
				.end((err, res) => {
					let body: ResponseData = res.body;
					if (body.result) {
						done();
					} else {
						done(err);
					}
				});
		else done("NO LOGIN");
	});
	it("DELETE /post/{_id}", (done) => {
		if (postData && token)
			request(app)
				.delete(`/post/${postData._id}`)
				.set("Authorization", token)
				.expect(204)
				.end((err, res) => {
					let body: ResponseData = res.body;
					if (body.result) {
						postData = body.data;
						done();
					} else {
						done(err);
					}
				});
		else done("NO LOGIN");
	});
});
