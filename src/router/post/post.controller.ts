import { Request, Response, NextFunction } from "express";
import Post, { IPost } from "../../schema/Post";
import SendRule, { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import { IUserSchema } from "../../schema/User";

export const CreatePost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = req.user as IUserSchema;
		let postData = req.body as IPost;

		postData.owner = user._id;
		let post = await new Post(postData).save();
		SendRule.response(res, HTTPRequestCode.CREATE, post, "글 생성 성공");
	} catch (err) {
		next(err);
	}
};

export const ReadPosts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let posts = await Post.find();

		SendRule.response(res, HTTPRequestCode.OK, posts, "글 가져오기 성공");
	} catch (err) {
		next(err);
	}
};

export const ReadPost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let id = req.params.id;
		let post = await Post.findOne({ _id: id });

		if (post) SendRule.response(res, HTTPRequestCode.OK, post, "글 가져오기 성공");
		else next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
	} catch (err) {
		next(err);
	}
};

export const UpdatePost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = req.user as IUserSchema;
		let id = req.params.id;
		let postData = req.body as IPost;

		let post = await Post.findOne({ _id: id });
		if (post) {
			if (post.ownerPermissionCheck(user)) SendRule.response(res, HTTPRequestCode.OK, await post.updateData(postData), "글 수정 성공");
			else next(new StatusError(HTTPRequestCode.FORBIDDEN, "권한 없음"));
		} else next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
	} catch (err) {
		next(err);
	}
};

export const DeletePost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = req.user as IUserSchema;
		let id = req.params.id;

		let post = await Post.findOne({ _id: id });
		if (post) {
			if (post.ownerPermissionCheck(user)) SendRule.response(res, HTTPRequestCode.OK, await post.remove(), "글 삭제 성공");
			else next(new StatusError(HTTPRequestCode.FORBIDDEN, "권한 없음"));
		} else next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
	} catch (err) {
		next(err);
	}
};
