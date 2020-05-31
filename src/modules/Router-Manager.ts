import fs, { StatsBase } from "fs";
import path from "path";
import { Router } from "express";
export interface RouterPath {
	router: Router;
	path: string;
}
/**
 * @description 라우터를 관리하는 모듈입니다.
 */
class RouterManager {
	public defaultRoutesPath = "/router";
	/**
	 * @description router 폴더 안에 있는 모든 라우터를 가져옴
	 * @returns {RouterPath[]} 라우터와 주소가 담긴 배열 반환
	 */
	public getRouters(currentPath: string = "/"): RouterPath[] {
		const routesPath: string = path.resolve(__dirname, `../${this.defaultRoutesPath}`, `./${currentPath}`);
		const dirs = fs.readdirSync(routesPath);
		const result: RouterPath[] = [];
		for (let fileName of dirs) {
			let filePath = path.join(routesPath, fileName);
			let stat: StatsBase<number> = fs.statSync(filePath);
			if (stat.isDirectory()) {
				result.push(...this.getRouters(path.join(currentPath, `/${fileName}`)));
				continue;
			}
			if (!fileName.match(/(.router.ts|.router.js)$/)) {
				continue;
			}
			const router = require(filePath).default;
			if (Object.getPrototypeOf(router) !== Router) {
				continue;
			}
			result.push({
				path: currentPath.replace(/\\/g, "/"),
				router,
			});
		}
		return result;
	}
}
export default new RouterManager();
