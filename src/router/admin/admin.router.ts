import { Router } from "express";
import adminController from "./admin.controller";
import PassportManager from "../../modules/Passport-Manager";

const router = Router();

router.get("/get-login-type", adminController.getLoginType);
router.get("/get-schema-shape", PassportManager.authenticate(), adminController.getSchemaShape);
router.post("/get-schema-dataset", PassportManager.authenticate(), adminController.getSchemaDataset);
// TODO: crud 라우터 추가

export default router;
