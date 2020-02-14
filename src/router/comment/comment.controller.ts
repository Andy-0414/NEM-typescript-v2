import { Request, Response, NextFunction } from "express";
import Post from "../../schema/Post";
import SendRule, { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import { IUserSchema } from "../../schema/User";
import Comment, { IComment } from "../../schema/Comment";

export const CreateComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = req.user as IUserSchema;
		let commentData = req.body as IComment;

		commentData.owner = user._id;
		let post = await Post.findOne({ _id: commentData.post });
		if (post) {
			let comment = await new Comment(commentData).save();
			SendRule.response(res, HTTPRequestCode.CREATE, comment, "댓글 생성 성공");
		} else {
			SendRule.response(res, HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않는 글");
		}
	} catch (err) {
		next(err);
	}
};

export const ReadComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let id = req.params.id;
		let comment = await Comment.findOne({ _id: id });

		if (comment) SendRule.response(res, HTTPRequestCode.OK, comment, "댓글 가져오기 성공");
		else next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
	} catch (err) {
		next(err);
	}
};

export const UpdateComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = req.user as IUserSchema;
		let id = req.params.id;
		let commentData = req.body as IComment;

		let comment = await Comment.findOne({ _id: id });
		if (comment) {
			if (comment.ownerPermissionCheck(user)) SendRule.response(res, HTTPRequestCode.OK, await comment.updateData(commentData), "글 수정 성공");
			else next(new StatusError(HTTPRequestCode.FORBIDDEN, undefined, "권한 없음"));
		} else next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
	} catch (err) {
		next(err);
	}
};

export const DeleteComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = req.user as IUserSchema;
		let id = req.params.id;

		let comment = await Comment.findOne({ _id: id });
		if (comment) {
			if (comment.ownerPermissionCheck(user)) SendRule.response(res, HTTPRequestCode.OK, await comment.remove(), "글 삭제 성공");
			else next(new StatusError(HTTPRequestCode.FORBIDDEN, "권한 없음"));
		} else next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
	} catch (err) {
		next(err);
	}
};
