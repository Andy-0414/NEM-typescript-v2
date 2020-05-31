import { Router } from "express";
import PassportManager from "../../modules/Passport-Manager";
import commentController from "./comment.controller";

const router = Router();

router.post("/", PassportManager.authenticate(), commentController.createComment); // Create

router.get("/:id", commentController.readComment); // Read

router.put("/:id", PassportManager.authenticate(), commentController.updateComment); // Update

router.delete("/:id", PassportManager.authenticate(), commentController.deleteComment); // Delete

export default router;
