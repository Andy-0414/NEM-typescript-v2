import { Router } from "express";
import { GetAllUsers, GetUser, CreateUser, Login, My, ChangeInfo, DeleteUser, ResetPassword } from "./auth.controller";
import PassportJWTManager from "../../modules/Passport-JWT-Auth";

const router = Router();

router.post("/users/login", Login);
router.post("/users/my", PassportJWTManager.authenticate(), My);

router.post("/users", CreateUser);

router.get("/users", GetAllUsers);
router.get("/users/:id", GetUser);

router.post("/users/:id/reset-password", PassportJWTManager.authenticate(), ResetPassword);
router.put("/users/:id", PassportJWTManager.authenticate(), ChangeInfo);
router.delete("/users/:id", PassportJWTManager.authenticate(), DeleteUser);

export default router;
