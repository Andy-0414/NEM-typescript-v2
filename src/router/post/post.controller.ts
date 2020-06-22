import { Request, Response, NextFunction } from "express";
import Post, { IPost } from "../../schema/Post";
import { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import { IUserSchema } from "../../schema/User";
import Controller from "../controller";
import Comment from "../../schema/Comment";

class PostController extends Controller {
	/**
	 * @description 글 생성
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async createPost(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			let postData = req.body as IPost;

			postData.owner = user._id;
			let post = await new Post(postData).save();
			return super.response(res, HTTPRequestCode.CREATE, post, "글 생성 성공");
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 글 목록 열람
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async readPosts(req: Request, res: Response, next: NextFunction) {
		try {
			let posts = await Post.find().populate("owner", "_id userID username");

			return super.response(res, HTTPRequestCode.OK, posts, "글 가져오기 성공");
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 글 열람
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async readPost(req: Request, res: Response, next: NextFunction) {
		try {
			let id = req.params.id;
			let post = await Post.findById(id);

			if (post) return super.response(res, HTTPRequestCode.OK, post, "글 가져오기 성공");
			else return next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 해당 글 댓글 열람
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async readPostComments(req: Request, res: Response, next: NextFunction) {
		try {
			let id = req.params.id;
			let post = await Post.findById(id);

			if (post) {
				return super.response(res, HTTPRequestCode.OK, await Comment.find({ post: post._id }).populate("owner", "_id userID username"), "해당 글 댓글 가져오기 성공");
			} else return next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 글 갱신
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async updatePost(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			let id = req.params.id;
			let postData = req.body as IPost;

			let post = await Post.findById(id);
			if (post) {
				if (post.ownerPermissionCheck(user)) return super.response(res, HTTPRequestCode.OK, await post.updateData(postData), "글 수정 성공");
				else return next(new StatusError(HTTPRequestCode.FORBIDDEN, "권한 없음"));
			} else return next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 글 삭제
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async deletePost(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			let id = req.params.id;

			let post = await Post.findById(id);
			if (post) {
				if (post.ownerPermissionCheck(user)) return super.response(res, HTTPRequestCode.NO_CONTENT, await Post.deleteOne(post), "글 삭제 성공");
				else return next(new StatusError(HTTPRequestCode.FORBIDDEN, "권한 없음"));
			} else return next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
		} catch (err) {
			return next(err);
		}
	}
}
export default new PostController();
