import { Router } from "express";
import PassportJWTManager from "../../modules/Passport-JWT-Auth";
import authController from "./auth.controller";

const router = Router();

router.post("/users/login", authController.login);
router.post("/users/token", PassportJWTManager.authenticate(), authController.getToken);
router.post("/users/my", PassportJWTManager.authenticate(), authController.my);

router.post("/users", authController.createUser);

router.get("/users", authController.getAllUsers);
router.get("/users/:id", authController.getUser);

router.post("/users/:id/reset-password", PassportJWTManager.authenticate(), authController.resetPassword);
router.put("/users/:id", PassportJWTManager.authenticate(), authController.changeInfo);
router.delete("/users/:id", PassportJWTManager.authenticate(), authController.deleteUser);

export default router;
