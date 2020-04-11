import { Request, Response, NextFunction } from "express";
import Post from "../../schema/Post";
import { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import { IUserSchema } from "../../schema/User";
import Comment, { IComment } from "../../schema/Comment";
import Controller from "../controller";

class CommentController extends Controller {
	/**
	 * @description 댓글 생성
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async createComment(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			let commentData = req.body as IComment;

			commentData.owner = user._id;
			let post = await Post.findById(commentData.post);
			if (post) {
				let comment = await new Comment(commentData).save();
				return super.response(res, HTTPRequestCode.CREATE, comment, "댓글 생성 성공");
			} else {
				return super.response(res, HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않는 글");
			}
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 댓글 열람
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async readComment(req: Request, res: Response, next: NextFunction) {
		try {
			let id = req.params.id;
			let comment = await Comment.findById(id);

			if (comment) return super.response(res, HTTPRequestCode.OK, comment, "댓글 가져오기 성공");
			else return next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 댓글 갱신
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async updateComment(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			let id = req.params.id;
			let commentData = req.body as IComment;

			let comment = await Comment.findById(id);
			if (comment) {
				if (comment.ownerPermissionCheck(user)) return super.response(res, HTTPRequestCode.OK, await comment.updateData(commentData), "글 수정 성공");
				else return next(new StatusError(HTTPRequestCode.FORBIDDEN, undefined, "권한 없음"));
			} else return next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
		} catch (err) {
			next(err);
		}
	}
	/**
	 * @description 댓글 삭제
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async deleteComment(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			let id = req.params.id;

			let comment = await Comment.findById(id);
			if (comment) {
				if (comment.ownerPermissionCheck(user)) return super.response(res, HTTPRequestCode.NO_CONTENT, await comment.remove(), "글 삭제 성공");
				else return next(new StatusError(HTTPRequestCode.FORBIDDEN, "권한 없음"));
			} else return next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
		} catch (err) {
			return next(err);
		}
	}
}

export default new CommentController();
