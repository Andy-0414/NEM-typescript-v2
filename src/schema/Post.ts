import { Model, Schema, Document, model } from "mongoose";
import { ObjectID } from "bson";

export interface IPost {
	owner: Schema.Types.ObjectId;
	title: string;
	content: string;
	lastUpdateTime: Date;
	createTime: Date;
}
const PostSchema: Schema = new Schema({
	owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	title: { type: String, required: true },
	content: { type: String, required: true },
	lastUpdateTime: { type: Date, default: Date.now },
	createdTime: { type: Date, default: Date.now }
});
const NonUpdatableField = ["owner", "lastUpdateTime", "createdTime"];

/**
 * @description User 스키마에 대한 메서드 ( document )
 */
export interface IPostSchema extends IPost, Document {}

/**
 * @description User 모델에 대한 정적 메서드 ( collection )
 */
export interface IPostModel extends Model<IPostSchema> {}

PostSchema.pre("remove", () => {});
export default model<IPostSchema>("Post", PostSchema) as IPostModel;
