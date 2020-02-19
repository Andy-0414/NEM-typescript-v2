import { Router } from "express";
import PassportJWTManager from "../../modules/Passport-JWT-Auth";
import postController from "./post.controller";

const router = Router();

router.post("/", PassportJWTManager.authenticate(), postController.createPost);

router.get("/", postController.readPosts);
router.get("/:id", postController.readPost);

router.put("/:id", PassportJWTManager.authenticate(), postController.updatePost);

router.delete("/:id", PassportJWTManager.authenticate(), postController.deletePost);

export default router;
