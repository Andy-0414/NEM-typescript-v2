import { Router } from "express";
import PassportJWTManager from "../../modules/Passport-JWT-Auth";
import postController from "./post.controller";

const router = Router();

router.post("/", PassportJWTManager.authenticate(), postController.createPost); // Ccreate

router.get("/", postController.readPosts); // Read
router.get("/:id", postController.readPost);

router.put("/:id", PassportJWTManager.authenticate(), postController.updatePost); // Update

router.delete("/:id", PassportJWTManager.authenticate(), postController.deletePost); // Delete

export default router;
