import { Router } from "express";
import PassportManager, { LOGIN_TYPE } from "../../modules/Passport-Manager";
import authController from "./auth.controller";

const router = Router();

router.post("/users/login", PassportManager.getLoginMiddleware(), authController.login);

router.get("/users/login/github", PassportManager.authenticate(LOGIN_TYPE.GITHUB));
router.get(PassportManager.getCallbackURLByLoginType(LOGIN_TYPE.GITHUB), PassportManager.authenticate(LOGIN_TYPE.GITHUB), authController.getTokenOrRedirect);
router.get("/users/login/naver", PassportManager.authenticate(LOGIN_TYPE.NAVER));
router.get(PassportManager.getCallbackURLByLoginType(LOGIN_TYPE.NAVER), PassportManager.authenticate(LOGIN_TYPE.NAVER), authController.getTokenOrRedirect);
router.get("/users/login/google", PassportManager.authenticate(LOGIN_TYPE.GOOGLE));
router.get(PassportManager.getCallbackURLByLoginType(LOGIN_TYPE.GOOGLE), PassportManager.authenticate(LOGIN_TYPE.GOOGLE), authController.getTokenOrRedirect);
router.get("/users/login/kakao", PassportManager.authenticate(LOGIN_TYPE.KAKAO));
router.get(PassportManager.getCallbackURLByLoginType(LOGIN_TYPE.KAKAO), PassportManager.authenticate(LOGIN_TYPE.KAKAO), authController.getTokenOrRedirect);

router.post("/users/token", PassportManager.authenticate(), authController.getTokenOrRedirect);
router.post("/users/my", PassportManager.authenticate(), authController.my);
router.get("/users/my", PassportManager.authenticate(), authController.my);

router.post("/users", authController.createUser);

router.get("/users", authController.getAllUsers);
router.get("/users/:id", authController.getUser);

router.post("/users/:id/reset-password", PassportManager.authenticate(), authController.resetPassword);
router.post("/users/:id/change-profile-image", PassportManager.authenticate(), authController.changeProfileImage);
router.put("/users/:id", PassportManager.authenticate(), authController.changeInfo);
router.delete("/users/:id", PassportManager.authenticate(), authController.deleteUser);

export default router;
