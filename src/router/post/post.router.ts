import { Router } from "express";
import PassportManager from "../../modules/Passport-Manager";
import postController from "./post.controller";

const router = Router();

router.post("/", PassportManager.authenticate(), postController.createPost); // Ccreate

router.get("/", postController.readPosts); // Read
router.get("/:id", postController.readPost);
router.get("/:id/get-comments", postController.readPostComments);

router.put("/:id", PassportManager.authenticate(), postController.updatePost); // Update

router.delete("/:id", PassportManager.authenticate(), postController.deletePost); // Delete

export default router;
