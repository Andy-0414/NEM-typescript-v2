import { Server as httpServer } from "http";
import { Server as httpsServer } from "https";
import SocketIO from "socket.io";
import SocketIOManager, { SocketRouter } from "../modules/SocketIO-Manager";

class SocketRegister {
	io: SocketIO.Server;
	socketRouters: SocketRouter[];
	constructor() {
		this.socketRouters = SocketIOManager.getSockets();
	}
	start(server: httpServer | httpsServer, option?: SocketIO.ServerOptions) {
		this.io = SocketIO(server, option || { origins: "*:*" });
		this.io.on("connection", (socket) => {
			this.socketRouters.forEach((socketRouter) => socketRouter(this.io, socket));
		});
	}
}
export default new SocketRegister();
