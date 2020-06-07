import path from "path";
import fs, { StatsBase } from "fs";
import { Schema, Model } from "mongoose";

export interface SchemaFrame {
	schemaName: string;
	schemaShape: {
		name: string;
		type: string;
		required: boolean;
		ref: string;
		select: boolean;
	}[];
	schema: Model<any>;
}
class SchemaManager {
	public defaultRoutesPath = "/schema";
	public schemaFrameList: SchemaFrame[] = [];
	constructor() {
		this.getSchemaFrames();
	}
	/**
	 * @description 모든 스키마의 형태를 가져옵니다.
	 * @returns {String} 리다이렉션 링크
	 */
	public getSchemaFrames(currentPath: string = "/"): SchemaFrame[] {
		const schemaPath: string = path.resolve(__dirname, `../${this.defaultRoutesPath}`, `./${currentPath}`);
		const dirs = fs.readdirSync(schemaPath);
		const result: SchemaFrame[] = [];
		for (let fileName of dirs) {
			let filePath = path.join(schemaPath, fileName);
			let schemaName = fileName.replace(".ts", "");
			let stat: StatsBase<number> = fs.statSync(filePath);
			if (stat.isDirectory()) {
				result.push(...this.getSchemaFrames(path.join(currentPath, `/${fileName}`)));
				continue;
			}
			const schema: Schema = require(filePath)[`${schemaName}Schema`];
			if (!(schema instanceof Schema)) {
				continue;
			}
			let schemaShape = Object.keys(schema.obj).map((key) => {
				return {
					name: key,
					type: (schema.paths[key] as any).instance,
					required: schema.obj[key].required || false,
					ref: schema.obj[key].ref || "",
					select: schema.obj[key].select != false,
				};
			});
			result.push({
				schemaName,
				schemaShape,
				schema: require(filePath).default,
			});
		}
		this.schemaFrameList = result;
		return result;
	}

	public async createSchemaDataset(schemaName: string, data: any): Promise<Schema | null> {
		let schemaFrame: SchemaFrame = this.schemaFrameList.find((schemaFrame) => schemaFrame.schemaName == schemaName);
		if (schemaFrame) {
			return await schemaFrame.schema.create(data);
		} else null;
	}
	public async getSchemaDataset(schemaName: string): Promise<Schema[]> {
		let schemaFrame: SchemaFrame = this.schemaFrameList.find((schemaFrame) => schemaFrame.schemaName == schemaName);
		if (schemaFrame) {
			let selectFalseList = schemaFrame.schemaShape
				.map((data) => {
					if (!data.select) return data.name;
					else return "";
				})
				.filter((str) => str != "");
			let selectStr = selectFalseList.length > 0 ? `+${selectFalseList.join(" +")}` : "";
			return await schemaFrame.schema.find().select(selectStr).exec(); // FIXME: toObjet 시 select:false 필드 소멸
		} else [];
	}
	public async updateSchemaDataset(schemaName: string, data: any): Promise<Schema | null> {
		let schemaFrame: SchemaFrame = this.schemaFrameList.find((schemaFrame) => schemaFrame.schemaName == schemaName);
		if (schemaFrame) {
			return await schemaFrame.schema.updateOne({ _id: data._id }, data);
		} else null;
	}
	public async deleteSchemaDataset(schemaName: string, _id: string): Promise<Schema | null> {
		let schemaFrame: SchemaFrame = this.schemaFrameList.find((schemaFrame) => schemaFrame.schemaName == schemaName);
		if (schemaFrame) {
			return await schemaFrame.schema.findByIdAndDelete(_id);
		} else null;
	}
}

export default new SchemaManager();
