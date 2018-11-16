import { IGameState } from './../GameService/interfaces';
import {Socket} from 'socket.io';
import gameService from '../GameService';
import {Direction, ITanks, ITank} from '../GameService/interfaces';
import SOCKET_EVENTS from './socketEvents';

class SocketService {
    private socket: Socket | null = null
    private io: Socket | null = null

    constructor() {
        gameService.startUpdatingSycle(this.emitUpdate.bind(this))
    }

    public listen(socket: Socket, io: Socket) {
        this.registerSocket(socket, io)
        if (this.socket) this.bindSocketEvents()
    }

    private emitUpdate(gameState: IGameState) {
        if (this.io) {
            this.io.emit(SOCKET_EVENTS.UPDATE, gameState);
        }
    }

    private bindSocketEvents() {
        if (this.socket) {
            this.socket.on(SOCKET_EVENTS.REGISTER_USER, (name: string, fn) => {
                this.socket
                if (this.socket) {
                    gameService.addTank(name, this.socket.id)
                    fn(this.socket.id)
                }
            });

            this.socket.on(SOCKET_EVENTS.MOVE, ({id, direction}) => {
                gameService.registerMovement(id, direction)
            });

            this.socket.on(SOCKET_EVENTS.UPDATE_TANK, (tank: ITank) => {
                console.log('tank ', tank)
                gameService.updateTank(tank)
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