import { Router } from "express";
import PassportManager from "../../modules/Passport-Manager";
import authController from "./auth.controller";

const router = Router();

router.post("/users/login", PassportManager.getLoginMiddleware(), authController.login);

router.get("/users/login/github", PassportManager.authenticate("github"));
router.get("/users/login/github/callback", PassportManager.authenticate("github"), authController.getToken);

router.post("/users/token", PassportManager.authenticate(), authController.getToken);
router.post("/users/my", PassportManager.authenticate(), authController.my);
router.get("/users/my", PassportManager.authenticate(), authController.my);

router.post("/users", authController.createUser);

router.get("/users", authController.getAllUsers);
router.get("/users/:id", authController.getUser);

router.post("/users/:id/reset-password", PassportManager.authenticate(), authController.resetPassword);
router.post("/users/:id/change-profile-image", PassportManager.authenticate(), authController.changeProfileImage);
router.put("/users/:id", PassportManager.authenticate(), authController.changeInfo);
router.delete("/users/:id", PassportManager.authenticate(), authController.deleteUser);

export default router;
