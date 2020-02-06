import { Model, Document, Schema, model } from "mongoose";
import * as jwt from "jwt-simple";
import * as crypto from "crypto";
import { HTTPRequestCode, StatusError } from "../modules/Send-Rule";

export interface EncryptionPassword {
	password: string;
	salt: string;
}
export interface IUserDefaultLogin {
	email: string;
	password: string;
}
export interface IUser extends IUserDefaultLogin {
	username: string;
	salt?: string;
	imagePath?: string;
	lastLoginTime?: Date;
	createdTime?: Date;
}
const UserSchema: Schema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	username: { type: String, default: "" },
	salt: { type: String, default: process.env.SECRET_KEY || "SECRET" },
	imgPath: { type: String, default: "" },
	lastLoginTime: { type: Date, default: Date.now },
	createdTime: { type: Date, default: Date.now }
});

/**
 * @description User 스키마에 대한 메서드 ( 레코드 )
 */
export interface IUserSchema extends IUser, Document {
	/**
	 * @description 이 유저에 대한 토큰을 생성합니다.
	 * @returns {string} 이 유저에 대한 토큰을 반홚바니다.
	 */
	getUserToken(): string;
}

/**
 * @description User 모델에 대한 정적 메서드 ( 테이블 )
 */
export interface IUserModel extends Model<IUserSchema> {
	/**
	 * @description 입력받은 유저의 토큰을 생성합니다.
	 * @returns {string} 입력받은 유저에 대한 토큰
	 */
	getToken(data: IUserSchema): string;
	/**
	 * @description 암호화 할 비밀번호를 입력받아 비밀번호와 암호화 키를 반환합니다.
	 * @param {string}password 암호화 할 비밀번호
	 * @returns {Promise<EncryptionPassword>} 비밀번호와 암호화 키를 반환합니다.
	 */
	createEncryptionPassword(password: string): Promise<EncryptionPassword>;
}

UserSchema.methods.getUserToken = function(this: IUserSchema): string {
	return (this.constructor as IUserModel).getToken(this);
};

UserSchema.statics.getToken = function(this: IUserModel, data: IUser): string {
	let user: IUserDefaultLogin = {
		email: data.email,
		password: data.password
	};
	return "Bearer " + jwt.encode(user, process.env.SECRET_KEY || "SECRET");
};

UserSchema.statics.createEncryptionPassword = async function(password: string): Promise<EncryptionPassword> {
	let data: EncryptionPassword = {
		password: "",
		salt: ""
	};
	try {
		data.salt = await crypto.randomBytes(64).toString("base64");
		data.password = crypto.pbkdf2Sync(password, data.salt, 10000, 64, "sha512").toString("base64");
		return data;
	} catch (err) {
		throw err;
	}
};

UserSchema.statics.createUser = async function(this: IUserModel, data: IUser): Promise<IUserSchema> {
	if ("email" in data && "password" in data) {
		let encryptionPassword = await this.createEncryptionPassword(data.password);
		data.password = encryptionPassword.password;
		data.salt = encryptionPassword.salt;

		let user = await new this(data).save();
		return user;
	} else {
		throw new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청");
	}
};
export default model<IUserSchema>("User", UserSchema) as IUserModel;
