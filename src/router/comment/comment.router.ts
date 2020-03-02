import { Router } from "express";
import PassportJWTManager from "../../modules/Passport-JWT-Auth";
import commentController from "./comment.controller";

const router = Router();

router.post("/", PassportJWTManager.authenticate(), commentController.createComment); // Create

router.get("/:id", commentController.readComment); // Read

router.put("/:id", PassportJWTManager.authenticate(), commentController.updateComment); // Update

router.delete("/:id", PassportJWTManager.authenticate(), commentController.deleteComment); // Delete

export default router;
