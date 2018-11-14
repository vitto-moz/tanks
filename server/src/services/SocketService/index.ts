import {Socket} from 'socket.io';
import gameService from '../GameService';
import {direction, ITanks} from '../GameService/interfaces';
import SOCKET_EVENTS from './socketEvents';

class SocketService {
    private socket: Socket | null = null
    private io: Socket | null = null

    public listen(socket: Socket, io: Socket) {
        this.registerSocket(socket, io)
        gameService.startUpdatingSycle(this.emitUpdate.bind(this))
        if (this.socket) this.bindSocketEvents()
    }

    private emitUpdate(tanks: ITanks) {
        if (this.io) {
            this.io.emit(SOCKET_EVENTS.UPDATE, tanks);
        }
    }

    private bindSocketEvents() {
        if (this.socket) {
            this.socket.on(SOCKET_EVENTS.REGISTER_USER, (name: string) => {
                console.log('name', name)
                gameService.addTank(name)
            });

            this.socket.on(SOCKET_EVENTS.MOVE, (id: string, direction: direction) => {
                gameService.moveTank(id, direction)
            });

            this.socket.on(SOCKET_EVENTS.DISCONNECT, () => {
                console.log('Client disconnected');
            });
        }

    }

    private registerSocket(socket: Socket, io: Socket) {
        this.socket = socket
        this.io = io
    }

}

const socketService = new SocketService()
export default socketService