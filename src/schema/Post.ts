import { Model, Schema, Document, model, HookNextFunction } from "mongoose";
import { ObjectID } from "bson";
import { IUserSchema } from "./User";
import Comment from "./Comment";

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
export interface IPostSchema extends IPost, Document {
	/**
	 * @description 이 글에 대한 권한을 체크합니다.
	 * @returns {boolean} 글의 주인 여부를 반환합니다.
	 */
	ownerPermissionCheck(user: IUserSchema): boolean;
	/**
	 * @description 이 글에 대한 정보를 수정합니다.
	 * @returns {boolean} 수정된 글을 반환합니다.
	 */
	updateData(post: IPost): Promise<IPostSchema>;
}

/**
 * @description User 모델에 대한 정적 메서드 ( collection )
 */
export interface IPostModel extends Model<IPostSchema> {}

PostSchema.methods.ownerPermissionCheck = function(this: IPostSchema, user: IUserSchema): boolean {
	return this.owner == user._id;
};

PostSchema.methods.updaetData = async function(this: IPostSchema, post: IPost): Promise<IPostSchema> {
	try {
		Object.keys(post).forEach(key => {
			if (NonUpdatableField.indexOf(key) == -1) this[key] = post[key];
		});
		return await this.save();
	} catch (err) {
		throw err;
	}
};

PostSchema.pre("remove", async function(this: IPostSchema, next: HookNextFunction) {
	try {
		let comment = await Comment.remove({ post: this._id });
		next();
	} catch (err) {
		next(err);
	}
});
export default model<IPostSchema>("Post", PostSchema) as IPostModel;
