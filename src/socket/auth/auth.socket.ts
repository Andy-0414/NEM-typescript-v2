import { SocketRouter } from "../../modules/SocketIO-Manager";

const socketRouter: SocketRouter = (io: SocketIO.Server, socket: SocketIO.Socket) => {
	socket.on("ping", () => {
		io.sockets.emit("pong", true);
	});
};

export default socketRouter;
