import { Router } from "express";
import { GetAllUsers, GetUser, CreateUser, Login, My } from "./auth.controller";
import PassportJWTManager from "../../modules/Passport-JWT-Auth";

const router = Router();

// Routers
router.post("/users/login", Login);
router.post("/users/my", PassportJWTManager.authenticate(), My);

router.post("/users", CreateUser);

router.get("/users", GetAllUsers);
router.get("/users/:id", GetUser);

export default router;
