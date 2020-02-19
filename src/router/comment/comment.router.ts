import { Router } from "express";
import PassportJWTManager from "../../modules/Passport-JWT-Auth";
import commentController from "./comment.controller";

const router = Router();

router.post("/", PassportJWTManager.authenticate(), commentController.createComment);

router.get("/:id", commentController.readComment);

router.put("/:id", PassportJWTManager.authenticate(), commentController.updateComment);

router.delete("/:id", PassportJWTManager.authenticate(), commentController.deleteComment);

export default router;
