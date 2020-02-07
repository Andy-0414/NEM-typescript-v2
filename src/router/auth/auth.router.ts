import { Router } from "express";
import { GetAllUsers } from "./auth.controller";

const router = Router();

// Routers
router.get("/user", GetAllUsers);

export default router;
