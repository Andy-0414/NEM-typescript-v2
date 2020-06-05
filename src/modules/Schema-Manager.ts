import path from "path";
import fs, { StatsBase } from "fs";
import { Schema, Model } from "mongoose";

export interface SchemaFrame {
	schemaName: string;
	schemaShape: Object;
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
	public async getSchemaDataset(schemaName: string): Promise<Schema[]> {
		let schemaFrame = this.schemaFrameList.find((schemaFrame) => schemaFrame.schemaName == schemaName);
		if (schemaFrame) return schemaFrame.schema.find();
		else [];
	}
}

export default new SchemaManager();
