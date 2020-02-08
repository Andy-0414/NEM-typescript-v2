import { Router } from "express";
import { GetAllUsers, GetUser, CreateUser, Login } from "./auth.controller";

const router = Router();

// Routers
router.post("/users/login", Login);

router.post("/users", CreateUser);

router.get("/users", GetAllUsers);
router.get("/users/:id", GetUser);

export default router;
