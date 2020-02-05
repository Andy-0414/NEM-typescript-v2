import { Model, Document, Schema, model } from "mongoose";

export interface IUser {
	email: string;
	password: string;
	imgPath: string;
	nickname?: string;
	lastLogin?: Date;
	createAt?: Date;
	salt?: string;
}
/**
 * @description User 스키마에 대한 메서드 ( 레코드 )
 */
export interface IUserSchema extends IUser, Document {}
/**
 * @description User 모델에 대한 정적 메서드 ( 테이블 )
 */
export interface IUserModel extends Model<IUserSchema> {}

const UserSchema: Schema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	nickname: { type: String, default: "" },
	imgPath: { type: String, default: "" },
	lastLogin: { type: Date, default: Date.now },
	createAt: { type: Date, default: Date.now },
	salt: { type: String, default: process.env.SECRET_KEY || "SECRET" }
});

export default model<IUserSchema>("User", UserSchema) as IUserModel;
