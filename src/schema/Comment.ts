import { Model, Schema, Document, model } from "mongoose";

export interface IComment {
	post: Schema.Types.ObjectId;
	owner: Schema.Types.ObjectId;
	content: string;
	lastUpdateTime: Date;
	createTime: Date;
}
const CommentSchema: Schema = new Schema({
	post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
	owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	content: { type: String, required: true },
	lastUpdateTime: { type: Date, default: Date.now },
	createdTime: { type: Date, default: Date.now }
});
const NonUpdatableField = ["post", "owner", "lastUpdateTime", "createdTime"];

/**
 * @description User 스키마에 대한 메서드 ( document )
 */
export interface ICommentSchema extends IComment, Document {}

/**
 * @description User 모델에 대한 정적 메서드 ( collection )
 */
export interface ICommentModel extends Model<ICommentSchema> {}

CommentSchema.pre("remove", () => {});
export default model<ICommentSchema>("Comment", CommentSchema) as ICommentModel;
