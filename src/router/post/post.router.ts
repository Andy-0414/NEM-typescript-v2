import { Router } from "express";
import PassportJWTManager from "../../modules/Passport-JWT-Auth";
import { CreatePost, ReadPosts, ReadPost, UpdatePost, DeletePost } from "./post.controller";

const router = Router();

router.post("/", PassportJWTManager.authenticate(), CreatePost);

router.get("/", ReadPosts);
router.get("/:id", ReadPost);

router.put("/:id", PassportJWTManager.authenticate(), UpdatePost);

router.delete("/:id", PassportJWTManager.authenticate(), DeletePost);

export default router;
