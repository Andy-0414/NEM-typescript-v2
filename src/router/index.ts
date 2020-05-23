import { Router } from "express";
import RouterManager, { RouterPath } from "../modules/Router-Manager";

const router = Router();

// 라우터 자동 검색
RouterManager.getRouters().forEach((rp: RouterPath) => {
	router.use(rp.path, rp.router);
});

export default router;
