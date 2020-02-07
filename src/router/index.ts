import { Router } from "express";
const router = Router();

// 여기에다 라우터 추가
import Auth from "./auth/auth.router";

router.use("/auth", Auth);

export default router;
