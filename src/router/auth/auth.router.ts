import { Router } from "express";
import PassportManager, { LOGIN_TYPE } from "../../modules/Passport-Manager";
import authController from "./auth.controller";

const router = Router();

router.post("/user/login", PassportManager.getLoginMiddleware(), authController.login);
router.post("/user/logout", PassportManager.getLoginMiddleware(), authController.logout);

router.get("/user/login/github", PassportManager.authenticate(LOGIN_TYPE.GITHUB));
router.get(PassportManager.getCallbackURLByLoginType(LOGIN_TYPE.GITHUB), PassportManager.authenticate(LOGIN_TYPE.GITHUB), authController.getTokenOrRedirect);
router.get("/user/login/naver", PassportManager.authenticate(LOGIN_TYPE.NAVER));
router.get(PassportManager.getCallbackURLByLoginType(LOGIN_TYPE.NAVER), PassportManager.authenticate(LOGIN_TYPE.NAVER), authController.getTokenOrRedirect);
router.get("/user/login/google", PassportManager.authenticate(LOGIN_TYPE.GOOGLE));
router.get(PassportManager.getCallbackURLByLoginType(LOGIN_TYPE.GOOGLE), PassportManager.authenticate(LOGIN_TYPE.GOOGLE), authController.getTokenOrRedirect);
router.get("/user/login/kakao", PassportManager.authenticate(LOGIN_TYPE.KAKAO));
router.get(PassportManager.getCallbackURLByLoginType(LOGIN_TYPE.KAKAO), PassportManager.authenticate(LOGIN_TYPE.KAKAO), authController.getTokenOrRedirect);

router.post("/user/token", PassportManager.authenticate(), authController.getTokenOrRedirect);
router.post("/user/my", PassportManager.authenticate(), authController.my);
router.get("/user/my", PassportManager.authenticate(), authController.my);

router.post("/user", authController.createUser);

router.get("/user", authController.getAllUsers);
router.get("/user/:id", authController.getUser);

router.post("/user/:id/reset-password", PassportManager.authenticate(), authController.resetPassword);
router.post("/user/:id/change-profile-image", PassportManager.authenticate(), authController.changeProfileImage);
router.put("/user/:id", PassportManager.authenticate(), authController.changeInfo);
router.delete("/user/:id", PassportManager.authenticate(), authController.deleteUser);

export default router;
