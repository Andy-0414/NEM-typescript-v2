import fs, { StatsBase } from "fs";
import path from "path";
export type SocketRouter = (io: SocketIO.Server, socket: SocketIO.Socket) => void;

class SocketIOManager {
	public defaultRoutesPath = "/socket";
	/**
	 * @description router 폴더 안에 있는 모든 라우터를 가져옴
	 * @param {path}routePath 라우터 주소 ( default : /router )
	 * @returns {RouterPath[]} 라우터와 주소가 담긴 배열 반환
	 */
	public getSockets(currentPath: string = "/"): SocketRouter[] {
		const socketPath: string = path.resolve(__dirname, `../${this.defaultRoutesPath}`, `./${currentPath}`);
		const dirs = fs.readdirSync(socketPath);
		const result: SocketRouter[] = [];
		for (let fileName of dirs) {
			let filePath = path.join(socketPath, fileName);
			let stat: StatsBase<number> = fs.statSync(filePath);
			if (stat.isDirectory()) {
				result.push(...this.getSockets(path.join(currentPath, `/${fileName}`)));
				continue;
			}
			if (!fileName.match(/(.socket.ts|.socket.js)$/)) {
				continue;
			}
			const socket = require(filePath).default;
			if ((typeof Object.getPrototypeOf(socket) as string) != "function") {
				continue;
			}
			result.push(socket);
		}
		return result;
	}
}
export default new SocketIOManager();
