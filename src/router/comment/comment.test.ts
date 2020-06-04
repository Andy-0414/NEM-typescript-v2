import request from "supertest";
import app from "../../app";
import { ResponseData } from "../controller";
import { IPostSchema } from "../../schema/Post";
import { IComment, ICommentSchema } from "../../schema/Comment";
const TESTUSER_NAME = process.env.TESTUSER_NAME || "testuser";

describe("/post", () => {
	let token: string = "";
	let postData: IPostSchema | null = null;
	let commentData: ICommentSchema | null = null;

	// 로그인 & 글 쓰기
	request(app)
		.post("/auth/user/login")
		.send({ userID: TESTUSER_NAME, password: TESTUSER_NAME })
		.expect("Content-Type", /json/)
		.expect(200)
		.end((err, res) => {
			let body: ResponseData = res.body;
			token = body.data;
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
					}
				});
		});

	// 댓글 생성
	it("POST /comment", (done) => {
		request(app)
			.post("/comment")
			.send({ content: "Test", post: postData._id } as IComment)
			.expect("Content-Type", /json/)
			.set("Authorization", token)
			.expect(201)
			.end((err, res) => {
				let body: ResponseData = res.body;
				if (body.result) {
					commentData = body.data;
					done();
				} else {
					done(err);
				}
			});
	});
	// 댓글 수정
	it("PUT /comment/{_id}", (done) => {
		request(app)
			.put(`/comment/${commentData._id}`)
			.send({ title: "Test_Fix", content: "Test_Fix" })
			.set("Authorization", token)
			.expect(200)
			.end((err, res) => {
				let body: ResponseData = res.body;
				if (body.result) {
					done();
				} else {
					done(err);
				}
			});
	});
	// 댓글 삭제
	it("DELETE /comment/{_id}", (done) => {
		request(app)
			.delete(`/comment/${commentData._id}`)
			.set("Authorization", token)
			.expect(204)
			.end((err, res) => {
				let body: ResponseData = res.body;
				if (body.result) {
					request(app)
						.delete(`/post/${postData._id}`)
						.expect("Content-Type", /json/)
						.set("Authorization", token)
						.expect(204)
						.end((err, res) => {
							done();
						});
				} else {
					done(err);
				}
			});
	});
});
