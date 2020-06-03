import { Router } from "express";
import adminController from "./admin.controller";
import PassportManager from "../../modules/Passport-Manager";

const router = Router();

router.get("/get-login-type", PassportManager.authenticate(), adminController.getLoginType);
router.get("/get-schema-shape", PassportManager.authenticate(), adminController.getSchemaShape);

export default router;
