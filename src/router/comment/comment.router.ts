import { Router } from "express";
import PassportJWTManager from "../../modules/Passport-JWT-Auth";

const router = Router();

// Routers

router.post("/", PassportJWTManager.authenticate(), CreateComment);

router.get("/:id", ReadComment);

router.put("/:id", PassportJWTManager.authenticate(), UpdateComment);

router.delete("/:id", PassportJWTManager.authenticate(), DeleteComment);

export default router;
