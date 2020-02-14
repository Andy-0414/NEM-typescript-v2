import { Router } from "express";
const router = Router();

// 여기에다 라우터 추가
import Auth from "./auth/auth.router";
import Post from "./post/post.router";
import Comment from "./comment/comment.router";

router.use("/auth", Auth);
router.use("/post", Post);
router.use("/comment", Comment);

export default router;
