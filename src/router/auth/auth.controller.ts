import { Request, Response, NextFunction } from "express";
import User from "../../schema/User";
import SendRule, { HTTPRequestCode } from "../../modules/Send-Rule";

/**
 * @description 모든 유저를 가져옴
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const GetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let users = await User.find({}, { password: 0, salt: 0 });
		SendRule.response(res, HTTPRequestCode.OK, users, "유저 목록 가져오기 성공");
	} catch (err) {
		next(err);
	}
};
