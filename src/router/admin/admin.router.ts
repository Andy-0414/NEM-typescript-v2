import { Router } from "express";
import adminController from "./admin.controller";
import PassportManager from "../../modules/Passport-Manager";

const router = Router();

router.get("/get-login-type", adminController.getLoginType);
router.get("/get-schema-shape", PassportManager.authenticate(), adminController.getSchemaShape);
router.post("/create-schema-dataset", PassportManager.authenticate(), adminController.createSchemaDataset);
router.post("/get-schema-dataset", PassportManager.authenticate(), adminController.getSchemaDataset);
router.post("/update-schema-dataset", PassportManager.authenticate(), adminController.updateSchemaDataset);
router.post("/delete-schema-dataset", PassportManager.authenticate(), adminController.deleteSchemaDataset);

export default router;
