import { Model, Schema, Document, model } from "mongoose";
import { IUserSchema } from "./User";
import { ObjectID } from "bson";

export interface IComment {
	post: ObjectID;
	owner: ObjectID;
	content: string;
	lastUpdateTime: Date;
	createTime: Date;
}
export const CommentSchema: Schema = new Schema({
	post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
	owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	content: { type: String, required: true },
	lastUpdateTime: { type: Date, default: Date.now },
	createdTime: { type: Date, default: Date.now },
});
const NonUpdatableField = ["post", "owner", "lastUpdateTime", "createdTime"];

/**
 * @description Comment 스키마에 대한 메서드 ( document )
 */
export interface ICommentSchema extends IComment, Document {
	/**
	 * @description 이 댓글에 대한 권한을 체크합니다.
	 * @returns {boolean} 댓글의 주인 여부를 반환합니다.
	 */
	ownerPermissionCheck(user: IUserSchema): boolean;
	/**
	 * @description 이 댓글에 대한 정보를 수정합니다.
	 * @returns {boolean} 수정된 댓글을 반환합니다.
	 */
	updateData(comment: IComment): Promise<ICommentSchema>;
}

/**
 * @description Comment 모델에 대한 정적 메서드 ( collection )
 */
export interface ICommentModel extends Model<ICommentSchema> {}

CommentSchema.methods.ownerPermissionCheck = function (this: ICommentSchema, user: ICommentSchema): boolean {
	return (this.owner as ObjectID).equals(user._id);
};

CommentSchema.methods.updateData = async function (this: ICommentSchema, comment: IComment): Promise<ICommentSchema> {
	try {
		Object.keys(comment).forEach((key) => {
			if (NonUpdatableField.indexOf(key) == -1) this[key] = comment[key];
		});
		return await this.save();
	} catch (err) {
		throw err;
	}
};

CommentSchema.pre("remove", () => {});
export default model<ICommentSchema>("Comment", CommentSchema) as ICommentModel;
