import request from "supertest";
import app from "./app";

// describe("POST /auth/users", () => {
// 	it("return login", (done) => {
// 		request(app)
// 			.post("/auth/users/login")
// 			.send({ email: "test", password: "test" })
// 			.expect("Content-Type", /json/)
// 			.expect(200)
// 			.end((err, res) => {
// 				if (err) done(err);
// 				else done();
// 			});
// 	});
// });
